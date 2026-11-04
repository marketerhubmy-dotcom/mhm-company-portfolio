/**
 * Portfolio project schema + validator.
 *
 * Shared by the website, the GitHub sync engine (scripts/) and tests.
 * Dependency-free on purpose: metadata from other repositories is untrusted
 * input, so every field is checked, normalised and unknown keys are dropped.
 */

export const PORTFOLIO_OWNER = 'marketerhubmy-dotcom';
export const DISCOVERY_TOPIC = 'mhm-portfolio';

export const CATEGORIES = [
  'landing-page',
  'website',
  'ecommerce',
  'web-app',
  'crm-erp',
  'saas',
  'ai-automation',
  'marketing-automation',
] as const;
export type Category = (typeof CATEGORIES)[number];

/**
 * production     → real deployed system used by a business
 * demo           → portfolio demo (fictional data / not a live business)
 * prototype      → concept or interactive prototype
 * in-development → being built, not launched
 */
export const STATUSES = ['production', 'demo', 'prototype', 'in-development'] as const;
export type ProjectStatus = (typeof STATUSES)[number];

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  /** `mobile` images are portrait captures shown in a phone frame. */
  frame?: 'desktop' | 'mobile';
  /** Responsive variants keyed by width, e.g. { "800": "/projects/x/a-800.webp" } */
  srcset?: Record<string, string>;
};

export type ProjectFeature = { title: string; description: string };

export type CaseStudy = {
  intro?: string;
  challenge?: string;
  solution?: string;
  features?: ProjectFeature[];
  /** Honest notes about what is simulated / limited in a demo. */
  demoNotes?: string[];
  /** Short "what to try" steps for live demos. */
  tryIt?: string[];
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  description: string;
  category: Category;
  projectType: string;
  technologies: string[];
  demoUrl: string | null;
  /** "owner/repo" for public repositories, null for private/manual work. */
  repositoryReference: string | null;
  thumbnail: ProjectImage | null;
  galleryImages: ProjectImage[];
  featured: boolean;
  displayOrder: number;
  approvedForPublic: boolean;
  status: ProjectStatus;
  /** YYYY-MM-DD */
  updatedAt: string;
  caseStudy?: CaseStudy;
  /** Where the entry came from. Set by the pipeline, never trusted from input. */
  source: 'manual' | 'github';
};

export type ValidationResult<T> =
  | { ok: true; value: T; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export type ValidateOptions = {
  source: Project['source'];
  /** Required for github entries: the repository the metadata was read from. */
  repository?: string;
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REPO_RE = /^[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const LOCAL_IMG_RE = /^\/projects\/[a-z0-9-]+\/[A-Za-z0-9._-]+\.(?:webp|png|jpe?g|avif)$/;
// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F‪-‮⁦-⁩]/g;

const KNOWN_KEYS = new Set([
  '$schema', 'id', 'slug', 'title', 'tagline', 'description', 'category', 'projectType',
  'technologies', 'demoUrl', 'repositoryReference', 'thumbnail', 'galleryImages', 'featured',
  'displayOrder', 'approvedForPublic', 'status', 'updatedAt', 'caseStudy', 'source',
]);

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  production: 'Sistem Sebenar',
  demo: 'Demo Portfolio',
  prototype: 'Prototaip / Konsep',
  'in-development': 'Dalam Pembangunan',
};

export const CATEGORY_LABEL: Record<Category, string> = {
  'landing-page': 'Landing Page',
  website: 'Website Bisnes',
  ecommerce: 'E-Commerce',
  'web-app': 'Web App',
  'crm-erp': 'CRM / ERP',
  saas: 'SaaS',
  'ai-automation': 'Automasi AI',
  'marketing-automation': 'Automasi Marketing',
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function cleanText(v: string): string {
  return v.replace(CONTROL_RE, '').replace(/\s+/g, ' ').trim();
}

/** Only https, no credentials, no local / IP hosts. */
export function isSafePublicUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:') return false;
  if (url.username || url.password) return false;
  const host = url.hostname.toLowerCase();
  if (!host.includes('.')) return false;
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) return false;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[')) return false;
  return true;
}

/**
 * Images must be either committed to this repo under /projects/<slug>/ or
 * served from the SAME source repository on raw.githubusercontent.com.
 * Arbitrary third-party image hosts are rejected (tracking / content risk).
 */
export function isAllowedImageSrc(src: string, repository?: string): boolean {
  if (src.includes('..') || src.includes('\\')) return false;
  if (LOCAL_IMG_RE.test(src)) return true;
  if (!repository || !isSafePublicUrl(src)) return false;
  const url = new URL(src);
  return (
    url.hostname === 'raw.githubusercontent.com' &&
    url.pathname.toLowerCase().startsWith(`/${repository.toLowerCase()}/`) &&
    /\.(?:webp|png|jpe?g|avif)$/i.test(url.pathname) &&
    !url.search
  );
}

type Ctx = { errors: string[]; warnings: string[]; path: string };

function str(ctx: Ctx, obj: Record<string, unknown>, key: string, min: number, max: number, required: boolean): string | undefined {
  const raw = obj[key];
  if (raw === undefined || raw === null || raw === '') {
    if (required) ctx.errors.push(`${ctx.path}${key}: wajib diisi`);
    return undefined;
  }
  if (typeof raw !== 'string') {
    ctx.errors.push(`${ctx.path}${key}: mesti string`);
    return undefined;
  }
  const v = cleanText(raw);
  if (v.length < min || v.length > max) {
    ctx.errors.push(`${ctx.path}${key}: panjang mesti ${min}–${max} aksara (sekarang ${v.length})`);
    return undefined;
  }
  return v;
}

function strList(ctx: Ctx, obj: Record<string, unknown>, key: string, maxItems: number, maxLen: number, minLen = 1): string[] {
  const raw = obj[key];
  if (raw === undefined) return [];
  if (!Array.isArray(raw)) {
    ctx.errors.push(`${ctx.path}${key}: mesti array`);
    return [];
  }
  if (raw.length > maxItems) ctx.errors.push(`${ctx.path}${key}: maksimum ${maxItems} item`);
  const out: string[] = [];
  raw.slice(0, maxItems).forEach((item, i) => {
    if (typeof item !== 'string') return void ctx.errors.push(`${ctx.path}${key}[${i}]: mesti string`);
    const v = cleanText(item);
    if (v.length < minLen || v.length > maxLen) return void ctx.errors.push(`${ctx.path}${key}[${i}]: panjang mesti ${minLen}–${maxLen}`);
    if (!out.includes(v)) out.push(v);
  });
  return out;
}

function image(ctx: Ctx, raw: unknown, path: string, repository?: string): ProjectImage | null {
  if (!isRecord(raw)) {
    ctx.errors.push(`${path}: mesti objek { src, alt, width, height }`);
    return null;
  }
  const c: Ctx = { ...ctx, path: `${path}.` };
  const src = str(c, raw, 'src', 1, 500, true);
  const alt = str(c, raw, 'alt', 3, 160, true);
  const caption = str(c, raw, 'caption', 1, 200, false);
  const width = raw.width;
  const height = raw.height;
  let ok = true;
  if (src && !isAllowedImageSrc(src, repository)) {
    ctx.errors.push(`${path}.src: sumber imej tidak dibenarkan (${src})`);
    ok = false;
  }
  if (!Number.isInteger(width) || (width as number) < 16 || (width as number) > 8000) {
    ctx.errors.push(`${path}.width: integer 16–8000 diperlukan (elak layout shift)`);
    ok = false;
  }
  if (!Number.isInteger(height) || (height as number) < 16 || (height as number) > 12000) {
    ctx.errors.push(`${path}.height: integer 16–12000 diperlukan`);
    ok = false;
  }
  const frame = raw.frame === 'mobile' || raw.frame === 'desktop' ? raw.frame : undefined;
  if (raw.frame !== undefined && !frame) ctx.errors.push(`${path}.frame: 'desktop' atau 'mobile'`);
  let srcset: Record<string, string> | undefined;
  if (raw.srcset !== undefined) {
    if (!isRecord(raw.srcset)) ctx.errors.push(`${path}.srcset: mesti objek`);
    else {
      srcset = {};
      for (const [w, s] of Object.entries(raw.srcset)) {
        if (!/^\d{2,4}$/.test(w) || typeof s !== 'string' || !isAllowedImageSrc(s, repository)) {
          ctx.errors.push(`${path}.srcset.${w}: tidak sah`);
          ok = false;
        } else srcset[w] = s;
      }
    }
  }
  if (!src || !alt || !ok) return null;
  return {
    src, alt, width: width as number, height: height as number,
    ...(caption ? { caption } : {}),
    ...(frame ? { frame } : {}),
    ...(srcset && Object.keys(srcset).length ? { srcset } : {}),
  };
}

export function validateProject(input: unknown, opts: ValidateOptions): ValidationResult<Project> {
  const ctx: Ctx = { errors: [], warnings: [], path: '' };
  if (!isRecord(input)) return { ok: false, errors: ['metadata mesti objek JSON'], warnings: [] };

  for (const key of Object.keys(input)) {
    if (!KNOWN_KEYS.has(key)) ctx.warnings.push(`medan tidak dikenali diabaikan: ${key}`);
  }

  const slug = str(ctx, input, 'slug', 2, 64, true);
  if (slug && !SLUG_RE.test(slug)) ctx.errors.push('slug: hanya huruf kecil, nombor dan sengkang (kebab-case)');
  const id = str(ctx, input, 'id', 2, 64, false) ?? slug;
  if (id && !SLUG_RE.test(id)) ctx.errors.push('id: hanya huruf kecil, nombor dan sengkang');

  const title = str(ctx, input, 'title', 2, 80, true);
  const tagline = str(ctx, input, 'tagline', 4, 140, false);
  const description = str(ctx, input, 'description', 20, 420, true);
  const projectType = str(ctx, input, 'projectType', 2, 60, true);

  const category = input.category as Category;
  if (!CATEGORIES.includes(category)) ctx.errors.push(`category: mesti salah satu daripada ${CATEGORIES.join(', ')}`);
  const status = input.status as ProjectStatus;
  if (!STATUSES.includes(status)) ctx.errors.push(`status: mesti salah satu daripada ${STATUSES.join(', ')}`);

  const technologies = strList(ctx, input, 'technologies', 16, 32);

  let demoUrl: string | null = null;
  if (input.demoUrl !== undefined && input.demoUrl !== null && input.demoUrl !== '') {
    if (typeof input.demoUrl !== 'string' || !isSafePublicUrl(input.demoUrl)) ctx.errors.push('demoUrl: mesti URL https awam yang sah');
    else demoUrl = new URL(input.demoUrl).toString();
  }

  // Repository reference: GitHub entries are FORCED to the repo they were read from.
  let repositoryReference: string | null = null;
  if (opts.source === 'github') {
    if (!opts.repository || !REPO_RE.test(opts.repository)) ctx.errors.push('repositoryReference: repositori sumber tidak sah');
    else repositoryReference = opts.repository;
    if (typeof input.repositoryReference === 'string' && input.repositoryReference !== opts.repository) {
      ctx.warnings.push('repositoryReference dalam metadata diabaikan; repositori sumber digunakan');
    }
  } else if (typeof input.repositoryReference === 'string' && input.repositoryReference) {
    if (!REPO_RE.test(input.repositoryReference)) ctx.errors.push('repositoryReference: format "owner/repo"');
    else repositoryReference = input.repositoryReference;
  }
  if (repositoryReference && repositoryReference.split('/')[0]!.toLowerCase() !== PORTFOLIO_OWNER) {
    ctx.errors.push(`repositoryReference: hanya repositori milik ${PORTFOLIO_OWNER} dibenarkan`);
  }

  const imgRepo = opts.source === 'github' ? opts.repository : undefined;
  let thumbnail: ProjectImage | null = null;
  if (input.thumbnail !== undefined && input.thumbnail !== null) thumbnail = image(ctx, input.thumbnail, 'thumbnail', imgRepo);
  const galleryImages: ProjectImage[] = [];
  if (input.galleryImages !== undefined) {
    if (!Array.isArray(input.galleryImages)) ctx.errors.push('galleryImages: mesti array');
    else {
      if (input.galleryImages.length > 24) ctx.errors.push('galleryImages: maksimum 24 imej');
      input.galleryImages.slice(0, 24).forEach((g, i) => {
        const img = image(ctx, g, `galleryImages[${i}]`, imgRepo);
        if (img) galleryImages.push(img);
      });
    }
  }

  const featured = input.featured === true;
  if (input.featured !== undefined && typeof input.featured !== 'boolean') ctx.errors.push('featured: mesti boolean');
  let displayOrder = 500;
  if (input.displayOrder !== undefined) {
    if (!Number.isInteger(input.displayOrder) || (input.displayOrder as number) < 0 || (input.displayOrder as number) > 9999) {
      ctx.errors.push('displayOrder: integer 0–9999');
    } else displayOrder = input.displayOrder as number;
  }
  if (input.approvedForPublic !== undefined && typeof input.approvedForPublic !== 'boolean') ctx.errors.push('approvedForPublic: mesti boolean');
  // Default: NOT public. For github entries the final value is decided by the
  // approval registry in this repository (see scripts/lib/sync.ts).
  const approvedForPublic = input.approvedForPublic === true;

  let updatedAt = '1970-01-01';
  if (typeof input.updatedAt === 'string' && DATE_RE.test(input.updatedAt.slice(0, 10)) && !Number.isNaN(Date.parse(input.updatedAt.slice(0, 10)))) {
    updatedAt = input.updatedAt.slice(0, 10);
  } else if (input.updatedAt !== undefined) ctx.errors.push('updatedAt: format YYYY-MM-DD');
  else ctx.warnings.push('updatedAt tiada');

  let caseStudy: CaseStudy | undefined;
  if (input.caseStudy !== undefined) {
    if (!isRecord(input.caseStudy)) ctx.errors.push('caseStudy: mesti objek');
    else {
      const c: Ctx = { ...ctx, path: 'caseStudy.' };
      const cs = input.caseStudy;
      const features: ProjectFeature[] = [];
      if (cs.features !== undefined) {
        if (!Array.isArray(cs.features)) ctx.errors.push('caseStudy.features: mesti array');
        else cs.features.slice(0, 16).forEach((f, i) => {
          if (!isRecord(f)) return void ctx.errors.push(`caseStudy.features[${i}]: mesti objek`);
          const fc: Ctx = { ...ctx, path: `caseStudy.features[${i}].` };
          const t = str(fc, f, 'title', 2, 80, true);
          const d = str(fc, f, 'description', 4, 320, true);
          if (t && d) features.push({ title: t, description: d });
        });
      }
      caseStudy = {
        intro: str(c, cs, 'intro', 10, 900, false),
        challenge: str(c, cs, 'challenge', 10, 900, false),
        solution: str(c, cs, 'solution', 10, 900, false),
        ...(features.length ? { features } : {}),
        ...(cs.demoNotes !== undefined ? { demoNotes: strList(c, cs, 'demoNotes', 10, 240, 4) } : {}),
        ...(cs.tryIt !== undefined ? { tryIt: strList(c, cs, 'tryIt', 10, 200, 4) } : {}),
      };
      for (const k of Object.keys(caseStudy) as (keyof CaseStudy)[]) if (caseStudy[k] === undefined) delete caseStudy[k];
    }
  }

  if (ctx.errors.length) return { ok: false, errors: ctx.errors, warnings: ctx.warnings };

  const project: Project = {
    id: id!, slug: slug!, title: title!, description: description!, category, projectType: projectType!,
    technologies, demoUrl, repositoryReference, thumbnail, galleryImages, featured, displayOrder,
    approvedForPublic, status, updatedAt, source: opts.source,
    ...(tagline ? { tagline } : {}),
    ...(caseStudy && Object.keys(caseStudy).length ? { caseStudy } : {}),
  };
  return { ok: true, value: project, warnings: ctx.warnings };
}

/** Stable ordering: displayOrder asc, then featured first, then title. */
export function sortProjects(list: Project[]): Project[] {
  return [...list].sort(
    (a, b) => a.displayOrder - b.displayOrder || Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title, 'ms'),
  );
}
