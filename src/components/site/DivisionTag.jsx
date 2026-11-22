import { getDivision } from "@/lib/divisions";

export default function DivisionTag({ slug, outline = false, className = "" }) {
  const division = getDivision(slug);
  if (!division) return null;

  return (
    <span
      className={`inline-block font-body text-[10px] font-semibold leading-none tracking-[0.2em] ${className}`}
      style={
        outline
          ? { color: division.color, border: `1px solid ${division.color}`, padding: "3px 7px" }
          : { backgroundColor: division.color, color: "#FFFFFF", padding: "4px 7px" }
      }
    >
      {division.tag}
    </span>
  );
}