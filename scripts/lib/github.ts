/** Minimal GitHub REST client for portfolio discovery (fetch-based, no SDK). */
import type { GitHubSource, RepoSummary } from './sync';

export const METADATA_FILES = ['.mhm-portfolio.json', 'mhm-portfolio.json'] as const;
const MAX_METADATA_BYTES = 64 * 1024;
const API = 'https://api.github.com';

type FetchLike = typeof fetch;

export class GitHubApiError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

export function createGitHubSource(opts: { token?: string; fetchImpl?: FetchLike; retries?: number } = {}): GitHubSource {
  const f = opts.fetchImpl ?? fetch;
  const retries = opts.retries ?? 2;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'mhm-portfolio-sync',
  };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  async function request(path: string): Promise<Response> {
    let last: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await f(`${API}${path}`, { headers, signal: AbortSignal.timeout(15_000) });
        if (res.status >= 500 || res.status === 429) throw new GitHubApiError(`HTTP ${res.status} untuk ${path}`, res.status);
        if (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0') throw new GitHubApiError('Had kadar (rate limit) GitHub dicapai', 403);
        return res;
      } catch (err) {
        last = err;
        if (attempt < retries) await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
      }
    }
    throw last instanceof Error ? last : new Error(String(last));
  }

  return {
    async listRepos(owner) {
      const out: RepoSummary[] = [];
      // /users/{owner}/repos returns PUBLIC repositories only (works for users and orgs).
      for (let page = 1; page <= 10; page++) {
        const res = await request(`/users/${encodeURIComponent(owner)}/repos?type=owner&per_page=100&page=${page}&sort=full_name`);
        if (!res.ok) throw new GitHubApiError(`Senarai repositori gagal: HTTP ${res.status}`, res.status);
        const data = (await res.json()) as Array<Record<string, unknown>>;
        if (!Array.isArray(data)) throw new GitHubApiError('Respons senarai repositori tidak dijangka', 0);
        for (const r of data) {
          out.push({
            fullName: String(r.full_name),
            private: r.private === true || r.visibility === 'private' || r.visibility === 'internal',
            archived: r.archived === true,
            fork: r.fork === true,
            topics: Array.isArray(r.topics) ? r.topics.map(String) : [],
            pushedAt: typeof r.pushed_at === 'string' ? r.pushed_at : null,
            defaultBranch: typeof r.default_branch === 'string' ? r.default_branch : 'main',
          });
        }
        if (data.length < 100) break;
      }
      return out;
    },

    async readMetadata(repo) {
      for (const file of METADATA_FILES) {
        const res = await request(`/repos/${repo.fullName}/contents/${file}?ref=${encodeURIComponent(repo.defaultBranch)}`);
        if (res.status === 404) continue;
        if (!res.ok) throw new GitHubApiError(`Metadata HTTP ${res.status}`, res.status);
        const body = (await res.json()) as { type?: string; size?: number; encoding?: string; content?: string };
        if (body.type !== 'file' || body.encoding !== 'base64' || typeof body.content !== 'string') throw new GitHubApiError(`${file} bukan fail yang sah`, 0);
        if ((body.size ?? 0) > MAX_METADATA_BYTES) throw new GitHubApiError(`${file} melebihi ${MAX_METADATA_BYTES} bait`, 0);
        const text = Buffer.from(body.content, 'base64').toString('utf8');
        try {
          return JSON.parse(text) as unknown;
        } catch {
          // Invalid JSON is a metadata problem, not an API outage: surface as validation error.
          return { __invalidJson: true };
        }
      }
      return null;
    },
  };
}
