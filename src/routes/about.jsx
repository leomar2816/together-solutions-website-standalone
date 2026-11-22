import { useSiteContent } from "@/lib/site-content";
import { createFileRoute } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import ProofLedger from "@/components/home/ProofLedger";
import ContactStrip from "@/components/site/ContactStrip";
import SectionIntro from "@/components/site/SectionIntro";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Together" },
      {
        name: "description",
        content:
          "Founded in Riyadh in 2010, Together has grown from a communications practice into a group of six divisions serving Vision 2030 sectors.",
      },
    ],
  }),
  component: About,
});

function About() {
  const { t, pick } = useLang();
  const { values, approach, media: siteMedia } = useSiteContent();

  return (
    <>
      <section className="bg-paper pt-[68px] lg:pt-[76px]">
        <div className="container-x py-14 lg:py-20">
          <h1 className="max-w-[20ch] font-heading text-[2.2rem] font-extrabold leading-[1.03] text-ink sm:text-[3rem] lg:text-[3.6rem]">
            {t("about.title")}
          </h1>
          <p className="measure mt-6 text-[1.05rem] leading-relaxed text-graphite">{t("about.body")}</p>
        </div>
      </section>

      <section className="relative">
        <Image
          src={siteMedia.interior}
          alt="Interior of a modern headquarters in Riyadh"
          className="h-[42svh] w-full lg:h-[56svh]"
          fittingType="fill"
        />
        <div className="container-x relative -mt-16 lg:-mt-24">
          <div className="bg-ink p-7 text-paper sm:p-9 lg:max-w-[520px] lg:p-11">
            <span className="block h-[3px] w-14 bg-signal" aria-hidden="true" />
            <h2 className="mt-5 font-heading text-[1.7rem] font-extrabold text-paper lg:text-[2rem]">
              {t("about.founded.title")}
            </h2>
            <p className="mt-4 text-[1rem] leading-relaxed text-paper/75">{t("about.founded.body")}</p>
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-14">
          {[
            { title: t("about.vision.title"), body: t("about.vision.body") },
            { title: t("about.mission.title"), body: t("about.mission.body") },
          ].map((block) => (
            <div key={block.title} className="border-t-2 border-ink pt-6">
              <h2 className="font-heading text-[1.5rem] font-extrabold text-ink lg:text-[1.8rem]">
                {block.title}
              </h2>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-graphite">{block.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-mist py-16 lg:py-24">
        <div className="container-x">
          <SectionIntro title={t("about.values.title")} body={t("about.values.body")} />
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.title.en} className="border-t border-ink/20 pt-5">
                <span className="mb-4 block h-[3px] w-9 bg-ink" aria-hidden="true" />
                <h3 className="font-heading text-[1.15rem] font-bold text-ink">{pick(value.title)}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-graphite">{pick(value.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 lg:py-24">
        <div className="container-x">
          <SectionIntro title={t("about.approach.title")} body={t("about.approach.body")} />
          <div className="mt-12 grid grid-cols-1 gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {approach.map((step) => (
              <div key={step.title.en} className="bg-paper p-6 lg:p-7">
                <h3 className="font-heading text-[1.1rem] font-bold text-ink">{pick(step.title)}</h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-graphite">{pick(step.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProofLedger />
      <ContactStrip />
    </>
  );
}