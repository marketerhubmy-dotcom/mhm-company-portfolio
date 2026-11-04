import { describe, expect, it } from 'vitest';
import { buildInquiryMessage, validateInquiry, type Inquiry } from '../src/features/contact/message';
import { filterProjects, projects } from '../src/features/portfolio/data';

const inq: Inquiry = { name: 'Aisyah', business: '', service: 'Sistem CRM & ERP', budget: '', timeline: 'Fleksibel', description: 'Perlukan sistem order untuk 5 staf sales.', contactPref: '' };

describe('inquiry', () => {
  it('validates required fields', () => {
    expect(validateInquiry(inq)).toEqual({});
    expect(Object.keys(validateInquiry({ ...inq, name: '', service: '', description: 'pendek' }))).toEqual(['name', 'service', 'description']);
  });
  it('builds a WhatsApp message without empty optional lines', () => {
    const m = buildInquiryMessage(inq);
    expect(m).toContain('• Servis: Sistem CRM & ERP');
    expect(m).toContain('• Jangka masa: Fleksibel');
    expect(m).not.toContain('Bisnes:');
    expect(m).not.toContain('bajet');
    expect(m).not.toMatch(/\n{3,}/);
  });
});

describe('portfolio filtering', () => {
  it('filters by category, status and accent-insensitive search', () => {
    const all = { q: '', category: 'semua' as const, status: 'semua' as const };
    expect(filterProjects(projects, all)).toHaveLength(projects.length);
    expect(filterProjects(projects, { ...all, category: 'crm-erp' }).map((p) => p.slug)).toEqual(['odajah-erp-demo']);
    expect(filterProjects(projects, { ...all, q: 'SUSU kacha' }).map((p) => p.slug)).toEqual(['aina-herb-susu-kacha']);
    const live = filterProjects(projects, { ...all, status: 'production' });
    expect(live.length).toBeGreaterThan(0);
    expect(live.every((p) => p.status === 'production')).toBe(true);
    expect(live.map((p) => p.slug)).toContain('synax-landing-page');
    expect(filterProjects(projects, { ...all, q: 'tiada-padanan-xyz' })).toHaveLength(0);
  });
});

describe('service related examples', () => {
  it('every related example points to a published project and carries a note', async () => {
    const { services } = await import('../src/data/services');
    for (const s of services) for (const r of s.relatedExamples ?? []) {
      expect(projects.some((p) => p.slug === r.slug), `${s.id} -> ${r.slug}`).toBe(true);
      expect(r.note.length).toBeGreaterThan(10);
    }
  });
});

describe('service price ranges', () => {
  it('every service has a sane owner-approved MYR range and formats correctly', async () => {
    const { services, formatPriceRange } = await import('../src/data/services');
    for (const s of services) {
      expect(s.priceRange, s.id).not.toBeNull();
      const r = s.priceRange!;
      expect(Number.isInteger(r.min) && Number.isInteger(r.max), s.id).toBe(true);
      expect(r.min).toBeGreaterThan(0);
      expect(r.max).toBeGreaterThan(r.min);
    }
    expect(formatPriceRange({ min: 800, max: 2500 })).toBe('RM800 – RM2,500');
    expect(formatPriceRange({ min: 8000, max: 30000, openEnded: true })).toBe('RM8,000 – RM30,000+');
    expect(formatPriceRange(null)).toBeNull();
  });
});
