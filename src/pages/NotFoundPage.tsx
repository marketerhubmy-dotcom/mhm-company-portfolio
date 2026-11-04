import { Seo } from '@/components/Seo';
import { ButtonLink } from '@/components/Button';

export default function NotFoundPage() {
  return (
    <section className="paper-grain relative grid min-h-[80svh] place-items-center pt-[var(--header-h)]">
      <Seo title="Halaman Tidak Dijumpai" description="Halaman yang anda cari tidak wujud atau telah dipindahkan." path="/404" noindex />
      <div className="guides pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-x relative text-center">
        <p className="label text-brand-deep">Ralat 404</p>
        <h1 className="display-l mx-auto mt-6 max-w-3xl">Halaman ini <span className="serif-accent">tiada dalam sistem.</span></h1>
        <p className="mx-auto mt-6 max-w-md text-ink-soft">Pautan mungkin telah berubah. Teruskan ke hasil kerja kami atau kembali ke laman utama.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/">Laman Utama</ButtonLink>
          <ButtonLink to="/kerja" variant="outline">Hasil Kerja</ButtonLink>
        </div>
      </div>
    </section>
  );
}
