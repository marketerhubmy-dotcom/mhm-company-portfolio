/**
 * Content validation gate (runs in CI, before every build and after sync).
 * Fails the build if published data is invalid, unapproved or references missing assets.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { validateProject, type Project } from '../src/features/portfolio/schema';

const ROOT = resolve(import.meta.dirname, '..');
const errors: string[] = [];
const fail = (m: string) => errors.push(m);

const generated = JSON.parse(readFileSync(join(ROOT, 'src/data/portfolio.generated.json'), 'utf8')) as Project[];
if (!Array.isArray(generated)) fail('portfolio.generated.json mesti array');

const slugs = new Set<string>();
for (const p of generated) {
  const res = validateProject(p, { source: p.source, repository: p.repositoryReference ?? undefined });
  if (!res.ok) { res.errors.forEach((e) => fail(`${p.slug ?? '?'}: ${e}`)); continue; }
  if (p.approvedForPublic !== true) fail(`${p.slug}: projek belum diluluskan tidak boleh diterbitkan`);
  if (slugs.has(p.slug)) fail(`${p.slug}: slug pendua`);
  slugs.add(p.slug);
  for (const img of [p.thumbnail, ...p.galleryImages].filter(Boolean)) {
    for (const src of [img!.src, ...Object.values(img!.srcset ?? {})]) {
      if (src.startsWith('/') && !existsSync(join(ROOT, 'public', src))) fail(`${p.slug}: imej tiada → public${src}`);
    }
  }
}

const approvals = JSON.parse(readFileSync(join(ROOT, 'content/approvals.json'), 'utf8')) as { repositories?: unknown };
if (!approvals.repositories || typeof approvals.repositories !== 'object' || Array.isArray(approvals.repositories)) {
  fail('content/approvals.json: "repositories" mesti objek');
} else {
  for (const [repo, entry] of Object.entries(approvals.repositories as Record<string, Record<string, unknown>>)) {
    if (!/^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/.test(repo)) fail(`approvals: kunci "${repo}" mesti owner/repo`);
    if (entry.approvedForPublic !== undefined && typeof entry.approvedForPublic !== 'boolean') fail(`approvals.${repo}.approvedForPublic mesti boolean`);
  }
}

if (errors.length) {
  errors.forEach((e) => console.error(`✗ ${e}`));
  console.error(`\nPengesahan kandungan GAGAL (${errors.length} ralat).`);
  process.exit(1);
}
console.log(`✓ Kandungan sah — ${generated.length} projek awam.`);
