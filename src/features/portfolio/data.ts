import generated from '@/data/portfolio.generated.json';
import { CATEGORIES, sortProjects, type Category, type Project, type ProjectStatus } from './schema';

/** Only approved projects are ever written to the generated file; filter again defensively. */
export const projects: Project[] = sortProjects((generated as unknown as Project[]).filter((p) => p.approvedForPublic === true));

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export function relatedProjects(project: Project, limit = 3): Project[] {
  const same = projects.filter((p) => p.slug !== project.slug && p.category === project.category);
  const rest = projects.filter((p) => p.slug !== project.slug && p.category !== project.category);
  return [...same, ...rest].slice(0, limit);
}

export type Filters = { q: string; category: Category | 'semua'; status: ProjectStatus | 'semua' };

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

export function filterProjects(list: Project[], f: Filters): Project[] {
  const terms = norm(f.q).split(/\s+/).filter(Boolean);
  return list.filter((p) => {
    if (f.category !== 'semua' && p.category !== f.category) return false;
    if (f.status !== 'semua' && p.status !== f.status) return false;
    if (!terms.length) return true;
    const hay = norm([p.title, p.tagline, p.description, p.projectType, p.category, ...p.technologies].join(' '));
    return terms.every((t) => hay.includes(t));
  });
}

export function categoryCounts(list: Project[]): { category: Category; count: number }[] {
  return CATEGORIES.map((category) => ({ category, count: list.filter((p) => p.category === category).length })).filter((c) => c.count > 0);
}

export const isCategory = (v: string | null): v is Category => !!v && (CATEGORIES as readonly string[]).includes(v);
