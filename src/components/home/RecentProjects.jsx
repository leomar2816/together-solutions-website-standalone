import { Link } from "@tanstack/react-router";
import SectionIntro from "@/components/site/SectionIntro";
import ProjectCard from "@/components/site/ProjectCard";
import { useLang } from "@/lib/i18n";

export default function RecentProjects({ projects = [] }) {
  const { t } = useLang();

  return (
    <section className="bg-mist py-16 lg:py-24">
      <div className="container-x">
        <SectionIntro
          title={t("home.projects.title")}
          body={t("home.projects.body")}
          action={
            <Link
              to="/projects"
              className="btn-lift inline-flex h-11 items-center border border-ink px-5 font-body text-[0.88rem] font-semibold text-ink hover:bg-ink hover:text-paper"
            >
              {t("cta.viewAll")}
            </Link>
          }
        />

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.id || project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}