import { useEffect, useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { api } from "@/api/client";
import { Image } from "@/components/ui/image";
import DivisionTag from "@/components/site/DivisionTag";
import ProjectCard from "@/components/site/ProjectCard";
import ContactStrip from "@/components/site/ContactStrip";
import { NotFound } from "@/components/NotFound";
import { useLang } from "@/lib/i18n";
import { DIVISION_MAP } from "@/lib/divisions";
import { useDivision } from "@/lib/site-content";

export const Route = createFileRoute("/divisions/$division")({
  // A division with its own website (Together Global) has no page here: send visitors there.
  beforeLoad: ({ params }) => {
    const url = DIVISION_MAP[params?.division]?.externalUrl;
    if (url) throw redirect({ href: url });
  },
  head: ({ params }) => {
    const division = DIVISION_MAP[params?.division] || DIVISION_MAP.solutions;
    return {
      meta: [
        { title: `${division.name.en} — Together` },
        { name: "description", content: division.short.en },
      ],
    };
  },
  component: DivisionPage,
});

function DivisionPage() {
  const { division: slug } = Route.useParams();
  const { t, pick } = useLang();
  const division = useDivision(slug);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!division) return;
    let active = true;
    setLoading(true);
    api.entities.Project.filter({ division: division.slug }, { sort: "-year", limit: 6 })
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
  }, [division]);

  if (!division) return <NotFound />;

  return (
    <>
      <section className="bg-paper pt-[68px] lg:pt-[76px]">
        <div className="container-x py-12 lg:py-16">
          <div className="flex items-center gap-2 font-body text-[0.82rem] text-graphite/80">
            <Link to="/" className="transition-colors hover:text-ink">
              Together
            </Link>
            <span aria-hidden="true" className="text-graphite/40">
              /
            </span>
            <span>{t("nav.divisions")}</span>
          </div>
          <div className="mt-5">
            <DivisionTag slug={division.slug} />
          </div>
          <h1 className="mt-5 max-w-[18ch] font-heading text-[2.3rem] font-extrabold leading-[1.02] text-ink sm:text-[3.1rem] lg:text-[3.7rem]">
            {pick(division.name)}
          </h1>
          <p className="measure mt-6 text-[1.05rem] leading-relaxed text-graphite">
            {pick(division.description)}
          </p>
        </div>
      </section>

      <section>
        <Image
          src={division.image}
          alt={pick(division.name)}
          className="h-[36svh] w-full lg:h-[52svh]"
          fittingType="fill"
        />
      </section>

      <section className="bg-paper py-14 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <h2 className="font-heading text-[1.6rem] font-extrabold leading-tight text-ink lg:text-[2rem]">
              {t("division.services")}
            </h2>
            <span
              className="mt-5 block h-[3px] w-14"
              style={{ backgroundColor: division.color }}
              aria-hidden="true"
            />
          </div>
          <div className="lg:col-span-8">
            <ul>
              {division.services.map((service) => (
                <li
                  key={service.en}
                  className="flex items-start gap-4 border-t border-ink/15 py-5 last:border-b"
                >
                  <span
                    className="mt-2 h-2.5 w-2.5 shrink-0"
                    style={{ backgroundColor: division.color }}
                    aria-hidden="true"
                  />
                  <span className="font-heading text-[1.1rem] font-semibold leading-snug text-ink lg:text-[1.22rem]">
                    {pick(service)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-mist py-14 lg:py-20">
        <div className="container-x">
          <div className="flex flex-col gap-6 border-t border-ink/15 pt-8 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-heading text-[1.7rem] font-extrabold leading-tight text-ink lg:text-[2.2rem]">
              {t("division.projects")}
            </h2>
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 font-body text-[0.88rem] font-semibold text-ink underline decoration-ink/30 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-ink"
            >
              {t("cta.viewAll")}
              <ArrowRight className="arrow-nudge flip-rtl h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {loading ? (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((index) => (
                <div key={index} className="h-40 animate-pulse bg-paper" />
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <p className="measure mt-8 text-[1rem] leading-relaxed text-graphite">
              {t("division.projects.empty")}
            </p>
          )}
        </div>
      </section>

      <ContactStrip />
    </>
  );
}