import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";

export default function VisionPanel() {
  const { t } = useLang();

  return (
    <section className="bg-mist py-16 lg:py-28">
      <div className="container-x">
        <h2 className="max-w-[19ch] font-heading text-[2.05rem] font-extrabold leading-[1.02] text-ink sm:text-[2.9rem] lg:text-[3.7rem]">
          {t("home.vision.statement")}
        </h2>

        <div className="mt-10 grid gap-8 border-t border-ink/15 pt-8 lg:mt-14 lg:grid-cols-12">
          <div className="hidden lg:col-span-4 lg:block">
            <span className="block h-[3px] w-16 bg-signal" aria-hidden="true" />
          </div>
          <div className="lg:col-span-7">
            <p className="measure text-[1.05rem] leading-relaxed text-graphite">{t("home.vision.body")}</p>
            <Link
              to="/about"
              className="group mt-7 inline-flex items-center gap-2 border-b border-ink pb-1 font-body text-[0.95rem] font-semibold text-ink transition-colors duration-200 hover:border-signal"
            >
              {t("nav.about")}
              <ArrowRight className="arrow-nudge flip-rtl h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}