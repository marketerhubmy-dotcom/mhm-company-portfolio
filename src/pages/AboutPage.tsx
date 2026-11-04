import { ArrowUpRight } from 'lucide-react';
import { Seo, organizationLd } from '@/components/Seo';
import { ButtonA, ButtonLink } from '@/components/Button';
import { SectionLabel } from '@/components/SectionLabel';
import { site } from '@/config/site';
import { capabilities } from '@/data/content';
import { studioFacts } from '@/sections/AboutTeaser';
import { Process } from '@/sections/Process';
import { FinalCta } from '@/sections/FinalCta';

const principles = [
  { t: 'Masalah dahulu', d: 'Kami tanya apa yang perlu berubah dalam bisnes sebelum memilih teknologi atau reka bentuk.' },
  { t: 'Nampak lebih awal', d: 'Prototaip dan pautan semakan diberikan seawal mungkin supaya keputusan dibuat berdasarkan sesuatu yang boleh dilihat.' },
  { t: 'Jujur tentang skop', d: 'Kami nyatakan dengan jelas apa yang termasuk, apa yang tidak, dan apa yang memerlukan fasa seterusnya.' },
  { t: 'Bina untuk digunakan', d: 'Sistem yang baik ialah sistem yang pasukan anda guna setiap hari — laju, jelas dan mudah difahami.' },
];

const systems = ['Landing page & halaman jualan', 'Website bisnes & korporat', 'Kedai online & platform produk digital', 'Sistem order, CRM & ERP', 'Dashboard & laporan', 'Aplikasi web dengan akses mengikut role', 'Produk SaaS berlangganan', 'Aliran automasi & AI agent'];

export default function AboutPage() {
  return (
    <>
      <Seo title="Tentang" description="MHM Center ialah studio penyelesaian digital di Malaysia yang membina laman web, sistem bisnes dan automasi untuk founder, SME dan bisnes online." path="/tentang" jsonLd={[organizationLd()]} />
      <section className="paper-grain relative pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
        <div className="guides pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-x relative">
          <SectionLabel n="T">Tentang MHM Center</SectionLabel>
          <h1 className="display-xl mt-8">
            <span className="line-mask"><span>Studio yang</span></span>
            <span className="line-mask"><span style={{ ['--i' as string]: 1 }}>membina <span className="serif-accent text-saga-deep">sistem,</span></span></span>
            <span className="line-mask"><span style={{ ['--i' as string]: 2 }}>bukan sekadar laman.</span></span>
          </h1>
        </div>
      </section>

      <section className="section-y" aria-labelledby="what-title">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <h2 id="what-title" className="display-s">Apa yang kami lakukan</h2>
            <dl className="mt-8 divide-y divide-line border-y border-line">
              {studioFacts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3.5 text-[0.95rem]">
                  <dt className="label pt-1 text-muted">{k}</dt><dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-6 lg:col-span-6 lg:col-start-7" data-reveal style={{ ['--d' as string]: 1 }}>
            <p className="lede">
              MHM Center mereka dan membina penyelesaian digital untuk founder, SME, usahawan, penjual online dan bisnes yang sedang berkembang di Malaysia.
            </p>
            <p className="text-ink-soft">
              Kerja kami merangkumi halaman yang menjual, laman web yang meyakinkan, dan sistem dalaman yang menguruskan order, pelanggan, bayaran, logistik dan pasukan — serta automasi yang mengurangkan kerja berulang.
            </p>
            <p className="text-ink-soft">
              Kami percaya setiap bisnes mempunyai cara kerja tersendiri. Jadi kami tidak bermula dengan template; kami bermula dengan memahami bagaimana bisnes anda sebenarnya beroperasi, kemudian membina apa yang membantu ia berjalan dengan lebih baik.
            </p>
          </div>
        </div>
      </section>

      <section className="section-y border-t border-line bg-paper-2" aria-labelledby="who-title">
        <div className="container-x">
          <div data-reveal>
            <SectionLabel n="1">Siapa yang kami bantu</SectionLabel>
            <h2 id="who-title" className="display-m mt-6 max-w-3xl">Bisnes yang sudah bergerak, dan mahu bergerak <span className="serif-accent">lebih tersusun.</span></h2>
          </div>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {['Founder & startup', 'SME & syarikat servis', 'Penjual online & jenama produk', 'Usahawan & pencipta produk digital', 'Pasukan operasi yang berkembang'].map((w, i) => (
              <li key={w} className="bg-paper-2 p-6 sm:last:col-span-2 lg:last:col-span-1" data-reveal style={{ ['--d' as string]: i }}>
                <span className="label text-saga-deep">0{i + 1}</span>
                <p className="mt-6 font-display text-lg font-semibold leading-snug tracking-[-0.015em]">{w}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y" aria-labelledby="approach-title">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <SectionLabel n="2">Pendekatan</SectionLabel>
            <h2 id="approach-title" className="display-m mt-6">Cara kami <span className="serif-accent">menyelesaikan</span> masalah digital.</h2>
          </div>
          <ol className="grid gap-x-10 lg:col-span-8 sm:grid-cols-2">
            {principles.map((p, i) => (
              <li key={p.t} className="border-t border-ink py-7" data-reveal style={{ ['--d' as string]: i % 2 }}>
                <p className="label text-muted">Prinsip 0{i + 1}</p>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em]">{p.t}</h3>
                <p className="mt-3 text-ink-soft">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y relative overflow-hidden bg-ink text-paper" aria-labelledby="build-title">
        <div className="guides-dark absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-x relative grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <SectionLabel n="3" dark>Jenis sistem</SectionLabel>
            <h2 id="build-title" className="display-m mt-6">Apa yang kami <span className="serif-accent text-saga-bright">bina.</span></h2>
            <ul className="mt-10 space-y-6">
              {capabilities.map((c) => (
                <li key={c.n} className="grid grid-cols-[2.5rem_1fr]">
                  <span className="label pt-1 text-saga-bright">{c.n}</span>
                  <span><span className="font-display text-xl font-semibold">{c.title}</span><span className="mt-1 block text-paper/65">{c.body}</span></span>
                </li>
              ))}
            </ul>
          </div>
          <ul className="self-end border-t border-line-dark lg:col-span-6 lg:col-start-7" data-reveal>
            {systems.map((s, i) => (
              <li key={s} className="flex items-baseline justify-between gap-6 border-b border-line-dark py-4 font-display text-[clamp(1.1rem,1rem+0.6vw,1.5rem)] font-medium tracking-[-0.02em]">
                {s}<span className="label text-muted-dark">{String(i + 1).padStart(2, '0')}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Process n="4" />

      <section className="section-y border-t border-line" aria-labelledby="academy-title">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7" data-reveal>
            <SectionLabel n="5">Ekosistem</SectionLabel>
            <h2 id="academy-title" className="display-m mt-6">MHM Center & <span className="serif-accent text-saga-deep">MHM Academy.</span></h2>
            <p className="lede mt-6 max-w-2xl text-ink-soft">
              MHM Center turut mengendalikan ekosistem MHM Academy — kedai modul digital yang menawarkan modul praktikal tentang marketing, iklan, AI dan automasi.
            </p>
            <p className="mt-4 max-w-2xl text-ink-soft">
              MHM Center membina sistem untuk bisnes; MHM Academy berkongsi kemahiran praktikal supaya usahawan boleh menggunakannya sendiri.
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9" data-reveal>
            <a href={site.academyUrl} target="_blank" rel="noopener noreferrer" className="group block rounded-2xl border border-line-strong p-7 transition-colors hover:border-ink hover:bg-paper-2">
              <span className="label text-muted">Lawati</span>
              <span className="mt-6 flex items-end justify-between gap-4">
                <span className="font-display text-3xl font-semibold tracking-[-0.03em]">MHM Academy</span>
                <ArrowUpRight className="size-6 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
              </span>
              <span className="mt-2 block text-sm text-muted">{site.academyUrl.replace(/^https?:\/\//, '')}</span>
              <span className="sr-only">(dibuka dalam tab baharu)</span>
            </a>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-3 pb-16">
        <ButtonLink to="/kerja" variant="outline">Lihat Hasil Kerja</ButtonLink>
        <ButtonA href={site.academyUrl} variant="outline">MHM Academy</ButtonA>
      </div>
      <FinalCta />
    </>
  );
}
