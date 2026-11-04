import { useEffect, useId, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Check, Copy, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Button, ButtonA } from '@/components/Button';
import { SectionLabel } from '@/components/SectionLabel';
import { hasWhatsApp, site, whatsappLink } from '@/config/site';
import { services } from '@/data/services';
import { budgets, buildInquiryMessage, timelines, validateInquiry, type Inquiry, type InquiryErrors } from '@/features/contact/message';
import { cn } from '@/utils/cn';

const OTHER = 'Lain-lain / belum pasti';
const empty: Inquiry = { name: '', business: '', service: '', budget: '', timeline: '', description: '', contactPref: '' };

export default function ContactPage() {
  const [params] = useSearchParams();
  const [form, setForm] = useState<Inquiry>(empty);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [sent, setSent] = useState<{ message: string; link: string | null } | null>(null);
  const [copied, setCopied] = useState(false);
  const result = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = services.find((x) => x.id === params.get('servis'));
    if (s) setForm((f) => (f.service ? f : { ...f, service: s.title }));
  }, [params]);

  const set = <K extends keyof Inquiry>(k: K, v: Inquiry[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateInquiry(form);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    const message = buildInquiryMessage(form);
    const link = whatsappLink(message);
    setSent({ message, link });
    setCopied(false);
    if (link) window.open(link, '_blank', 'noopener,noreferrer');
    requestAnimationFrame(() => result.current?.focus());
  };

  const copy = async () => {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(sent.message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const quickWa = whatsappLink('Hai MHM Center, saya ingin bertanya tentang projek digital.');

  return (
    <>
      <Seo
        title="Hubungi"
        description="Bincang projek landing page, website, sistem CRM/ERP, web app atau automasi AI dengan MHM Center. Isi keperluan projek dan hantar terus melalui WhatsApp."
        path="/hubungi"
      />
      <section className="paper-grain relative pb-[var(--section-y)] pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
        <div className="guides pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-x relative grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel n="H">Hubungi</SectionLabel>
            <h1 className="display-l mt-8">
              <span className="line-mask"><span>Ceritakan</span></span>
              <span className="line-mask"><span style={{ ['--i' as string]: 1 }}>projek <span className="serif-accent text-saga-deep">anda.</span></span></span>
            </h1>
            <p className="enter lede mt-8 max-w-md text-ink-soft" style={{ ['--i' as string]: 1 }}>
              Isi borang ringkas ini. Mesej anda akan disusun secara automatik dan dihantar melalui WhatsApp — tiada akaun atau log masuk diperlukan.
            </p>

            <ul className="enter mt-10 divide-y divide-line border-y border-line" style={{ ['--i' as string]: 2 }}>
              <ContactRow icon={MessageCircle} label="WhatsApp">
                {quickWa ? <a href={quickWa} target="_blank" rel="noopener noreferrer" className="link-underline">Mesej terus <span className="sr-only">(dibuka dalam tab baharu)</span>↗</a> : <span className="text-muted">Nombor rasmi akan dikemas kini</span>}
              </ContactRow>
              {site.email && (
                <ContactRow icon={Mail} label="E-mel">
                  <a href={`mailto:${site.email}`} className="link-underline">{site.email.split('@')[0]}@<wbr />{site.email.split('@')[1]}</a>
                </ContactRow>
              )}
              <ContactRow icon={MapPin} label="Lokasi">{site.location}</ContactRow>
            </ul>

            <div className="enter mt-10 rounded-xl border border-line bg-paper-2 p-6" style={{ ['--i' as string]: 3 }}>
              <p className="label text-ink">Apa yang berlaku seterusnya</p>
              <ol className="mt-4 space-y-3 text-sm text-ink-soft">
                {['Kami baca keperluan anda dan tanya soalan susulan jika perlu.', 'Sesi perbincangan ringkas untuk memahami bisnes dan skop.', 'Anda terima cadangan dan sebut harga bertulis.'].map((t, i) => (
                  <li key={t} className="grid grid-cols-[1.5rem_1fr] gap-2"><span className="label pt-0.5 text-saga-deep">{i + 1}</span>{t}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <form noValidate onSubmit={submit} className="enter rounded-2xl border border-line-strong bg-paper p-6 shadow-[0_30px_60px_-40px_rgb(18_19_17/0.35)] sm:p-9" style={{ ['--i' as string]: 2 }} aria-labelledby="form-title">
              <h2 id="form-title" className="display-s">Keperluan projek</h2>
              <p className="mt-2 text-sm text-muted">Medan bertanda * wajib diisi.</p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Field id="name" label="Nama *" error={errors.name}>
                  {(p) => <input {...p} autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} maxLength={80} />}
                </Field>
                <Field id="business" label="Nama bisnes" hint="Pilihan">
                  {(p) => <input {...p} autoComplete="organization" value={form.business} onChange={(e) => set('business', e.target.value)} maxLength={100} />}
                </Field>
              </div>

              <fieldset className="mt-7">
                <legend className="text-sm font-medium">Servis yang diperlukan *</legend>
                <div className="mt-3 flex flex-wrap gap-2" id="f-service" tabIndex={-1} aria-describedby={errors.service ? 'f-service-err' : undefined}>
                  {[...services.map((s) => s.title), OTHER].map((t) => (
                    <label key={t} className={cn('cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-saga', form.service === t ? 'border-ink bg-ink text-paper' : 'border-line-strong text-ink-soft hover:border-ink')}>
                      <input type="radio" name="service" value={t} checked={form.service === t} onChange={() => set('service', t)} className="sr-only" />
                      {t}
                    </label>
                  ))}
                </div>
                {errors.service && <p id="f-service-err" className="mt-2 text-sm text-saga-deep">{errors.service}</p>}
              </fieldset>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <Field id="budget" label="Anggaran bajet" hint="Pilihan">
                  {(p) => (
                    <select {...p} value={form.budget} onChange={(e) => set('budget', e.target.value)}>
                      <option value="">— Pilih —</option>
                      {budgets.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  )}
                </Field>
                <Field id="timeline" label="Jangka masa" hint="Pilihan">
                  {(p) => (
                    <select {...p} value={form.timeline} onChange={(e) => set('timeline', e.target.value)}>
                      <option value="">— Pilih —</option>
                      {timelines.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  )}
                </Field>
              </div>

              <div className="mt-7">
                <Field id="description" label="Penerangan projek *" error={errors.description} hint={`${form.description.length}/1500`}>
                  {(p) => (
                    <textarea {...p} rows={6} value={form.description} onChange={(e) => set('description', e.target.value)} maxLength={1500}
                      placeholder="Contoh: Kami jual produk kesihatan melalui TikTok dan Facebook. Perlukan sistem untuk urus order, sahkan bayaran dan jejak penghantaran untuk 5 staf." />
                  )}
                </Field>
              </div>

              <div className="mt-7">
                <Field id="contactPref" label="Masa / cara terbaik untuk dihubungi" hint="Pilihan">
                  {(p) => <input {...p} value={form.contactPref} onChange={(e) => set('contactPref', e.target.value)} maxLength={80} placeholder="Contoh: WhatsApp, selepas 8 malam" />}
                </Field>
              </div>

              <div className="mt-9 flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted sm:max-w-[16rem]">
                  {hasWhatsApp ? 'Butang ini membuka WhatsApp dengan mesej yang telah diisi. Anda boleh semak sebelum menghantar.' : 'Mesej anda akan disusun untuk disalin dan dihantar.'}
                </p>
                <Button type="submit" arrow>{hasWhatsApp ? 'Hantar melalui WhatsApp' : 'Sediakan Mesej'}</Button>
              </div>
            </form>

            {sent && (
              <div ref={result} tabIndex={-1} role="status" className="mt-6 rounded-2xl border border-ink bg-ink p-6 text-paper outline-none sm:p-8">
                <p className="label text-saga-bright">{sent.link ? 'WhatsApp dibuka' : 'Mesej sedia'}</p>
                <p className="mt-3 font-display text-xl font-semibold tracking-[-0.02em]">
                  {sent.link ? 'Semak mesej dalam WhatsApp, kemudian tekan hantar.' : 'Salin mesej di bawah dan hantar kepada kami.'}
                </p>
                {!hasWhatsApp && (
                  <p className="mt-2 text-sm text-paper/65">Nombor WhatsApp rasmi belum dikonfigurasi pada laman ini{site.email ? ' — anda juga boleh menghantar melalui e-mel.' : '.'}</p>
                )}
                <pre className="mt-5 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-paper/[0.06] p-4 font-mono text-[0.8rem] leading-relaxed text-paper/85">{sent.message}</pre>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button type="button" variant="light" onClick={copy}>
                    {copied ? <><Check className="size-4" aria-hidden="true" /> Disalin</> : <><Copy className="size-4" aria-hidden="true" /> Salin Mesej</>}
                  </Button>
                  {sent.link && <ButtonA href={sent.link} variant="ghost-light">Buka WhatsApp Semula</ButtonA>}
                  {site.email && (
                    <ButtonA href={`mailto:${site.email}?subject=${encodeURIComponent('Pertanyaan projek')}&body=${encodeURIComponent(sent.message)}`} variant="ghost-light" arrow={false}>Hantar E-mel</ButtonA>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[2rem_6rem_minmax(0,1fr)] items-center gap-2 py-4 text-[0.95rem]">
      <Icon className="size-4 text-saga-deep" aria-hidden="true" />
      <span className="label text-muted">{label}</span>
      <span className="min-w-0 break-words [overflow-wrap:anywhere]">{children}</span>
    </li>
  );
}

type FieldChildProps = { id: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string; className: string };
function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: (p: FieldChildProps) => React.ReactNode }) {
  const hintId = useId();
  const fid = `f-${id}`;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={fid} className="text-sm font-medium">{label}</label>
        {hint && <span id={hintId} className="label !text-[0.65rem] text-muted">{hint}</span>}
      </div>
      {children({
        id: fid,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': [error ? `${fid}-err` : '', hint ? hintId : ''].filter(Boolean).join(' ') || undefined,
        className: cn(
          'mt-2 block w-full rounded-lg border bg-paper px-3.5 py-3 text-[0.95rem] outline-none transition-colors placeholder:text-muted/80 focus:border-ink focus:ring-0',
          error ? 'border-saga-deep' : 'border-line-strong',
        ),
      })}
      {error && <p id={`${fid}-err`} className="mt-2 text-sm text-saga-deep">{error}</p>}
    </div>
  );
}
