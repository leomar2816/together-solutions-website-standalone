import { useSiteContent } from "@/lib/site-content";
import { useEffect, useRef, useState } from "react";
import SectionIntro from "@/components/site/SectionIntro";
import CountUp from "@/components/site/CountUp";
import { useLang } from "@/lib/i18n";
import { getDivision } from "@/lib/divisions";

export default function ProofLedger() {
  const { t, pick } = useLang();
  const { stats } = useSiteContent();
  const gridRef = useRef(null);
  const [inView, setInView] = useState(false);

  // Start the count-up the first time the figures scroll into view, once per visit.
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return undefined;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-t border-ink/10 bg-paper py-16 lg:py-24">
      <div className="container-x">
        <SectionIntro title={t("home.ledger.title")} body={t("home.ledger.body")} />

        <div
          ref={gridRef}
          className="mt-12 grid grid-cols-1 gap-x-10 gap-y-11 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
        >
          {stats.map((stat, index) => (
            <div key={stat.label.en}>
              <span
                className="mb-5 block h-[3px] w-12"
                style={{ backgroundColor: getDivision(stat.division).color }}
                aria-hidden="true"
              />
              <p dir="ltr" className="font-heading text-[2.6rem] font-extrabold leading-none tracking-[-0.03em] text-ink rtl:text-right lg:text-[3.3rem]">
                <CountUp value={stat.value} start={inView} duration={1500 + index * 60} />
              </p>
              <p className="mt-3 max-w-[28ch] text-[0.95rem] leading-snug text-graphite">
                {pick(stat.label)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
