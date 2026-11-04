/**
 * Portfolio sync CLI.
 *
 *   tsx scripts/sync-portfolio.ts            → online: discover GitHub repos + compile
 *   tsx scripts/sync-portfolio.ts --offline  → compile from committed content only
 *   tsx scripts/sync-portfolio.ts --dry-run  → report without writing files
 *
 * Env: PORTFOLIO_SYNC_TOKEN or GITHUB_TOKEN (read-only use). Never exposed to the site.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync, rmSync, appendFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { validateProject, type Project } from '../src/features/portfolio/schema';
import { runSync, stableStringify, type ApprovalRegistry, type LogEntry } from './lib/sync';
import { createGitHubSource } from './lib/github';

const ROOT = resolve(import.meta.dirname, '..');
const MANUAL_DIR = join(ROOT, 'content/projects');
const SYNCED_DIR = join(ROOT, 'content/synced');
const APPROVALS = join(ROOT, 'content/approvals.json');
const OUTPUT = join(ROOT, 'src/data/portfolio.generated.json');

const args = new Set(process.argv.slice(2));
const offline = args.has('--offline');
const dryRun = args.has('--dry-run');
const inActions = process.env.GITHUB_ACTIONS === 'true';

function emit(entry: LogEntry) {
  const text = entry.repo ? `[${entry.repo}] ${entry.message}` : entry.message;
  if (inActions && entry.level !== 'info') {
    const cmd = entry.level === 'notice' ? 'notice' : entry.level;
    console.log(`::${cmd} title=portfolio-sync::${text.replace(/\r?\n/g, ' ')}`);
  } else console.log(`${entry.level.toUpperCase().padEnd(7)} ${text}`);
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function loadManual(): { projects: Project[]; errors: number } {
  let errors = 0;
  const projects: Project[] = [];
  for (const file of readdirSync(MANUAL_DIR).filter((f) => f.endsWith('.json')).sort()) {
    const res = validateProject(readJson(join(MANUAL_DIR, file)), { source: 'manual' });
    res.warnings.filter((w) => !w.includes('$schema')).forEach((w) => emit({ level: 'notice', message: w, repo: `manual/${file}` }));
    if (!res.ok) {
      errors++;
      res.errors.forEach((e) => emit({ level: 'error', message: e, repo: `manual/${file}` }));
      continue;
    }
    if (`${res.value.slug}.json` !== file) emit({ level: 'warning', message: `Nama fail sepatutnya ${res.value.slug}.json`, repo: `manual/${file}` });
    projects.push(res.value);
  }
  return { projects, errors };
}

function loadSynced(): Record<string, Project> {
  const out: Record<string, Project> = {};
  if (!existsSync(SYNCED_DIR)) return out;
  for (const file of readdirSync(SYNCED_DIR).filter((f) => f.endsWith('.json'))) {
    const raw = readJson(join(SYNCED_DIR, file)) as { repositoryReference?: string };
    const repo = raw.repositoryReference ?? '';
    const res = validateProject(raw, { source: 'github', repository: repo });
    if (res.ok) out[repo.toLowerCase()] = { ...res.value, approvedForPublic: true };
    else emit({ level: 'warning', message: `Cache tidak sah diabaikan: ${res.errors.join('; ')}`, repo: `synced/${file}` });
  }
  return out;
}

function writeIfChanged(path: string, content: string): boolean {
  if (existsSync(path) && readFileSync(path, 'utf8') === content) return false;
  if (!dryRun) writeFileSync(path, content);
  return true;
}

async function main() {
  const manual = loadManual();
  const approvals = readJson(APPROVALS) as ApprovalRegistry;
  const previousSynced = loadSynced();
  const token = process.env.PORTFOLIO_SYNC_TOKEN || process.env.GITHUB_TOKEN || undefined;

  const result = await runSync({
    github: offline ? null : createGitHubSource({ token }),
    manual: manual.projects,
    approvals,
    previousSynced,
  });
  result.log.forEach(emit);

  // Write synced snapshots (approved public repos only).
  const changed: string[] = [];
  if (!offline && !result.discoveryFailed) {
    if (!dryRun) mkdirSync(SYNCED_DIR, { recursive: true });
    const wanted = new Set<string>();
    for (const [repo, p] of Object.entries(result.synced)) {
      const file = `${repo.replace('/', '__')}.json`;
      wanted.add(file);
      if (writeIfChanged(join(SYNCED_DIR, file), stableStringify(p))) changed.push(`content/synced/${file}`);
    }
    for (const file of readdirSync(SYNCED_DIR).filter((f) => f.endsWith('.json'))) {
      if (!wanted.has(file)) { if (!dryRun) rmSync(join(SYNCED_DIR, file)); changed.push(`content/synced/${file} (dibuang)`); }
    }
  }
  if (writeIfChanged(OUTPUT, stableStringify(result.published))) changed.push('src/data/portfolio.generated.json');

  const s = result.stats;
  const summary = [
    `## Portfolio sync ${offline ? '(offline)' : ''}${dryRun ? ' (dry run)' : ''}`,
    '',
    `| Diterbitkan | Manual | GitHub diluluskan | Menunggu kelulusan | Tidak sah | Private dilangkau | Dikekalkan (fallback) | Dibuang |`,
    `|---|---|---|---|---|---|---|---|`,
    `| ${result.published.length} | ${manual.projects.length} | ${s.approved} | ${s.pending} | ${s.invalid} | ${s.skippedPrivate} | ${s.kept} | ${s.removed} |`,
    '',
    result.pending.length ? `### Menunggu tindakan\n${result.pending.map((p) => `- \`${p.repo}\` — ${p.reason}`).join('\n')}` : '',
    changed.length ? `### Fail berubah\n${changed.map((c) => `- ${c}`).join('\n')}` : 'Tiada perubahan data.',
  ].join('\n');
  console.log('\n' + summary);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');

  // Manual entry errors fail the run (they are under our control); GitHub
  // failures do not — the previous public data is kept instead.
  if (manual.errors) process.exit(1);
}

main().catch((err) => {
  emit({ level: 'error', message: `Sync gagal tanpa dijangka: ${(err as Error).stack ?? err}` });
  process.exit(1);
});
