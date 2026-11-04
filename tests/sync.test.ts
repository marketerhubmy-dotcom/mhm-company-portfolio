import { describe, expect, it } from 'vitest';
import { runSync, stableStringify, type GitHubSource, type RepoSummary } from '../scripts/lib/sync';
import { createGitHubSource } from '../scripts/lib/github';
import { validateProject, type Project } from '../src/features/portfolio/schema';

const OWNER = 'marketerhubmy-dotcom';
const repo = (name: string, extra: Partial<RepoSummary> = {}): RepoSummary => ({
  fullName: `${OWNER}/${name}`, private: false, archived: false, fork: false, topics: ['mhm-portfolio'],
  pushedAt: '2026-10-20T10:00:00Z', defaultBranch: 'main', ...extra,
});
const meta = (slug: string, extra: Record<string, unknown> = {}) => ({
  slug, title: `Projek ${slug}`, description: 'Penerangan projek yang cukup panjang untuk lulus.', category: 'saas',
  projectType: 'SaaS', status: 'prototype', approvedForPublic: true, ...extra,
});
const manual = (slug: string): Project => {
  const r = validateProject({ ...meta(slug), approvedForPublic: true, updatedAt: '2026-01-01' }, { source: 'manual' });
  if (!r.ok) throw new Error('fixture');
  return r.value;
};
function fakeGitHub(repos: RepoSummary[], files: Record<string, unknown | Error | null>): GitHubSource {
  return {
    listRepos: async () => repos,
    readMetadata: async (r) => {
      const v = files[r.fullName];
      if (v instanceof Error) throw v;
      return v ?? null;
    },
  };
}

describe('runSync', () => {
  it('does NOT publish discovered repos until approved in the registry (even if metadata claims approval)', async () => {
    const res = await runSync({
      github: fakeGitHub([repo('app')], { [`${OWNER}/app`]: meta('app') }),
      manual: [], approvals: { repositories: {} }, previousSynced: {},
    });
    expect(res.published).toHaveLength(0);
    expect(res.pending[0]?.repo).toBe(`${OWNER}/app`);
    expect(res.stats.pending).toBe(1);
  });

  it('publishes approved repos with editorial overrides and fallback updatedAt', async () => {
    const res = await runSync({
      github: fakeGitHub([repo('app')], { [`${OWNER}/app`]: meta('app') }),
      manual: [],
      approvals: { repositories: { [`${OWNER}/app`]: { approvedForPublic: true, featured: true, displayOrder: 5, overrides: { title: 'Tajuk Editorial' } } } },
      previousSynced: {},
    });
    expect(res.published).toHaveLength(1);
    const p = res.published[0]!;
    expect(p).toMatchObject({ title: 'Tajuk Editorial', featured: true, displayOrder: 5, source: 'github', repositoryReference: `${OWNER}/app`, updatedAt: '2026-10-20' });
  });

  it('ignores repos without the topic, from other owners, and never reads private repos', async () => {
    let readPrivate = false;
    const gh: GitHubSource = {
      listRepos: async () => [repo('untagged', { topics: [] }), repo('secret', { private: true }), { ...repo('x'), fullName: 'other/x' }],
      readMetadata: async (r) => { if (r.private) readPrivate = true; return meta('x'); },
    };
    const res = await runSync({ github: gh, manual: [], approvals: { repositories: {} }, previousSynced: {} });
    expect(readPrivate).toBe(false);
    expect(res.stats.discovered).toBe(1);
    expect(res.stats.skippedPrivate).toBe(1);
    expect(res.log.some((l) => l.message.includes('secret') || l.repo?.includes('secret'))).toBe(false);
  });

  it('keeps existing public projects when discovery fails', async () => {
    const prev = { ...manual('lama'), source: 'github' as const, repositoryReference: `${OWNER}/lama` };
    const gh: GitHubSource = { listRepos: async () => { throw new Error('HTTP 502'); }, readMetadata: async () => null };
    const res = await runSync({ github: gh, manual: [], approvals: { repositories: { [`${OWNER}/lama`]: { approvedForPublic: true } } }, previousSynced: { [`${OWNER}/lama`]: prev } });
    expect(res.discoveryFailed).toBe(true);
    expect(res.published.map((p) => p.slug)).toEqual(['lama']);
    expect(res.log[0]?.level).toBe('error');
  });

  it('keeps last valid snapshot when metadata read fails or becomes invalid', async () => {
    const prevA = { ...manual('aa'), source: 'github' as const, repositoryReference: `${OWNER}/a` };
    const prevB = { ...manual('bb'), source: 'github' as const, repositoryReference: `${OWNER}/b` };
    const res = await runSync({
      github: fakeGitHub([repo('a'), repo('b')], { [`${OWNER}/a`]: new Error('timeout'), [`${OWNER}/b`]: { slug: 'B!!' } }),
      manual: [],
      approvals: { repositories: { [`${OWNER}/a`]: { approvedForPublic: true }, [`${OWNER}/b`]: { approvedForPublic: true } } },
      previousSynced: { [`${OWNER}/a`]: prevA, [`${OWNER}/b`]: prevB },
    });
    expect(res.published.map((p) => p.slug).sort()).toEqual(['aa', 'bb']);
    expect(res.stats.invalid).toBe(1);
    expect(res.stats.kept).toBe(2);
  });

  it('removes projects whose repo is no longer marked (when discovery succeeded)', async () => {
    const prev = { ...manual('lama'), source: 'github' as const, repositoryReference: `${OWNER}/lama` };
    const res = await runSync({ github: fakeGitHub([], {}), manual: [], approvals: { repositories: {} }, previousSynced: { [`${OWNER}/lama`]: prev } });
    expect(res.published).toHaveLength(0);
    expect(res.stats.removed).toBe(1);
  });

  it('dedupes: manual entry wins over a synced entry with the same slug', async () => {
    const res = await runSync({
      github: fakeGitHub([repo('dup')], { [`${OWNER}/dup`]: meta('sama') }),
      manual: [manual('sama')],
      approvals: { repositories: { [`${OWNER}/dup`]: { approvedForPublic: true } } },
      previousSynced: {},
    });
    expect(res.published).toHaveLength(1);
    expect(res.published[0]!.source).toBe('manual');
    expect(res.log.some((l) => l.message.includes('pendua'))).toBe(true);
  });

  it('offline mode re-applies registry to cached snapshots (approval can be revoked without network)', async () => {
    const prev = { ...manual('lama'), source: 'github' as const, repositoryReference: `${OWNER}/lama` };
    const res = await runSync({ github: null, manual: [], approvals: { repositories: { [`${OWNER}/lama`]: { approvedForPublic: false } } }, previousSynced: { [`${OWNER}/lama`]: prev } });
    expect(res.published).toHaveLength(0);
  });

  it('produces byte-identical output for unchanged data (no commit loops)', async () => {
    const input = { github: null, manual: [manual('bb'), manual('aa')], approvals: { repositories: {} }, previousSynced: {} };
    const one = stableStringify((await runSync(input)).published);
    const two = stableStringify((await runSync({ ...input, manual: [manual('aa'), manual('bb')] })).published);
    expect(one).toBe(two);
  });
});

describe('GitHub client', () => {
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

  it('lists public repos and decodes base64 metadata; 404 → null', async () => {
    const calls: string[] = [];
    const fetchImpl = (async (url: string) => {
      calls.push(url);
      if (url.includes('/users/')) return json([{ full_name: `${OWNER}/app`, private: false, topics: ['mhm-portfolio'], default_branch: 'main', pushed_at: '2026-01-01T00:00:00Z' }]);
      if (url.includes('/app/contents/.mhm-portfolio.json')) return json({ type: 'file', encoding: 'base64', size: 20, content: Buffer.from('{"slug":"app"}').toString('base64') });
      return json({ message: 'Not Found' }, 404);
    }) as typeof fetch;
    const gh = createGitHubSource({ fetchImpl, retries: 0 });
    const repos = await gh.listRepos(OWNER);
    expect(repos[0]).toMatchObject({ fullName: `${OWNER}/app`, topics: ['mhm-portfolio'] });
    expect(await gh.readMetadata(repos[0]!)).toEqual({ slug: 'app' });
    expect(await gh.readMetadata({ ...repos[0]!, fullName: `${OWNER}/none` })).toBeNull();
    expect(calls.every((c) => c.startsWith('https://api.github.com/'))).toBe(true);
  });

  it('throws on server errors after retries (caller keeps previous data)', async () => {
    let n = 0;
    const fetchImpl = (async () => { n++; return json({}, 503); }) as unknown as typeof fetch;
    await expect(createGitHubSource({ fetchImpl, retries: 1 }).listRepos(OWNER)).rejects.toThrow(/503/);
    expect(n).toBe(2);
  });
});
