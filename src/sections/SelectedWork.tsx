import { ButtonLink } from '@/components/Button';
import { FeaturePlate } from '@/components/ProjectCards';
import { SectionLabel } from '@/components/SectionLabel';
import { projects } from '@/features/portfolio/data';

export function SelectedWork() {
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const list = featured.length ? featured : projects.slice(0, 3);
  return (
    <section id="kerja-terpilih" className="section-y border-t border-line" aria-labelledby="work-title">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-12 md:items-end" data-reveal>
          <div className="md:col-span-8">
            <SectionLabel n="01">Kerja terpilih</SectionLabel>
            <h2 id="work-title" className="display-l mt-6">
              Bukti, bukan <span className="serif-accent">janji.</span>
            </h2>
          </div>
          <div className="md:col-span-4 md:pb-2">
            <p className="text-ink-soft">
              Setiap projek boleh dibuka dan dicuba. Label status menunjukkan dengan jujur sama ada ia sistem sebenar, demo portfolio atau prototaip.
            </p>
          </div>
        </div>
        <div className="mt-16 space-y-24 md:mt-20 md:space-y-32">
          {list.map((p, i) => (
            <FeaturePlate key={p.slug} project={p} index={i} flip={i % 2 === 1} />
          ))}
        </div>
        <div className="mt-20 flex justify-center" data-reveal>
          <ButtonLink to="/kerja" variant="outline">Semua Hasil Kerja</ButtonLink>
        </div>
      </div>
    </section>
  );
}
