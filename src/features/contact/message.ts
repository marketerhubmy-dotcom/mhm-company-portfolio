export type Inquiry = {
  name: string;
  business: string;
  service: string;
  budget: string;
  timeline: string;
  description: string;
  contactPref: string;
};

export const budgets = ['Belum pasti', 'Bawah RM2,000', 'RM2,000 – RM5,000', 'RM5,000 – RM15,000', 'RM15,000 – RM50,000', 'Melebihi RM50,000'] as const;
export const timelines = ['Secepat mungkin', 'Dalam 1 bulan', '1 – 3 bulan', 'Fleksibel'] as const;

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;

export function validateInquiry(i: Inquiry): InquiryErrors {
  const e: InquiryErrors = {};
  if (i.name.trim().length < 2) e.name = 'Sila isi nama anda.';
  if (!i.service) e.service = 'Pilih servis yang paling hampir dengan keperluan anda.';
  if (i.description.trim().length < 15) e.description = 'Ceritakan sedikit tentang projek (sekurang-kurangnya 15 aksara).';
  if (i.description.length > 1500) e.description = 'Penerangan terlalu panjang (maksimum 1,500 aksara).';
  return e;
}

const clip = (s: string, n: number) => s.replace(/\s+\n/g, '\n').trim().slice(0, n);

export function buildInquiryMessage(i: Inquiry): string {
  const lines = [
    'Assalamualaikum / Hai MHM Center,',
    '',
    'Saya ingin berbincang tentang projek:',
    '',
    `• Nama: ${clip(i.name, 80)}`,
    i.business.trim() ? `• Bisnes: ${clip(i.business, 100)}` : '',
    `• Servis: ${clip(i.service, 80)}`,
    i.budget ? `• Anggaran bajet: ${i.budget}` : '',
    i.timeline ? `• Jangka masa: ${i.timeline}` : '',
    i.contactPref ? `• Cara dihubungi: ${clip(i.contactPref, 80)}` : '',
    '',
    'Penerangan projek:',
    clip(i.description, 1500),
  ];
  return lines.filter((l, idx, arr) => l !== '' || arr[idx - 1] !== '').join('\n').replace(/\n{3,}/g, '\n\n');
}
