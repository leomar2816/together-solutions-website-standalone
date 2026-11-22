import DivisionLink from "@/components/site/DivisionLink";
import { useSiteContent, useDivisions } from "@/lib/site-content";
import { Link } from "@tanstack/react-router";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import Wordmark from "@/components/site/Wordmark";
import { useLang } from "@/lib/i18n";

// Pick navy or white text for a tag, whichever has the higher contrast on its colour.
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function tagText(bg) {
  const l = luminance(bg);
  const onWhite = 1.05 / (l + 0.05);
  const onInk = (l + 0.05) / (luminance("#101820") + 0.05);
  return onWhite >= onInk ? "#FFFFFF" : "#101820";
}

export default function Hero() {
  const { t, pick, lang } = useLang();
  const { media: siteMedia } = useSiteContent();
  const divisions = useDivisions();

  return (
    <section className="relative bg-paper" data-no-reveal>
      <div className="relative lg:flex lg:min-h-[100svh] lg:items-end lg:pt-[108px]">
        <div className="relative h-[32svh] w-full overflow-hidden sm:h-[50svh] lg:absolute lg:inset-y-0 lg:end-0 lg:h-full lg:w-[64%]">
          <HeroSlideshow
            slides={siteMedia.heroSlides}
            pauseLabel={lang === "ar" ? "إيقاف تبديل الصور" : "Pause background images"}
            playLabel={lang === "ar" ? "تشغيل تبديل الصور" : "Play background images"}
          />
          {/* Soft shading so the photo sits behind the panel rather than beside it. */}
          <div
            className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-ink/25 via-transparent to-transparent lg:bg-gradient-to-r lg:from-ink/20 lg:via-transparent rtl:lg:bg-gradient-to-l"
            aria-hidden="true"
          />
        </div>

        <div className="container-x relative z-10 -mt-12 flex w-full sm:-mt-16 lg:mt-0 lg:items-end lg:pb-0">
          <div className="hero-panel relative w-full bg-ink p-7 text-paper shadow-[0_40px_80px_-36px_rgba(16,24,32,0.65)] sm:p-10 lg:max-w-[610px] lg:p-12 xl:max-w-[660px] xl:p-14">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_100%_0%,rgba(15,40,55,0.9)_0%,transparent_65%)]"
              aria-hidden="true"
            />
            <div className="relative">
            <Wordmark size="xl" tag="SOLUTIONS" animated onDark />

            <h1 className="mt-8 max-w-[20ch] font-heading text-[2rem] font-extrabold leading-[1.05] text-paper sm:text-[2.55rem] lg:text-[2.9rem] xl:text-[3.15rem]">
              {t("home.hero.title")}
            </h1>

            <p className="mt-6 max-w-[46ch] text-[1rem] leading-relaxed text-paper/75">
              {t("home.hero.body")}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="btn-lift inline-flex h-12 items-center bg-signal px-6 font-body text-[0.95rem] font-semibold text-ink hover:bg-paper"
              >
                {t("cta.start")}
              </Link>
              <Link
                to="/divisions/solutions"
                className="btn-lift inline-flex h-12 items-center border border-paper/30 px-6 font-body text-[0.95rem] font-medium text-paper hover:border-paper hover:bg-paper hover:text-ink"
              >
                {t("cta.divisions")}
              </Link>
            </div>

            <nav
              aria-label={lang === "ar" ? "أقسام المجموعة" : "Our divisions"}
              className="mt-9 border-t border-paper/15 pt-6"
            >
              <p className="font-body text-[0.82rem] text-paper/55">
                {lang === "ar" ? "ستة أقسام، معيار تنفيذ واحد" : "Six divisions, one delivery standard"}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {divisions.map((division) => {
                  const onPanel = division.slug === "solutions";
                  return (
                    <li key={division.slug}>
                      <DivisionLink
                        division={division}
                        showIcon={false}
                        aria-label={pick(division.name)}
                        className="inline-flex h-8 items-center px-2.5 font-body text-[10px] font-semibold leading-none tracking-[0.18em] transition-[transform,filter] duration-200 hover:-translate-y-px hover:brightness-110 focus-visible:-translate-y-px"
                        style={{
                          backgroundColor: onPanel ? "#FFFFFF" : division.color,
                          color: onPanel ? "#101820" : tagText(division.color),
                        }}
                      >
                        {division.tag}
                      </DivisionLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}