export default function SectionIntro({ title, body, action, className = "" }) {
  return (
    <div className={`border-t border-ink/15 pt-8 ${className}`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="max-w-[22ch] font-heading text-[1.85rem] font-extrabold leading-[1.06] text-ink sm:text-[2.35rem] lg:text-[2.9rem]">
            {title}
          </h2>
          {body && <p className="measure mt-5 text-[1.02rem] leading-relaxed text-graphite">{body}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}