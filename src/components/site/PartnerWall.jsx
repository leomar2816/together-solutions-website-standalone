import { useSiteContent } from "@/lib/site-content";

// Every logo gets roughly the same visual area, so wide wordmarks and square
// emblems read with similar weight. Sizes are in CSS pixels; the files are 2x.
const TARGET_AREA = 6800;
const MAX_W = 172;
const MAX_H = 70;

function logoSize(ratio) {
  let height = Math.sqrt(TARGET_AREA / ratio);
  let width = height * ratio;
  if (width > MAX_W) {
    width = MAX_W;
    height = width / ratio;
  }
  if (height > MAX_H) {
    height = MAX_H;
    width = height * ratio;
  }
  return { width: Math.round(width), height: Math.round(height) };
}

export default function PartnerWall({ title, body, note, action }) {
  const { partners } = useSiteContent();
  return (
    <div>
      <div className="flex flex-col gap-6 border-t border-ink/15 pt-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="max-w-[22ch] font-heading text-[1.85rem] font-extrabold leading-[1.06] text-ink sm:text-[2.35rem]">
            {title}
          </h2>
          {body && <p className="measure mt-5 text-[1.02rem] leading-relaxed text-graphite">{body}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <ul className="mt-10 grid grid-cols-2 border-s border-t border-ink/10 bg-paper sm:grid-cols-3 lg:grid-cols-4">
        {partners.map((partner) => {
          const size = partner.logo ? logoSize(partner.ratio || 2) : null;
          return (
            <li
              key={partner.name}
              className="flex min-h-[104px] items-center justify-center border-b border-e border-ink/10 px-4 py-5 sm:min-h-[116px]"
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  width={size.width}
                  height={size.height}
                  loading="lazy"
                  decoding="async"
                  className="h-auto max-w-full object-contain"
                  style={{ width: size.width, maxHeight: size.height }}
                />
              ) : (
                <span className="w-full font-heading text-[0.95rem] font-semibold leading-tight text-graphite/85">
                  {partner.name}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {note && <p className="mt-5 font-body text-xs text-graphite/60">{note}</p>}
    </div>
  );
}
