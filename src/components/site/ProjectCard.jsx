import DivisionTag from "@/components/site/DivisionTag";
import { getDivision } from "@/lib/divisions";
import { useLang } from "@/lib/i18n";

/**
 * A project in the record. The name is shown in both languages, as in the company
 * profile: the page language's name as the heading, the other beneath it. Summary and
 * client follow the page language, falling back to English when no Arabic is set.
 */
export default function ProjectCard({ project }) {
  const { isAr } = useLang();
  const division = getDivision(project.division);
  const cover = project.images?.[0];

  const titleEn = project.title;
  const titleAr = project.title_ar;
  const primary = isAr && titleAr ? titleAr : titleEn;
  const secondary = isAr ? (titleAr ? titleEn : null) : titleAr;
  const summary = (isAr && project.summary_ar) || project.summary;
  const client = (isAr && project.client_ar) || project.client;

  return (
    <article className="flex h-full flex-col">
      {cover && (
        <div className="relative mb-4 aspect-[4/3] overflow-hidden bg-mist">
          <img
            src={cover}
            alt={primary}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      )}
      <div
        className="flex flex-1 flex-col border-t-2 pt-4"
        style={{ borderTopColor: division.color }}
      >
      <div className="flex flex-wrap items-center gap-3">
        <DivisionTag slug={project.division} />
        <span className="font-body text-xs font-medium tracking-[0.06em] text-graphite">
          <bdi dir="ltr">{project.year_label || project.year}</bdi>
        </span>
      </div>
      <h3 className="mt-4 font-heading text-[1.15rem] font-bold leading-snug text-ink" lang={isAr && titleAr ? "ar" : "en"}>
        {primary}
      </h3>
      {secondary && (
        <p className="mt-1 font-body text-[0.88rem] font-medium leading-snug text-graphite/75" lang={isAr ? "en" : "ar"}>
          <bdi dir={isAr ? "ltr" : "rtl"}>{secondary}</bdi>
        </p>
      )}
      {summary && (
        <p className="mt-2.5 text-[0.92rem] leading-relaxed text-graphite">{summary}</p>
      )}
      {client && (
        <p className="mt-auto pt-4 font-body text-[0.85rem] font-semibold text-ink/80">
          <bdi>{client}</bdi>
        </p>
      )}
      </div>
    </article>
  );
}
