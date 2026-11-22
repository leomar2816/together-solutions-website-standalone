import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Image } from "@/components/ui/image";
import { buildTransformUrl, parseWixMediaUrl } from "@/components/ui/image-helpers";

const INTERVAL_MS = 7000; // time each image stays on screen
const FADE_MS = 1800; // slow crossfade

// Widths offered for the first image. The hero is full width on phones and 64% of the
// screen on large displays.
const HERO_WIDTHS = [480, 768, 1024, 1440, 1920];
const HERO_SIZES = "(min-width: 1024px) 64vw, 100vw";

/** srcset for the first slide, built on the server so the browser finds it in the HTML. */
function heroSources(src) {
  const parsed = src ? parseWixMediaUrl(src) : null;
  if (!parsed) return { src };
  const url = (width) =>
    buildTransformUrl(parsed, { width, height: width * 2, crop: false, quality: 82 });
  return {
    src: url(1024),
    srcSet: HERO_WIDTHS.map((width) => `${url(width)} ${width}w`).join(", "),
    sizes: HERO_SIZES,
  };
}

/**
 * The first slide is the page's largest element (LCP), so it is a plain <img> in the
 * server HTML: loaded eagerly, at high priority, with no blur-up placeholder in front.
 */
function FirstSlideImage({ slide, onLoad }) {
  const sources = heroSources(slide.src);
  return (
    <img
      {...sources}
      alt={slide.alt}
      loading="eager"
      fetchPriority="high"
      decoding="async"
      onLoad={onLoad}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

/**
 * Background images for the hero, crossfading slowly from one to the next.
 * - The next image is preloaded before it fades in, so a half-loaded photo never shows.
 * - Rotation pauses while the tab is hidden and can be paused by the visitor.
 * - With prefers-reduced-motion, only the first image is shown and nothing rotates.
 */
export default function HeroSlideshow({ slides, pauseLabel, playLabel }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [canRotate, setCanRotate] = useState(false);
  const [mountRest, setMountRest] = useState(false);
  const loaded = useRef(new Set([0]));

  useEffect(() => {
    if (slides.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCanRotate(!reduce.matches);
    update();
    reduce.addEventListener?.("change", update);
    return () => reduce.removeEventListener?.("change", update);
  }, [slides.length]);

  // Mount the other slides (invisible) once the first has had a chance to paint, so
  // they load in the background at the size the page needs.
  useEffect(() => {
    if (!canRotate) return undefined;
    const timer = window.setTimeout(() => setMountRest(true), 1200);
    return () => window.clearTimeout(timer);
  }, [canRotate]);

  useEffect(() => {
    if (!canRotate || paused) return undefined;
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (document.visibilityState === "visible") {
          setActive((current) => {
            const next = (current + 1) % slides.length;
            return loaded.current.has(next) ? next : current;
          });
        }
        schedule();
      }, INTERVAL_MS);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [canRotate, paused, slides.length]);

  return (
    <>
      {slides.map((slide, index) => {
        const isActive = index === active;
        return (
          <div
            key={slide.src}
            className={`absolute inset-0 ${index === 0 ? "hero-photo" : ""}`}
            style={{
              opacity: isActive ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
              zIndex: isActive ? 1 : 0,
            }}
            aria-hidden={isActive ? undefined : true}
          >
            {/* Only the first slide renders on the server; the rest mount once rotation is on. */}
            {index === 0 && <FirstSlideImage slide={slide} onLoad={() => loaded.current.add(0)} />}
            {index > 0 && mountRest && (
              <Image
                src={slide.src}
                alt={slide.alt}
                className="h-full w-full"
                fittingType="fill"
                onLoad={() => loaded.current.add(index)}
              />
            )}
          </div>
        );
      })}

      {canRotate && (
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          aria-label={pauseLabel}
          title={paused ? playLabel : pauseLabel}
          className="absolute bottom-[60px] end-3 z-10 inline-flex sm:bottom-[76px] h-9 w-9 items-center justify-center bg-ink/55 text-paper backdrop-blur-sm transition-colors duration-200 hover:bg-ink/80 focus-visible:bg-ink/80 lg:bottom-5 lg:end-5"
        >
          {paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
        </button>
      )}
    </>
  );
}
