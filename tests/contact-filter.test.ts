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
    expect(filterProjects(projects, { ...all, status: 'production' }).map((p) => p.slug)).toEqual(['synax-landing-page']);
    expect(filterProjects(projects, { ...all, q: 'tiada-padanan-xyz' })).toHaveLength(0);
  });
});
