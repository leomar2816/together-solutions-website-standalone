import ProjectCard from "@/components/site/ProjectCard";

export default function ProjectTimeline({ groups }) {
  return (
    <div className="mt-14 border-s border-ink/15 ps-5 sm:ps-8 lg:ps-12">
      {groups.map(([year, items]) => (
        <section key={year} className="relative pb-14 last:pb-0">
          <div className="-ms-5 mb-7 flex items-baseline gap-4 sm:-ms-8 lg:-ms-12">
            <h2 className="font-heading text-[2.4rem] font-extrabold leading-none tracking-[-0.04em] text-ink/40 lg:text-[3rem]">
              {year}
            </h2>
            <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
            <span className="font-body text-xs text-graphite">{items.length}</span>
          </div>

          <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}