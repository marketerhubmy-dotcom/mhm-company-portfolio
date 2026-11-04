import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { isAllowedImageSrc, isSafePublicUrl, validateProject } from '../src/features/portfolio/schema';

const base = {
  slug: 'contoh-projek',
  title: 'Contoh Projek',
  description: 'Penerangan projek yang cukup panjang untuk lulus.',
  category: 'web-app',
  projectType: 'Web App',
  status: 'demo',
  updatedAt: '2026-10-01',
};

describe('validateProject', () => {
  it('accepts a minimal valid entry and defaults to NOT public', () => {
    const r = validateProject(base, { source: 'manual' });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.approvedForPublic).toBe(false);
      expect(r.value.featured).toBe(false);
      expect(r.value.id).toBe('contoh-projek');
      expect(r.value.source).toBe('manual');
    }
  });

  it('rejects bad slug, category, status and short description', () => {
    const r = validateProject({ ...base, slug: 'Bad Slug', category: 'x', status: 'live', description: 'pendek' }, { source: 'manual' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.length).toBeGreaterThanOrEqual(4);
  });

  it('rejects non-https and local demo URLs', () => {
    for (const demoUrl of ['http://x.com', 'javascript:alert(1)', 'https://localhost/a', 'https://127.0.0.1', 'https://user:pw@x.com']) {
      expect(validateProject({ ...base, demoUrl }, { source: 'manual' }).ok, demoUrl).toBe(false);
    }
  });

  it('strips control / bidi characters and drops unknown keys', () => {
    const r = validateProject({ ...base, title: 'Tajuk‮\u0007 Baik', evil: '<script>' }, { source: 'manual' });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.title).toBe('Tajuk Baik');
      expect(r.value).not.toHaveProperty('evil');
      expect(r.warnings.some((w) => w.includes('evil'))).toBe(true);
    }
  });

  it('forces repositoryReference to the source repo for github entries', () => {
    const r = validateProject({ ...base, repositoryReference: 'marketerhubmy-dotcom/other' }, { source: 'github', repository: 'marketerhubmy-dotcom/real' });
    expect(r.ok && r.value.repositoryReference).toBe('marketerhubmy-dotcom/real');
  });

  it('rejects repositories from other owners', () => {
    expect(validateProject(base, { source: 'github', repository: 'someone-else/repo' }).ok).toBe(false);
  });

  it('requires image dimensions and allowed sources', () => {
    const img = { src: '/projects/contoh-projek/a.webp', alt: 'Skrin utama', width: 800, height: 500 };
    expect(validateProject({ ...base, thumbnail: img }, { source: 'manual' }).ok).toBe(true);
    expect(validateProject({ ...base, thumbnail: { ...img, width: undefined } }, { source: 'manual' }).ok).toBe(false);
    expect(validateProject({ ...base, thumbnail: { ...img, src: 'https://evil.example/a.webp' } }, { source: 'manual' }).ok).toBe(false);
  });
});

describe('image + url guards', () => {
  it('allows raw.githubusercontent only for the same repository', () => {
    const repo = 'marketerhubmy-dotcom/app';
    expect(isAllowedImageSrc('https://raw.githubusercontent.com/marketerhubmy-dotcom/app/main/shot.webp', repo)).toBe(true);
    expect(isAllowedImageSrc('https://raw.githubusercontent.com/marketerhubmy-dotcom/other/main/shot.webp', repo)).toBe(false);
    expect(isAllowedImageSrc('https://raw.githubusercontent.com/marketerhubmy-dotcom/app/main/shot.svg', repo)).toBe(false);
    expect(isAllowedImageSrc('/projects/x/../../etc.webp')).toBe(false);
  });
  it('isSafePublicUrl', () => {
    expect(isSafePublicUrl('https://demo-odajah-erp.marketerhubmy.workers.dev')).toBe(true);
    expect(isSafePublicUrl('ftp://x.com')).toBe(false);
  });
});

describe('committed content', () => {
  it('every manual project file is valid', () => {
    const dir = 'content/projects';
    for (const f of readdirSync(dir)) {
      const r = validateProject(JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')), { source: 'manual' });
      expect(r.ok, `${f}: ${!r.ok ? r.errors.join('; ') : ''}`).toBe(true);
    }
  });
  it('generated portfolio contains only approved projects', () => {
    const list = JSON.parse(readFileSync('src/data/portfolio.generated.json', 'utf8')) as { approvedForPublic: boolean; slug: string }[];
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((p) => p.approvedForPublic)).toBe(true);
    expect(list.map((p) => p.slug)).not.toContain('mhm-academy');
  });
});
