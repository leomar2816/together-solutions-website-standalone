import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/api/client";
import ProjectFilters from "@/components/projects/ProjectFilters";
import ProjectTimeline from "@/components/projects/ProjectTimeline";
import ContactStrip from "@/components/site/ContactStrip";
import { useLang } from "@/lib/i18n";

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Together" },
      {
        name: "description",
        content:
          "Projects delivered by Together across government, PIF companies and international partners, from 2020 to today.",
      },
    ],
  }),
  component: Projects,
});

function Projects() {
  const { t, pick } = useLang();
  const [division, setDivision] = useState("all");
  const [year, setYear] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const query = {};
    if (division !== "all") query.division = division;
    if (year !== "all") query.year = year;

    setLoading(true);
    api.entities.Project.filter(query, { sort: "-year", limit: 200 })
      .then((page) => {
        if (active) setProjects(page.items || []);
      })
      .catch(() => {
        if (active) setProjects([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [division, year]);

  const groups = useMemo(() => {
    const map = new Map();
    projects.forEach((project) => {
      if (!map.has(project.year)) map.set(project.year, []);
      map.get(project.year).push(project);
    });
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [projects]);

  return (
    <>
      <section className="bg-paper pt-[68px] lg:pt-[76px]">
        <div className="container-x py-14 lg:py-20">
          <h1 className="font-heading text-[2.3rem] font-extrabold leading-[1.02] text-ink sm:text-[3.1rem] lg:text-[3.7rem]">
            {t("projects.title")}
          </h1>
          <p className="measure mt-6 text-[1.05rem] leading-relaxed text-graphite">{t("projects.body")}</p>

          <ProjectFilters
            division={division}
            year={year}
            years={YEARS}
            count={projects.length}
            onDivision={setDivision}
            onYear={setYear}
          />
        </div>
      </section>

      <section className="bg-paper pb-16 lg:pb-24">
        <div className="container-x">
          {loading ? (
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="h-36 animate-pulse bg-mist" />
              ))}
            </div>
          ) : groups.length > 0 ? (
            <div key={`${division}-${year}`} className="fade-enter">
              <ProjectTimeline groups={groups} />
            </div>
          ) : (
            <div className="mt-14 border-t border-ink/15 pt-8">
              <p className="text-[1rem] text-graphite">{t("projects.empty")}</p>
              <button
                type="button"
                onClick={() => {
                  setDivision("all");
                  setYear("all");
                }}
                className="btn-lift mt-5 inline-flex h-11 items-center border border-ink px-5 font-body text-[0.88rem] font-semibold text-ink hover:bg-ink hover:text-paper"
              >
                {pick({ en: "Clear filters", ar: "إلغاء التصنيف" })}
              </button>
            </div>
          )}
        </div>
      </section>

      <ContactStrip />
    </>
  );
}