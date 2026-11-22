import { createFileRoute } from "@tanstack/react-router";
import PartnerWall from "@/components/site/PartnerWall";
import ContactStrip from "@/components/site/ContactStrip";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners — Together" },
      {
        name: "description",
        content:
          "Government entities, PIF companies, international institutions and brands Together has delivered with.",
      },
    ],
  }),
  component: Partners,
});

function Partners() {
  const { t } = useLang();

  return (
    <>
      <section className="bg-paper pt-[68px] lg:pt-[76px]">
        <div className="container-x py-14 lg:py-20">
          <h1 className="font-heading text-[2.3rem] font-extrabold leading-[1.02] text-ink sm:text-[3.1rem] lg:text-[3.7rem]">
            {t("partners.title")}
          </h1>
          <p className="measure mt-6 text-[1.05rem] leading-relaxed text-graphite">{t("partners.body")}</p>
          <div className="mt-12">
            <PartnerWall
              title={t("home.partners.title")}
              note={t("partners.note")}
            />
          </div>
        </div>
      </section>

      <ContactStrip />
    </>
  );
}