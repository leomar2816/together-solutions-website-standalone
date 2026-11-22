import DivisionLink from "@/components/site/DivisionLink";
import { useDivisions } from "@/lib/site-content";
import { ArrowRight } from "lucide-react";
import SectionIntro from "@/components/site/SectionIntro";
import { useLang } from "@/lib/i18n";

export default function DivisionsGrid() {
  const { t, pick } = useLang();
  const divisions = useDivisions();

  return (
    <section className="bg-paper py-16 lg:py-24">
      <div className="container-x">
        <SectionIntro title={t("home.divisions.title")} body={t("home.divisions.body")} />

        <div className="mt-12 grid grid-cols-1 gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {divisions.map((division) => (
            <DivisionLink
              key={division.slug}
              division={division}
              showIcon={false}
              className="group relative flex flex-col bg-paper p-7 transition-[background-color,box-shadow] duration-300 hover:z-10 hover:bg-mist hover:shadow-[0_22px_44px_-28px_rgba(16,24,32,0.5)] focus-visible:z-10 lg:p-8"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-[3px] w-10 transition-[width] duration-300 ease-out group-hover:w-16 group-focus-visible:w-16"
                  style={{ backgroundColor: division.color }}
                  aria-hidden="true"
                />
                <span
                  className="inline-block px-2 py-[3px] font-body text-[9px] font-semibold leading-none tracking-[0.2em] text-paper"
                  style={{ backgroundColor: division.color }}
                >
                  {division.tag}
                </span>
              </div>

              <h3 className="mt-6 font-heading text-[1.35rem] font-bold leading-tight text-ink">
                {pick(division.name)}
              </h3>
              <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-graphite">
                {pick(division.short)}
              </p>

              <span className="mt-7 inline-flex items-center gap-2 font-body text-[0.88rem] font-semibold text-ink">
                {t("cta.explore")}
                <ArrowRight className="arrow-nudge flip-rtl h-4 w-4" aria-hidden="true" />
              </span>
            </DivisionLink>
          ))}
        </div>
      </div>
    </section>
  );
}