import { createContext, useContext, useMemo } from "react";
import { APPROACH, CONTACT_EMAIL, LEADERSHIP, PARTNERS, STATS, VALUES } from "@/lib/content";
import { DIVISIONS } from "@/lib/divisions";
import { media } from "@/lib/media";

/*
 * Managed content.
 *
 * The site's built-in content (content.js, divisions.js, media.js, i18n.jsx) is the
 * default. The content manager stores only *overrides*: what an admin changed. The
 * published overrides are merged over the defaults here, so anything not edited keeps
 * its current value, and clearing an override restores the original.
 *
 * Override document shape (every key optional):
 *   texts:      { en: { "home.hero.title": "…" }, ar: { … } }
 *   stats:      [{ value, division, label: { en, ar } }]
 *   partners:   [{ name, logo, ratio }]
 *   leadership: [{ name, initials, role: { en, ar }, bio: { en, ar } }]
 *   values / approach: [{ title: { en, ar }, body: { en, ar } }]
 *   divisions:  { [slug]: { name, short, description: { en, ar }, services: [{ en, ar }], image } }
 *   media:      { heroSlides: [{ src, alt }], interior }
 *   contact:    { email, phone }
 */

export const DEFAULT_CONTENT = {
  stats: STATS,
  partners: PARTNERS,
  leadership: LEADERSHIP,
  values: VALUES,
  approach: APPROACH,
  divisions: DIVISIONS,
  media: { heroSlides: media.heroSlides, interior: media.interior },
  contact: { email: CONTACT_EMAIL, phone: "" },
};

const isList = (value) => Array.isArray(value) && value.length > 0;

/** Merge an override document over the defaults. Bad or missing parts fall back safely. */
export function resolveContent(overrides) {
  const o = overrides && typeof overrides === "object" ? overrides : {};
  const divisionOverrides = o.divisions && typeof o.divisions === "object" ? o.divisions : {};

  return {
    texts: o.texts && typeof o.texts === "object" ? o.texts : {},
    stats: isList(o.stats) ? o.stats : DEFAULT_CONTENT.stats,
    partners: isList(o.partners) ? o.partners : DEFAULT_CONTENT.partners,
    leadership: isList(o.leadership) ? o.leadership : DEFAULT_CONTENT.leadership,
    values: isList(o.values) ? o.values : DEFAULT_CONTENT.values,
    approach: isList(o.approach) ? o.approach : DEFAULT_CONTENT.approach,
    divisions: DEFAULT_CONTENT.divisions.map((division) => {
      const patch = divisionOverrides[division.slug] || {};
      return {
        ...division,
        // structure (slug, tag, colour) never changes; text and image can
        name: patch.name || division.name,
        short: patch.short || division.short,
        description: patch.description || division.description,
        services: isList(patch.services) ? patch.services : division.services,
        image: patch.image || division.image,
      };
    }),
    media: {
      heroSlides: isList(o.media?.heroSlides) ? o.media.heroSlides : DEFAULT_CONTENT.media.heroSlides,
      interior: o.media?.interior || DEFAULT_CONTENT.media.interior,
    },
    contact: {
      email: o.contact?.email ?? DEFAULT_CONTENT.contact.email,
      phone: o.contact?.phone ?? DEFAULT_CONTENT.contact.phone,
    },
  };
}

const SiteContentContext = createContext(resolveContent({}));

export function SiteContentProvider({ overrides, children }) {
  const value = useMemo(() => resolveContent(overrides), [overrides]);
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}

/** Divisions with any managed text and images applied. */
export function useDivisions() {
  return useContext(SiteContentContext).divisions;
}

export function useDivision(slug) {
  const divisions = useDivisions();
  return divisions.find((division) => division.slug === slug) || null;
}
