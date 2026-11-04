/**
 * Portfolio sync engine — pure logic, no network or filesystem access.
 * See docs/AUTO-SYNC.md for the full behaviour description.
 */
import {
  DISCOVERY_TOPIC, PORTFOLIO_OWNER, sortProjects, validateProject,
  type Project, type ProjectStatus,
} from '../../src/features/portfolio/schema';

export type RepoSummary = {
  fullName: string;
  private: boolean;
  archived: boolean;
  fork: boolean;
  topics: string[];
  pushedAt: string | null;
  defaultBranch: string;
};

export interface GitHubSource {
  /** Lists repositories of the owner. Throws on API failure. */
  listRepos(owner: string): Promise<RepoSummary[]>;
  /** Returns parsed metadata JSON, null if the file does not exist. Throws on API failure. */
  readMetadata(repo: RepoSummary): Promise<unknown | null>;
}

export type ApprovalEntry = {
  approvedForPublic?: boolean;
  approvedBy?: string;
  approvedAt?: string;
  featured?: boolean;
  displayOrder?: number;
  status?: ProjectStatus;
  overrides?: { title?: string; tagline?: string; description?: string; projectType?: string };
  note?: string;
};
export type ApprovalRegistry = { repositories: Record<string, ApprovalEntry> };

export type LogLevel = 'info' | 'notice' | 'warning' | 'error';
export type LogEntry = { level: LogLevel; message: string; repo?: string };

export type SyncInput = {
  github: GitHubSource | null; // null → offline compile (no network)
  manual: Project[];
  approvals: ApprovalRegistry;
  /** Previously synced (approved) GitHub entries keyed by repository full name. */
  previousSynced: Record<string, Project>;
  owner?: string;
  topic?: string;
};

export type SyncResult = {
  synced: Record<string, Project>;
  published: Project[];
  pending: { repo: string; reason: string }[];
  log: LogEntry[];
  discoveryFailed: boolean;
  stats: { discovered: number; skippedPrivate: number; approved: number; pending: number; invalid: number; kept: number; removed: number };
};

const lower = (s: string) => s.toLowerCase();

export function applyApproval(project: Project, entry: ApprovalEntry | undefined): Project {
  const approved = entry?.approvedForPublic === true;
  const o = entry?.overrides ?? {};
  return {
    ...project,
    ...(o.title ? { title: o.title } : {}),
    ...(o.tagline ? { tagline: o.tagline } : {}),
    ...(o.description ? { description: o.description } : {}),
    ...(o.projectType ? { projectType: o.projectType } : {}),
    ...(entry?.status ? { status: entry.status } : {}),
    featured: entry?.featured ?? project.featured,
    displayOrder: Number.isInteger(entry?.displayOrder) ? (entry!.displayOrder as number) : project.displayOrder,
    // The registry is the ONLY source of truth for public approval of discovered repos.
    approvedForPublic: approved,
  };
}

export async function runSync(input: SyncInput): Promise<SyncResult> {
  const owner = input.owner ?? PORTFOLIO_OWNER;
  const topic = input.topic ?? DISCOVERY_TOPIC;
  const log: LogEntry[] = [];
  const pending: SyncResult['pending'] = [];
  const stats = { discovered: 0, skippedPrivate: 0, approved: 0, pending: 0, invalid: 0, kept: 0, removed: 0 };
  const registry = Object.fromEntries(Object.entries(input.approvals.repositories ?? {}).map(([k, v]) => [lower(k), v]));
  const previous = Object.fromEntries(Object.entries(input.previousSynced).map(([k, v]) => [lower(k), v]));
  let synced: Record<string, Project> = {};
  let discoveryFailed = false;

  if (!input.github) {
    // Offline: re-apply the registry to cached snapshots (approval edits take effect without network).
    for (const [key, p] of Object.entries(previous)) {
      const next = applyApproval(p, registry[key]);
      if (next.approvedForPublic) synced[key] = next;
      else log.push({ level: 'notice', message: 'Kelulusan ditarik balik dalam approvals.json — tidak diterbitkan', repo: key });
    }
  } else {
    let repos: RepoSummary[] = [];
    try {
      repos = await input.github.listRepos(owner);
    } catch (err) {
      discoveryFailed = true;
      log.push({ level: 'error', message: `Discovery GitHub gagal — projek sedia ada dikekalkan: ${(err as Error).message}` });
      synced = { ...previous };
      stats.kept = Object.keys(synced).length;
    }

    if (!discoveryFailed) {
      const marked = repos.filter((r) => r.topics.map(lower).includes(lower(topic)) && lower(r.fullName.split('/')[0]!) === lower(owner));
      stats.discovered = marked.length;
      const seen = new Set<string>();

      for (const repo of marked) {
        const key = lower(repo.fullName);
        seen.add(key);
        if (repo.private) {
          // Never read or publish private repositories. Name is NOT logged (logs may be public).
          stats.skippedPrivate++;
          continue;
        }
        if (repo.archived) log.push({ level: 'notice', message: 'Repositori diarkibkan — masih diproses mengikut kelulusan', repo: repo.fullName });

        let raw: unknown | null;
        try {
          raw = await input.github.readMetadata(repo);
        } catch (err) {
          log.push({ level: 'warning', message: `Gagal membaca metadata (${(err as Error).message}) — versi terakhir dikekalkan jika ada`, repo: repo.fullName });
          if (previous[key]) { synced[key] = applyApproval(previous[key]!, registry[key]); stats.kept++; }
          continue;
        }
        if (raw === null) {
          pending.push({ repo: repo.fullName, reason: 'Tiada fail .mhm-portfolio.json' });
          log.push({ level: 'warning', message: 'Ditanda mhm-portfolio tetapi tiada .mhm-portfolio.json', repo: repo.fullName });
          continue;
        }
        const result = validateProject(raw, { source: 'github', repository: repo.fullName });
        result.warnings.forEach((w) => log.push({ level: 'notice', message: w, repo: repo.fullName }));
        if (!result.ok) {
          stats.invalid++;
          result.errors.forEach((e) => log.push({ level: 'error', message: `Metadata tidak sah: ${e}`, repo: repo.fullName }));
          if (previous[key]) { synced[key] = applyApproval(previous[key]!, registry[key]); stats.kept++; log.push({ level: 'warning', message: 'Versi sah terakhir dikekalkan', repo: repo.fullName }); }
          continue;
        }
        const base = result.value;
        if (base.updatedAt === '1970-01-01' && repo.pushedAt) base.updatedAt = repo.pushedAt.slice(0, 10);
        const project = applyApproval(base, registry[key]);
        if (!project.approvedForPublic) {
          stats.pending++;
          const reason = registry[key] ? 'Disekat dalam approvals.json' : 'Menunggu kelulusan dalam content/approvals.json';
          pending.push({ repo: repo.fullName, reason });
          log.push({ level: 'notice', message: reason, repo: repo.fullName });
          continue;
        }
        stats.approved++;
        synced[key] = project;
      }

      for (const key of Object.keys(previous)) {
        if (!seen.has(key)) {
          stats.removed++;
          log.push({ level: 'warning', message: 'Tidak lagi ditanda mhm-portfolio / tidak dijumpai — dikeluarkan', repo: key });
        }
      }
    }
  }

  // Merge: manual entries are authoritative; dedupe on slug and repository.
  const published: Project[] = [];
  const slugs = new Set<string>();
  const repoRefs = new Set<string>();
  const add = (p: Project, origin: string) => {
    if (!p.approvedForPublic) return;
    if (slugs.has(p.slug)) return void log.push({ level: 'warning', message: `Slug pendua "${p.slug}" diabaikan (${origin})` });
    if (p.repositoryReference && repoRefs.has(lower(p.repositoryReference))) {
      return void log.push({ level: 'warning', message: `Repositori pendua ${p.repositoryReference} diabaikan (${origin})` });
    }
    slugs.add(p.slug);
    if (p.repositoryReference) repoRefs.add(lower(p.repositoryReference));
    published.push(p);
  };
  sortProjects(input.manual).forEach((p) => add(p, 'manual'));
  Object.entries(synced).sort(([a], [b]) => a.localeCompare(b)).forEach(([k, p]) => add(p, k));

  return { synced, published: sortProjects(published), pending, log, discoveryFailed, stats };
}

/** Deterministic JSON so unchanged data produces byte-identical files (no empty commits). */
export function stableStringify(value: unknown): string {
  const norm = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(norm);
    if (v && typeof v === 'object') {
      return Object.fromEntries(Object.keys(v as object).sort().filter((k) => (v as Record<string, unknown>)[k] !== undefined).map((k) => [k, norm((v as Record<string, unknown>)[k])]));
    }
    return v;
  };
  return JSON.stringify(norm(value), null, 2) + '\n';
}
