import type { Category } from '@/features/portfolio/schema';

export type Service = {
  id: string;
  title: string;
  short: string;
  /** Categories used to find relevant portfolio examples. */
  categories: Category[];
  who: string;
  problems: string[];
  deliverables: string[];
  /** Owner-approved estimate in MYR (null → "Sebut harga ikut skop"). `openEnded` renders "RM30,000+". */
  priceRange: { min: number; max: number; openEnded?: boolean } | null;
  /** Projects in another category that show part of this service. `note` must say
   *  exactly which part, so a related example is never presented as more than it is. */
  relatedExamples?: { slug: string; note: string }[];
};

export const services: Service[] = [
  {
    id: 'landing-page',
    title: 'Landing Page Jualan',
    short: 'Satu halaman, satu tugas: tukar pelawat iklan kepada pembeli.',
    categories: ['landing-page'],
    who: 'Peniaga online, pemilik produk dan bisnes yang menjalankan iklan Facebook, TikTok atau Google.',
    problems: [
      'Iklan mendapat klik, tetapi pelawat tidak membeli.',
      'Tawaran dan harga pakej sukar difahami di telefon.',
      'Pesanan masuk berselerak dan sukar dijejak.',
    ],
    deliverables: ['Struktur kandungan & susunan tawaran', 'Reka bentuk mobile-first', 'Aliran pesanan (contoh: ke WhatsApp)', 'Asas SEO & kelajuan', 'Pemasangan pada domain anda'],
    priceRange: { min: 800, max: 2500 },
  },
  {
    id: 'website-bisnes',
    title: 'Website Bisnes & Korporat',
    short: 'Profil syarikat yang meyakinkan, laju dan mudah dikemas kini.',
    categories: ['website'],
    who: 'SME, syarikat servis dan organisasi yang perlukan kehadiran rasmi dalam talian.',
    problems: [
      'Website lama tidak mencerminkan kualiti bisnes sebenar.',
      'Bakal pelanggan tidak jumpa maklumat penting dengan cepat.',
      'Website sukar dikemas kini tanpa bantuan teknikal.',
    ],
    deliverables: ['Seni bina maklumat & halaman', 'Reka bentuk responsif', 'Halaman servis, profil & hubungi', 'SEO teknikal (metadata, sitemap)', 'Panduan pengurusan kandungan'],
    priceRange: { min: 2500, max: 8000 },
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce & Produk Digital',
    short: 'Kedai online dan platform jualan produk digital.',
    categories: ['ecommerce'],
    who: 'Jenama produk, penjual dropship/agen dan pencipta kursus atau modul digital.',
    problems: [
      'Bergantung sepenuhnya pada marketplace dan yuran platform.',
      'Proses bayaran dan akses produk digital dibuat secara manual.',
      'Katalog dan stok sukar diurus apabila produk bertambah.',
    ],
    deliverables: ['Katalog produk & pakej', 'Aliran checkout', 'Akses produk digital selepas bayaran', 'Integrasi pembayaran (ikut pilihan)', 'Dashboard pengurusan asas'],
    priceRange: { min: 3500, max: 12000 },
  },
  {
    id: 'web-app',
    title: 'Web App Custom',
    short: 'Aplikasi web yang ikut aliran kerja bisnes anda — bukan sebaliknya.',
    categories: ['web-app'],
    who: 'Bisnes yang prosesnya unik dan tidak sesuai dengan perisian siap.',
    problems: [
      'Perisian sedia ada memaksa pasukan mengubah cara kerja.',
      'Kerja penting masih bergantung pada spreadsheet dan mesej.',
      'Data tersebar di beberapa alat yang tidak bercakap antara satu sama lain.',
    ],
    deliverables: ['Analisis aliran kerja', 'Prototaip interaktif', 'Aplikasi web dengan akses mengikut role', 'Integrasi API', 'Dokumentasi & serahan'],
    priceRange: { min: 8000, max: 30000, openEnded: true },
  },
  {
    id: 'crm-erp',
    title: 'Sistem CRM & ERP',
    short: 'Satu sistem untuk order, pelanggan, bayaran, logistik dan pasukan.',
    categories: ['crm-erp'],
    who: 'Bisnes jualan online dan operasi yang mempunyai beberapa jabatan atau ramai staf.',
    problems: [
      'Order diurus dalam WhatsApp dan spreadsheet berasingan.',
      'Bayaran sukar disahkan dan status penghantaran tidak jelas.',
      'Pengurusan tidak dapat melihat prestasi secara keseluruhan.',
    ],
    deliverables: ['Modul order & pelanggan', 'Pengesahan bayaran', 'Pipeline logistik & stok', 'Modul HR (ikut keperluan)', 'Dashboard & laporan mengikut role'],
    priceRange: { min: 10000, max: 50000, openEnded: true },
    relatedExamples: [
      { slug: 'mhm-business-suite', note: 'Modul CRM (pelanggan, peluang jualan, pipeline, follow-up) dan Order Management.' },
    ],
  },
  {
    id: 'saas',
    title: 'Pembangunan SaaS',
    short: 'Daripada idea produk kepada platform berlangganan yang boleh dijual.',
    categories: ['saas'],
    who: 'Founder dan bisnes yang mahu menjadikan proses atau kepakaran mereka sebagai produk perisian.',
    problems: [
      'Idea produk ada, tetapi tiada pasukan teknikal.',
      'Perlu versi awal (MVP) untuk diuji dengan pengguna sebenar.',
      'Perlu asas yang boleh berkembang apabila pengguna bertambah.',
    ],
    deliverables: ['Skop MVP & keutamaan ciri', 'Akaun pengguna & peranan', 'Reka bentuk produk', 'Pembangunan & pelancaran', 'Pelan penambahbaikan berfasa'],
    priceRange: { min: 15000, max: 60000, openEnded: true },
  },
  {
    id: 'automasi-ai',
    title: 'Automasi AI & AI Agent',
    short: 'Kurangkan kerja berulang dengan aliran automasi dan AI yang terkawal.',
    categories: ['ai-automation'],
    who: 'Pasukan yang menghabiskan masa pada balasan berulang, kemasukan data dan laporan.',
    problems: [
      'Staf menjawab soalan yang sama berulang kali.',
      'Data disalin secara manual antara sistem.',
      'Laporan harian mengambil masa berjam-jam untuk disediakan.',
    ],
    deliverables: ['Pemetaan proses yang boleh diautomasi', 'Aliran automasi / AI agent', 'Integrasi dengan alat sedia ada', 'Kawalan & semakan manusia', 'Panduan penggunaan'],
    priceRange: { min: 2500, max: 15000 },
  },
  {
    id: 'automasi-marketing',
    title: 'Automasi Marketing',
    short: 'Follow-up, segmentasi dan kempen yang berjalan secara konsisten.',
    categories: ['marketing-automation'],
    who: 'Bisnes yang mempunyai senarai prospek dan pelanggan tetapi tiada proses follow-up yang tersusun.',
    problems: [
      'Prospek hilang kerana tiada follow-up.',
      'Kempen dihantar secara manual dan tidak konsisten.',
      'Tidak tahu sumber iklan mana yang menghasilkan jualan.',
    ],
    deliverables: ['Aliran follow-up prospek', 'Segmentasi & penjejakan sumber', 'Templat mesej kempen', 'Integrasi borang & CRM', 'Dashboard ringkas'],
    priceRange: { min: 1500, max: 8000 },
    relatedExamples: [
      { slug: 'synax-landing-page', note: 'Prospek separa siap dihantar automatik ke ERP; acara Lead & Purchase ke Meta Pixel.' },
      { slug: 'odajah-erp-demo', note: 'Modul Prospect: follow-up stage, tugasan staf dan sumber lead (diurus staf).' },
    ],
  },
];

/** Applies to every estimate shown on the site. */
export const pricingNotes = [
  'Anggaran berdasarkan skop biasa. Harga sebenar ditentukan dalam sebut harga bertulis selepas skop dipersetujui.',
  'Tidak termasuk domain, hosting, langganan pihak ketiga (contoh: API WhatsApp, AI atau payment gateway) dan bajet iklan, kecuali dinyatakan dalam sebut harga.',
] as const;

const rm = (n: number) => 'RM' + n.toLocaleString('en-MY');
export function formatPriceRange(r: Service['priceRange']): string | null {
  if (!r) return null;
  return `${rm(r.min)} – ${rm(r.max)}${r.openEnded ? '+' : ''}`;
}
