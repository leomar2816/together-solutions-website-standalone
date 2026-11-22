import { useSiteContent } from "@/lib/site-content";
import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export default function ContactStrip() {
  const { t } = useLang();
  const { contact } = useSiteContent();

  return (
    <section className="relative overflow-hidden bg-ink py-16 text-paper lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_120%_at_100%_100%,#0F2837_0%,transparent_60%)]"
        aria-hidden="true"
      />
      <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <h2 className="max-w-[17ch] font-heading text-[1.95rem] font-extrabold leading-[1.05] text-paper sm:text-[2.5rem] lg:text-[3rem]">
            {t("home.contact.title")}
          </h2>
          <p className="mt-5 max-w-[50ch] text-[1.02rem] leading-relaxed text-paper/70">
            {t("home.contact.body")}
          </p>
        </div>
        <div className="lg:col-span-5 lg:ps-10">
          <Link
            to="/contact"
            className="btn-lift inline-flex h-12 items-center bg-signal px-6 font-body text-[0.95rem] font-semibold text-ink hover:bg-paper"
          >
            {t("cta.start")}
          </Link>
          <div className="mt-7 space-y-1 text-[0.95rem] text-paper/60">
            <p>{t("contact.location.value")}</p>
            <a
              href={`mailto:${contact.email}`}
              className="inline-block underline decoration-paper/30 underline-offset-4 transition-colors hover:text-paper"
            >
              {contact.email}
            </a>
            {contact.phone && (
              <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} dir="ltr" className="block underline decoration-paper/30 underline-offset-4 transition-colors hover:text-paper">
                {contact.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}