import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DICT } from "@/lib/i18n";
import { DIVISIONS } from "@/lib/divisions";
import {
  BilingualField,
  Field,
  ImageField,
  ListEditor,
  OverrideActions,
  Panel,
  TextInput,
  inputCls,
} from "@/components/admin/fields";

/* ---------------------------------------------------------------- Page text */

const TEXT_GROUPS = [
  { id: "home", label: "Home page", prefixes: ["home."] },
  { id: "about", label: "About", prefixes: ["about."] },
  { id: "projects", label: "Projects", prefixes: ["projects."] },
  { id: "leadership", label: "Leadership", prefixes: ["leadership."] },
  { id: "partners", label: "Partners", prefixes: ["partners."] },
  { id: "contact", label: "Contact page and form", prefixes: ["contact.", "form."] },
  { id: "division", label: "Division pages", prefixes: ["division."] },
  { id: "nav", label: "Navigation and buttons", prefixes: ["nav.", "cta."] },
  { id: "footer", label: "Footer", prefixes: ["footer."] },
  { id: "maintenance", label: "Maintenance page", prefixes: ["maintenance."] },
];

const humanize = (key) => {
  const parts = key.split(".").slice(1);
  const text = parts.join(" ").replace(/([a-z])([A-Z])/g, "$1 $2");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export function TextSection({ draft, setOverride }) {
  const [group, setGroup] = useState("home");
  const [query, setQuery] = useState("");
  const texts = draft.texts || { en: {}, ar: {} };

  const keys = useMemo(() => {
    const all = Object.keys(DICT.en);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      return all.filter(
        (key) =>
          key.toLowerCase().includes(q) ||
          String(texts.en?.[key] ?? DICT.en[key]).toLowerCase().includes(q) ||
          String(texts.ar?.[key] ?? DICT.ar[key] ?? "").includes(query.trim()),
      );
    }
    const current = TEXT_GROUPS.find((g) => g.id === group);
    return all.filter((key) => current.prefixes.some((p) => key.startsWith(p)));
  }, [group, query, texts]);

  const setText = (key, lang, value) => {
    const next = { en: { ...(texts.en || {}) }, ar: { ...(texts.ar || {}) } };
    if (value === (DICT[lang]?.[key] ?? "") || value === "") delete next[lang][key];
    else next[lang][key] = value;
    const empty = !Object.keys(next.en).length && !Object.keys(next.ar).length;
    setOverride("texts", empty ? undefined : next);
  };

  const resetKey = (key) => {
    const next = { en: { ...(texts.en || {}) }, ar: { ...(texts.ar || {}) } };
    delete next.en[key];
    delete next.ar[key];
    const empty = !Object.keys(next.en).length && !Object.keys(next.ar).length;
    setOverride("texts", empty ? undefined : next);
  };

  return (
    <Panel
      title="Page text"
      description="Headlines, paragraphs, labels and buttons across the site, in English and Arabic. Leave a field as it is to keep the original wording."
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Text groups">
          {TEXT_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={!query && group === g.id}
              onClick={() => {
                setGroup(g.id);
                setQuery("");
              }}
              className={`h-8 px-2.5 font-body text-[0.78rem] font-semibold transition-colors ${
                !query && group === g.id ? "bg-ink text-paper" : "border border-ink/15 text-ink hover:border-ink"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
        <label className="relative block lg:w-72">
          <span className="sr-only">Search all text</span>
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/60" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search all text"
            className={`${inputCls} h-10 ps-9`}
          />
        </label>
      </div>

      {keys.length === 0 && <p className="text-[0.9rem] text-graphite">No text matches “{query}”.</p>}

      <div className="divide-y divide-ink/10 border-y border-ink/10">
        {keys.map((key) => {
          const edited = texts.en?.[key] !== undefined || texts.ar?.[key] !== undefined;
          const long = String(DICT.en[key]).length > 70;
          return (
            <div key={key} className="py-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="font-body text-[0.82rem] font-semibold text-ink">
                  {humanize(key)} <span className="font-normal text-graphite/60">({key})</span>
                </p>
                {edited && (
                  <button
                    type="button"
                    onClick={() => resetKey(key)}
                    className="font-body text-[0.75rem] font-semibold text-graphite underline decoration-ink/20 underline-offset-4 hover:text-ink"
                  >
                    Restore original
                  </button>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput
                  aria-label={`${humanize(key)}, English`}
                  value={texts.en?.[key] ?? DICT.en[key]}
                  onChange={(value) => setText(key, "en", value)}
                  multiline={long}
                  rows={3}
                />
                <TextInput
                  aria-label={`${humanize(key)}, Arabic`}
                  dir="rtl"
                  value={texts.ar?.[key] ?? DICT.ar[key] ?? ""}
                  onChange={(value) => setText(key, "ar", value)}
                  multiline={long}
                  rows={3}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

/* ---------------------------------------------------------------- Home */

const divisionOptions = DIVISIONS.map((d) => ({ value: d.slug, label: d.name.en }));

function DivisionSelect({ value, onChange, label = "Accent colour" }) {
  return (
    <Field label={label}>
      <select value={value || "solutions"} onChange={(event) => onChange(event.target.value)} className={`${inputCls} h-10`}>
        {divisionOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function HomeSection({ draft, resolved, setOverride }) {
  const heroEdited = Boolean(draft.media?.heroSlides);
  const setMedia = (patch) => {
    const next = { ...(draft.media || {}), ...patch };
    Object.keys(next).forEach((k) => next[k] === undefined && delete next[k]);
    setOverride("media", Object.keys(next).length ? next : undefined);
  };

  return (
    <div className="space-y-6">
      <Panel
        title="Hero images"
        description="The images behind the home page banner. They crossfade in this order. Wide, light images work best; the navy panel covers the left side on desktop."
        actions={<OverrideActions edited={heroEdited} onReset={() => setMedia({ heroSlides: undefined })} />}
      >
        <ListEditor
          items={resolved.media.heroSlides}
          onChange={(heroSlides) => setMedia({ heroSlides })}
          min={1}
          addLabel="Add image"
          newItem={() => ({ src: "", alt: "" })}
          itemLabel={(item, i) => `Image ${i + 1}`}
          renderItem={(item, patch) => (
            <>
              <ImageField value={item.src} alt={item.alt} onChange={({ url }) => patch({ src: url })} />
              <Field label="Image description" hint="Read aloud by screen readers. Describe what the image shows.">
                <TextInput value={item.alt} onChange={(alt) => patch({ alt })} />
              </Field>
            </>
          )}
        />
      </Panel>

      <Panel
        title="Statistics"
        description="The “Proof, not promises” figures. Keep the value short, for example 1,000+, 1M+, 70% or 2010; the count-up animation keeps the + and % signs."
        actions={<OverrideActions edited={Boolean(draft.stats)} onReset={() => setOverride("stats", undefined)} />}
      >
        <ListEditor
          items={resolved.stats}
          onChange={(stats) => setOverride("stats", stats)}
          min={1}
          addLabel="Add statistic"
          newItem={() => ({ value: "", division: "solutions", label: { en: "", ar: "" } })}
          itemLabel={(item) => item.value || "New statistic"}
          renderItem={(item, patch) => (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Value">
                  <TextInput value={item.value} onChange={(value) => patch({ value })} placeholder="1,000+" />
                </Field>
                <DivisionSelect value={item.division} onChange={(division) => patch({ division })} />
              </div>
              <BilingualField label="Label" value={item.label} onChange={(label) => patch({ label })} />
            </>
          )}
        />
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------- Partners */

export function PartnersSection({ draft, resolved, setOverride }) {
  return (
    <Panel
      title="Partners"
      description="Logos on the home and Partners pages. Use the partner's own supplied artwork. The name is read by screen readers and shown as text if no logo is set."
      actions={<OverrideActions edited={Boolean(draft.partners)} onReset={() => setOverride("partners", undefined)} />}
    >
      <ListEditor
        items={resolved.partners}
        onChange={(partners) => setOverride("partners", partners)}
        min={1}
        addLabel="Add partner"
        newItem={() => ({ name: "", logo: null, ratio: 2 })}
        itemLabel={(item) => item.name || "New partner"}
        renderItem={(item, patch) => (
          <>
            <Field label="Partner name">
              <TextInput value={item.name} onChange={(name) => patch({ name })} />
            </Field>
            <ImageField
              label="Logo"
              hint="PNG, SVG or WebP with a transparent or white background works best."
              preview="logo"
              value={item.logo}
              alt={item.name}
              onChange={({ url, width, height }) =>
                patch({ logo: url, ratio: width && height ? Math.round((width / height) * 100) / 100 : item.ratio || 2 })
              }
            />
            {item.logo && (
              <button
                type="button"
                onClick={() => patch({ logo: null })}
                className="font-body text-[0.75rem] font-semibold text-graphite underline decoration-ink/20 underline-offset-4 hover:text-ink"
              >
                Remove logo and show the name as text
              </button>
            )}
          </>
        )}
      />
    </Panel>
  );
}

/* ---------------------------------------------------------------- Divisions */

export function DivisionsSection({ draft, resolved, setOverride }) {
  const [slug, setSlug] = useState("solutions");
  const division = resolved.divisions.find((d) => d.slug === slug);
  const overrides = draft.divisions || {};
  const edited = Boolean(overrides[slug]);

  const patch = (change) => {
    const current = { ...(overrides[slug] || {}), ...change };
    const next = { ...overrides, [slug]: current };
    setOverride("divisions", next);
  };
  const reset = () => {
    const next = { ...overrides };
    delete next[slug];
    setOverride("divisions", Object.keys(next).length ? next : undefined);
  };

  return (
    <Panel
      title="Divisions"
      description="Names, descriptions, services and the main image for each division page. Colours and tags stay as they are, to keep the brand consistent."
      actions={<OverrideActions edited={edited} onReset={reset} />}
    >
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Divisions">
        {resolved.divisions.map((d) => (
          <button
            key={d.slug}
            type="button"
            role="tab"
            aria-selected={slug === d.slug}
            onClick={() => setSlug(d.slug)}
            className={`inline-flex h-8 items-center gap-2 px-2.5 font-body text-[0.78rem] font-semibold transition-colors ${
              slug === d.slug ? "bg-ink text-paper" : "border border-ink/15 text-ink hover:border-ink"
            }`}
          >
            <span className="h-2.5 w-2.5" style={{ backgroundColor: d.color }} aria-hidden="true" />
            {d.name.en}
            {overrides[d.slug] && <span className="sr-only">(edited)</span>}
          </button>
        ))}
      </div>

      <BilingualField label="Division name" value={division.name} onChange={(name) => patch({ name })} />
      <BilingualField label="Short summary" hint="Shown on cards and in the menu." value={division.short} onChange={(short) => patch({ short })} multiline rows={2} />
      <BilingualField label="Description" hint="The opening paragraph of the division page." value={division.description} onChange={(description) => patch({ description })} multiline rows={5} />
      <ImageField label="Division image" value={division.image} alt={division.name.en} onChange={({ url }) => patch({ image: url })} />
      <div>
        <p className="mb-2 font-body text-[0.82rem] font-semibold text-ink">Services</p>
        <ListEditor
          items={division.services}
          onChange={(services) => patch({ services })}
          min={1}
          addLabel="Add service"
          newItem={() => ({ en: "", ar: "" })}
          itemLabel={(item, i) => item.en || `Service ${i + 1}`}
          renderItem={(item, change) => <BilingualField label="Service" value={item} onChange={(value) => change(value)} />}
        />
      </div>
    </Panel>
  );
}

/* ---------------------------------------------------------------- About */

function TitleBodyList({ items, onChange, addLabel, kind }) {
  return (
    <ListEditor
      items={items}
      onChange={onChange}
      min={1}
      addLabel={addLabel}
      newItem={() => ({ title: { en: "", ar: "" }, body: { en: "", ar: "" } })}
      itemLabel={(item, i) => item.title?.en || `${kind} ${i + 1}`}
      renderItem={(item, patch) => (
        <>
          <BilingualField label="Title" value={item.title} onChange={(title) => patch({ title })} />
          <BilingualField label="Text" value={item.body} onChange={(body) => patch({ body })} multiline rows={3} />
        </>
      )}
    />
  );
}

export function AboutSection({ draft, resolved, setOverride }) {
  const setInterior = (url) => {
    const next = { ...(draft.media || {}), interior: url };
    if (!url) delete next.interior;
    setOverride("media", Object.keys(next).length ? next : undefined);
  };
  return (
    <div className="space-y-6">
      <Panel
        title="About page image"
        actions={<OverrideActions edited={Boolean(draft.media?.interior)} onReset={() => setInterior(undefined)} />}
      >
        <ImageField value={resolved.media.interior} onChange={({ url }) => setInterior(url)} />
      </Panel>
      <Panel
        title="Core values"
        actions={<OverrideActions edited={Boolean(draft.values)} onReset={() => setOverride("values", undefined)} />}
      >
        <TitleBodyList items={resolved.values} onChange={(values) => setOverride("values", values)} addLabel="Add value" kind="Value" />
      </Panel>
      <Panel
        title="Our approach"
        description="The steps of how the group works."
        actions={<OverrideActions edited={Boolean(draft.approach)} onReset={() => setOverride("approach", undefined)} />}
      >
        <TitleBodyList items={resolved.approach} onChange={(approach) => setOverride("approach", approach)} addLabel="Add step" kind="Step" />
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------- Leadership */

export function LeadershipSection({ draft, resolved, setOverride }) {
  return (
    <Panel
      title="Leadership"
      description="The people on the Leadership page, in display order."
      actions={<OverrideActions edited={Boolean(draft.leadership)} onReset={() => setOverride("leadership", undefined)} />}
    >
      <ListEditor
        items={resolved.leadership}
        onChange={(leadership) => setOverride("leadership", leadership)}
        min={1}
        addLabel="Add person"
        newItem={() => ({ name: "", initials: "", role: { en: "", ar: "" }, bio: { en: "", ar: "" } })}
        itemLabel={(item) => item.name || "New person"}
        renderItem={(item, patch) => (
          <>
            <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
              <Field label="Full name">
                <TextInput value={item.name} onChange={(name) => patch({ name })} />
              </Field>
              <Field label="Initials">
                <TextInput value={item.initials} onChange={(initials) => patch({ initials: initials.slice(0, 3).toUpperCase() })} />
              </Field>
            </div>
            <BilingualField label="Role" value={item.role} onChange={(role) => patch({ role })} />
            <BilingualField label="Biography" value={item.bio} onChange={(bio) => patch({ bio })} multiline rows={5} />
          </>
        )}
      />
    </Panel>
  );
}

/* ---------------------------------------------------------------- Contact */

const emailOk = (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function ContactSection({ draft, resolved, setOverride }) {
  const contact = resolved.contact;
  const set = (patch) => setOverride("contact", { ...contact, ...patch });
  return (
    <Panel
      title="Contact details"
      description="Shown on the Contact page, the contact strip and the footer. They are never shown on the maintenance page. The office address and opening hours are under Page text, in Contact page and form."
      actions={<OverrideActions edited={Boolean(draft.contact)} onReset={() => setOverride("contact", undefined)} />}
    >
      <Field label="Email address" hint={emailOk(contact.email) ? undefined : "This doesn't look like an email address."} htmlFor="contact-email">
        <TextInput id="contact-email" type="email" value={contact.email} onChange={(email) => set({ email: email.trim() })} />
      </Field>
      <Field label="Phone number" hint="Optional. Leave empty to hide it." htmlFor="contact-phone">
        <TextInput id="contact-phone" type="tel" dir="ltr" value={contact.phone} onChange={(phone) => set({ phone })} placeholder="+966 …" />
      </Field>
    </Panel>
  );
}

export const contactValid = (resolved) => emailOk(resolved.contact.email) && Boolean(resolved.contact.email);

