import { media } from "@/lib/media";

/**
 * The official Together Solutions wordmark (black SVG).
 * `inverted` renders it white for Ink Navy surfaces.
 */
export default function Logo({ inverted = false, className = "" }) {
  return (
    <img
      src={media.logo}
      alt="Together Solutions"
      width={1048}
      height={276}
      decoding="async"
      className={className}
      style={inverted ? { filter: "brightness(0) invert(1)" } : undefined}
    />
  );
}