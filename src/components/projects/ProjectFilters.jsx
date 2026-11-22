import { DIVISIONS, getDivision } from "@/lib/divisions";
import { useLang } from "@/lib/i18n";

export default function ProjectFilters({ division, year, years, onDivision, onYear, count }) {
  const { t, pick } = useLang();

  return (
    <div className="mt-10 border-t border-ink/15 pt-6">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-5">
          <div>
            <p className="font-body text-[11px] tracking-[0.16em] text-graphite/80">
              {t("projects.filter.division")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onDivision("all")}
                aria-pressed={division === "all"}
                className={`h-9 px-3 font-body text-[10px] font-semibold tracking-[0.18em] transition-colors ${
                  division === "all"
                    ? "bg-ink text-paper"
                    : "border border-ink/25 text-ink hover:border-ink"
                }`}
              >
                {pick({ en: "ALL", ar: "الكل" })}
              </button>
              {DIVISIONS.map((item) => {
                const active = division === item.slug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => onDivision(item.slug)}
                    aria-pressed={active}
                    style={
                      active
                        ? { backgroundColor: item.color, color: "#FFFFFF" }
                        : { border: `1px solid ${item.color}`, color: item.color }
                    }
                    className="h-9 px-3 font-body text-[10px] font-semibold tracking-[0.18em] transition-opacity hover:opacity-75"
                  >
                    {item.tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="font-body text-[11px] tracking-[0.16em] text-graphite/80">
              {t("projects.filter.year")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onYear("all")}
                aria-pressed={year === "all"}
                className={`h-9 px-3 font-body text-[0.8rem] font-semibold transition-colors ${
                  year === "all"
                    ? "bg-ink text-paper"
                    : "border border-ink/25 text-ink hover:border-ink"
                }`}
              >
                {pick({ en: "All years", ar: "كل السنوات" })}
              </button>
              {years.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onYear(value)}
                  aria-pressed={year === value}
                  className={`h-9 px-3 font-body text-[0.8rem] font-semibold transition-colors ${
                    year === value
                      ? "bg-ink text-paper"
                      : "border border-ink/25 text-ink hover:border-ink"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="font-body text-[0.85rem] text-graphite lg:pt-6">
          {t("projects.count").replace("{n}", count)}
        </p>
      </div>
    </div>
  );
}