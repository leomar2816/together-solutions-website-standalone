import { useEffect, useRef, useState } from "react";

/**
 * Parse a display value such as "1,000+", "1M+", "70%", "3" or "2010" into the
 * number to count to and a formatter that reproduces the original formatting.
 */
export function parseStat(value) {
  const match = String(value).match(/^([^\d]*)([\d,.]+)\s*([KMB]?)(.*)$/i);
  if (!match) return null;
  const [, prefix, digits, unit, suffix] = match;
  const base = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(base)) return null;
  const grouped = digits.includes(",");
  const scale = { K: 1e3, M: 1e6, B: 1e9 }[unit.toUpperCase()] || 1;
  const target = base * scale;

  const format = (n) => {
    if (n >= target) return value; // always land exactly on the displayed value
    let body;
    if (scale > 1) {
      // Count through compact units so "1M+" runs 0 → 999K → 1M+ without a jump.
      if (n >= 1e6) body = `${Math.floor(n / 1e5) / 10}M`;
      else if (n >= 1e3) body = `${Math.floor(n / 1e3)}K`;
      else body = String(Math.floor(n));
    } else {
      const whole = Math.floor(n);
      body = grouped ? whole.toLocaleString("en-US") : String(whole);
    }
    return `${prefix}${body}${unit && scale === 1 ? unit : ""}${suffix}`;
  };

  return { target, format };
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Counts from zero to `value` once `start` becomes true. The final value is rendered
 * on the server and for reduced-motion visitors; screen readers always get the final
 * value. A hidden copy of the final value reserves the width, so nothing shifts.
 */
export default function CountUp({ value, start, duration = 1600, className = "" }) {
  const parsed = parseStat(value);
  const [display, setDisplay] = useState(value);
  const done = useRef(false);
  const prepared = useRef(false);

  // On mount (client only): drop to zero if we are going to animate.
  useEffect(() => {
    if (!parsed || prepared.current) return;
    prepared.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || document.visibilityState === "hidden") {
      done.current = true;
      return;
    }
    setDisplay(parsed.format(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!start || done.current || !parsed) return undefined;

    let raf = 0;
    let fallback = 0;
    const began = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - began) / duration);
      setDisplay(parsed.format(parsed.target * easeOutCubic(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else done.current = true;
    };
    raf = requestAnimationFrame(tick);
    // If frames are paused (background tab), still end on the real value.
    fallback = window.setTimeout(() => {
      done.current = true;
      setDisplay(value);
    }, duration + 400);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  return (
    <span className={`relative inline-grid ${className}`}>
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {value}
      </span>
      <span className="col-start-1 row-start-1 tabular-nums" aria-hidden="true">
        {display}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
