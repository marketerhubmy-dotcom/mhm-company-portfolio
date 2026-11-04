/** Editorial content for the homepage and about page. Keep claims factual. */

export const problems = [
  { problem: 'Iklan jalan, tetapi orang tak beli.', solution: 'Landing page yang menyusun tawaran, bukti dan langkah pesanan dengan jelas — terutamanya di telefon.', service: 'landing-page' },
  { problem: 'Order bersepah dalam WhatsApp dan spreadsheet.', solution: 'Sistem order berpusat: status, bayaran dan penghantaran dalam satu dashboard mengikut role.', service: 'crm-erp' },
  { problem: 'Staf buat kerja yang sama setiap hari.', solution: 'Automasi dan AI agent untuk balasan berulang, kemasukan data, notifikasi dan laporan.', service: 'automasi-ai' },
  { problem: 'Website lama tidak meyakinkan pelanggan.', solution: 'Website bisnes moden yang laju, jelas dan mudah dikemas kini.', service: 'website-bisnes' },
  { problem: 'Perisian siap tak ikut cara bisnes bekerja.', solution: 'Web app custom yang dibina mengikut aliran kerja sebenar pasukan anda.', service: 'web-app' },
] as const;

export const capabilities = [
  { n: '01', title: 'Menjual', body: 'Landing page, website dan kedai online yang membawa pelawat kepada tindakan.', services: ['Landing Page', 'Website Bisnes', 'E-Commerce'] },
  { n: '02', title: 'Mengurus', body: 'Sistem dalaman untuk order, pelanggan, bayaran, logistik dan pasukan.', services: ['CRM / ERP', 'Web App Custom'] },
  { n: '03', title: 'Berkembang', body: 'Produk perisian berlangganan yang boleh dijual kepada pelanggan anda sendiri.', services: ['SaaS', 'Platform Produk Digital'] },
  { n: '04', title: 'Mengautomasi', body: 'Aliran kerja dan AI yang mengambil alih tugasan berulang, dengan kawalan manusia.', services: ['Automasi AI', 'Automasi Marketing'] },
] as const;

export const process = [
  { n: '01', title: 'Diskusi & Skop', body: 'Kami fahamkan bisnes, pelanggan dan masalah sebenar sebelum bercakap tentang teknologi.', output: 'Skop kerja & cadangan' },
  { n: '02', title: 'Reka Bentuk & Prototaip', body: 'Struktur, aliran dan rupa dibina sebagai prototaip supaya anda nampak hasilnya lebih awal.', output: 'Prototaip untuk semakan' },
  { n: '03', title: 'Pembangunan', body: 'Pembangunan berfasa dengan pautan semakan, supaya maklum balas masuk sepanjang jalan.', output: 'Versi ujian' },
  { n: '04', title: 'Ujian & Pelancaran', body: 'Semakan fungsi, telefon, kelajuan dan SEO asas, kemudian dilancarkan pada domain anda.', output: 'Sistem dilancarkan' },
  { n: '05', title: 'Sokongan & Penambahbaikan', body: 'Sistem yang baik terus berkembang. Penambahbaikan seterusnya dirancang bersama.', output: 'Pelan fasa seterusnya' },
] as const;

/** Technology capabilities — review and edit to match the team's actual stack. */
export const techGroups = [
  { title: 'Antara Muka', items: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Reka bentuk responsif'] },
  { title: 'Hosting & Edge', items: ['Cloudflare Pages', 'Cloudflare Workers', 'Domain & DNS', 'Prerender / SEO teknikal'] },
  { title: 'Data & Integrasi', items: ['REST API', 'Webhook', 'WhatsApp click-to-chat', 'Dashboard & carta'] },
  { title: 'Automasi & AI', items: ['Aliran automasi', 'AI agent', 'Notifikasi & laporan', 'Semakan manusia (human-in-the-loop)'] },
  { title: 'Kualiti & Operasi', items: ['GitHub Actions', 'Ujian automatik', 'Semakan keselamatan asas', 'Dokumentasi serahan'] },
] as const;

export const faqs = [
  { q: 'Berapa kos untuk membina website atau sistem?', a: 'Kos bergantung pada skop — bilangan halaman, modul, integrasi dan tahap automasi. Kami beri sebut harga bertulis selepas sesi perbincangan supaya anda tahu apa yang termasuk sebelum projek bermula.' },
  { q: 'Berapa lama masa yang diperlukan?', a: 'Landing page biasanya jauh lebih cepat berbanding sistem seperti CRM atau ERP. Anggaran masa diberikan bersama skop kerja, dan projek besar dibahagikan kepada fasa supaya anda boleh mula guna lebih awal.' },
  { q: 'Adakah demo dalam portfolio ini sistem sebenar?', a: 'Setiap projek dilabel dengan jelas: Sistem Sebenar, Demo Portfolio atau Prototaip. Demo seperti ODAJAH ERP menggunakan data rekaan sepenuhnya supaya anda boleh mencuba fungsinya dengan selamat.' },
  { q: 'Boleh guna domain dan akaun hosting sendiri?', a: 'Boleh. Kami boleh memasang projek pada domain anda dan membincangkan pilihan hosting yang sesuai dengan saiz serta bajet bisnes.' },
  { q: 'Bolehkah sistem diintegrasikan dengan WhatsApp, pembayaran atau marketplace?', a: 'Integrasi bergantung pada platform dan API yang tersedia. Kami semak pilihan yang sesuai semasa perbincangan skop dan nyatakan dengan jelas apa yang boleh dan tidak boleh dilakukan.' },
  { q: 'Bagaimana dengan sokongan selepas pelancaran?', a: 'Sokongan dan penambahbaikan boleh diatur mengikut keperluan. Skop sokongan dipersetujui secara bertulis supaya kedua-dua pihak jelas.' },
] as const;
