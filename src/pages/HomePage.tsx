import { Seo, organizationLd } from '@/components/Seo';
import { site } from '@/config/site';
import { Hero } from '@/sections/Hero';
import { SelectedWork } from '@/sections/SelectedWork';
import { Capabilities } from '@/sections/Capabilities';
import { Problems } from '@/sections/Problems';
import { ServicesIndex } from '@/sections/ServicesIndex';
import { Process } from '@/sections/Process';
import { Tech } from '@/sections/Tech';
import { AboutTeaser } from '@/sections/AboutTeaser';
import { Faq } from '@/sections/Faq';
import { FinalCta } from '@/sections/FinalCta';
import { faqs } from '@/data/content';

export default function HomePage() {
  return (
    <>
      <Seo
        title={`${site.name} — Studio Penyelesaian Digital & Pembangunan Teknologi`}
        description={site.description}
        path="/"
        jsonLd={[
          organizationLd(),
          { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url, inLanguage: 'ms' },
          { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
        ]}
      />
      <Hero />
      <SelectedWork />
      <Capabilities />
      <Problems />
      <ServicesIndex />
      <Process />
      <Tech />
      <AboutTeaser />
      <Faq />
      <FinalCta />
    </>
  );
}
