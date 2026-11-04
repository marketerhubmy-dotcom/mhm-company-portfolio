import { ButtonA, ButtonLink } from '@/components/Button';
import { whatsappLink } from '@/config/site';

export function FinalCta({ title, accent = 'sistem.' }: { title?: string; accent?: string }) {
  const wa = whatsappLink('Hai MHM Center, saya ingin berbincang tentang projek.');
  return (
    <section className="pb-[var(--section-y)]" aria-labelledby="cta-title">
      <div className="container-x">
        <div className="paper-grain relative overflow-hidden rounded-[1.5rem] bg-brand px-6 py-16 text-paper sm:px-12 md:py-24 lg:px-20" data-reveal>
          <div aria-hidden="true" className="guides-dark absolute inset-0 opacity-50" />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
            <h2 id="cta-title" className="display-l lg:col-span-8">
              {title ?? 'Ada idea bisnes? Mari jadikan ia'} <span className="serif-accent">{accent}</span>
            </h2>
            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
              <ButtonLink to="/hubungi" variant="contrast" className="w-full lg:w-auto">Bincang Projek Anda</ButtonLink>
              {wa && <ButtonA href={wa} variant="ghost-light" className="w-full lg:w-auto">WhatsApp Kami</ButtonA>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
