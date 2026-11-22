import DivisionLink from "@/components/site/DivisionLink";
import { useSiteContent, useDivisions } from "@/lib/site-content";
import { Link } from "@tanstack/react-router";
import Logo from "@/components/site/Logo";
import LangToggle from "@/components/site/LangToggle";
import { useLang } from "@/lib/i18n";
import { NAV_LINKS } from "@/lib/content";

export default function SiteFooter() {
  const { t, pick } = useLang();
  const { contact } = useSiteContent();
  const divisions = useDivisions();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper">
      <div className="container-x grid gap-10 py-14 lg:grid-cols-12 lg:gap-8 lg:py-16">
        <div className="lg:col-span-4">
          <Logo inverted className="h-11 w-auto sm:h-12" />
          <p className="mt-6 max-w-[34ch] text-[0.95rem] leading-relaxed text-paper/60">
            {t("footer.blurb")}
          </p>
        </div>

        <div className="lg:col-span-3">
          <p className="mb-4 text-[11px] tracking-[0.2em] text-paper/60">{t("footer.divisions")}</p>
          <ul className="space-y-2.5">
            {divisions.map((division) => (
              <li key={division.slug} className="flex items-center gap-2.5">
                <span
                  className="h-2 w-2 shrink-0"
                  style={{ backgroundColor: division.color }}
                  aria-hidden="true"
                />
                <DivisionLink
                  division={division}
                  className="font-body text-[0.95rem] text-paper/75 transition-colors hover:text-paper"
                >
                  {pick(division.name)}
                </DivisionLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="mb-4 text-[11px] tracking-[0.2em] text-paper/60">{t("footer.group")}</p>
          <ul className="space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="font-body text-[0.95rem] text-paper/75 transition-colors hover:text-paper"
                >
                  {t(link.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="mb-4 text-[11px] tracking-[0.2em] text-paper/60">{t("footer.contact")}</p>
          <p className="font-body text-[0.95rem] text-paper/75">{t("contact.location.value")}</p>
          <a
            href={`mailto:${contact.email}`}
            className="mt-1 inline-block font-body text-[0.95rem] text-paper/75 underline decoration-paper/30 underline-offset-4 transition-colors hover:text-paper"
          >
            {contact.email}
          </a>
          {contact.phone && (
            <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} dir="ltr" className="mt-1 block font-body text-[0.95rem] text-paper/75 underline decoration-paper/30 underline-offset-4 transition-colors hover:text-paper">
              {contact.phone}
            </a>
          )}
          <Link
            to="/contact"
            className="btn-lift mt-5 inline-flex h-11 items-center border border-paper/30 px-5 font-body text-[0.9rem] font-medium text-paper hover:bg-paper hover:text-ink"
          >
            {t("cta.contact")}
          </Link>
        </div>
      </div>

      <div className="border-t border-paper/15">
        <div className="container-x flex flex-col items-start gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-xs text-paper/50">
            © {year} Together Solutions. {t("footer.rights")}
          </p>
          <LangToggle tone="dark" />
        </div>
      </div>
    </footer>
  );
}