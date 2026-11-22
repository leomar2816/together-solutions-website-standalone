import { useEffect, useState } from "react";

const CYCLE = [
  { label: "SPORTS", bg: "#CF1F2C", fg: "#FFFFFF" },
  { label: "GREEN", bg: "#00B373", fg: "#FFFFFF" },
  { label: "CAMP", bg: "#835E32", fg: "#FFFFFF" },
  { label: "GLOBAL", bg: "#187295", fg: "#FFFFFF" },
  { label: "REAL ESTATE", bg: "#75797C", fg: "#FFFFFF" },
];

const SIZES = {
  sm: { text: "text-[1.35rem]", tag: "text-[8px] px-1.5 py-[2px]", gap: "mt-1" },
  md: { text: "text-[2rem]", tag: "text-[9px] px-2 py-[3px]", gap: "mt-1.5" },
  lg: { text: "text-[2.6rem] sm:text-[3.2rem]", tag: "text-[10px] px-2.5 py-1", gap: "mt-2" },
  xl: { text: "text-[2.6rem] sm:text-[3.2rem] lg:text-[3.6rem]", tag: "text-[10px] px-3 py-1", gap: "mt-2.5" },
};

/**
 * The Together wordmark: black "Together" with a solid coloured division tag beneath it.
 * `animated` cycles the tag through the five coloured divisions once and settles on the
 * wordmark's own tag (white on dark panels). Disabled by prefers-reduced-motion.
 */
export default function Wordmark({
  tag = "SOLUTIONS",
  tagColor,
  size = "md",
  onDark = false,
  animated = false,
  className = "",
}) {
  const scale = SIZES[size] || SIZES.md;
  const finalBg = onDark ? "#FFFFFF" : tagColor || "#101820";
  const finalFg = onDark ? "#101820" : "#FFFFFF";
  const steps = [...CYCLE, { label: tag, bg: finalBg, fg: finalFg }];

  const [step, setStep] = useState(steps.length - 1);

  useEffect(() => {
    if (!animated) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let index = 0;
    setStep(0);
    const timer = window.setInterval(() => {
      index += 1;
      if (index >= steps.length - 1) {
        window.clearInterval(timer);
        setStep(steps.length - 1);
      } else {
        setStep(index);
      }
    }, 150);

    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated]);

  const current = steps[step];

  return (
    <span dir="ltr" className={`inline-flex flex-col items-start ${className}`}>
      <span className={`font-heading font-extrabold leading-[0.92] tracking-[-0.03em] ${scale.text}`}>
        Together
      </span>
      <span
        className={`inline-block font-body font-semibold leading-none tracking-[0.22em] ${scale.gap} ${scale.tag}`}
        style={{ backgroundColor: current.bg, color: current.fg }}
      >
        {current.label}
      </span>
    </span>
  );
}