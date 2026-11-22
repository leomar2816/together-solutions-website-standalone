import { useSiteContent } from "@/lib/site-content";
import { createFileRoute } from "@tanstack/react-router";
import EnquiryForm from "@/components/contact/EnquiryForm";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Together" },
      {
        name: "description",
        content:
          "Contact Together in Riyadh. Tell us about the programme, launch or partnership you are planning.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { t } = useLang();
  const { contact } = useSiteContent();

  return (
    <section className="bg-paper pt-[68px] lg:pt-[76px]">
      <div className="container-x grid gap-12 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
        <div className="lg:col-span-4">
          <h1 className="font-heading text-[2.3rem] font-extrabold leading-[1.02] text-ink sm:text-[3rem]">
            {t("contact.title")}
          </h1>
          <p className="measure mt-6 text-[1.02rem] leading-relaxed text-graphite">{t("contact.body")}</p>

          <div className="mt-10 border-t border-ink/15 pt-6">
            <p className="font-body text-[11px] tracking-[0.16em] text-graphite/80">
              {t("contact.location.title")}
            </p>
            <p className="mt-2 font-heading text-[1.15rem] font-semibold text-ink">
              {t("contact.location.value")}
            </p>
            <p className="mt-1.5 text-[0.92rem] text-graphite">{t("contact.hours")}</p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-4 inline-block font-body text-[0.95rem] font-semibold text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink"
            >
              {contact.email}
            </a>
            {contact.phone && (
              <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} dir="ltr" className="mt-2 block font-body text-[0.95rem] font-semibold text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink">
                {contact.phone}
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}