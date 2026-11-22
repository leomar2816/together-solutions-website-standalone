import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Restrained scroll-entrance effect for the whole site, with no animation library.
 *
 * - Targets the blocks inside each <section>'s .container-x; grids reveal their items
 *   with a short stagger.
 * - Only content that starts below the fold is hidden (by adding .rv in JS after
 *   hydration), so server-rendered pages never flash blank and above-the-fold
 *   content is never delayed.
 * - Does nothing when the visitor prefers reduced motion or IntersectionObserver is missing.
 * - Mark any element with data-no-reveal to opt it (and its subtree) out.
 */
const STAGGER_MS = 70;
const MAX_STAGGER = 6;

function collectTargets(root) {
  const targets = [];
  root.querySelectorAll("section .container-x > *").forEach((block) => {
    if (block.closest("[data-no-reveal]")) return;
    const isGrid = /\bgrid\b/.test(block.className || "") && block.children.length > 1;
    if (isGrid) {
      Array.from(block.children).forEach((child, index) => targets.push([child, index]));
    } else {
      targets.push([block, 0]);
    }
  });
  return targets;
}

export default function RevealManager() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (!("IntersectionObserver" in window)) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const main = document.getElementById("main");
    if (!main) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          observer.unobserve(el);
          el.classList.add("rv-in");
          const cleanup = () => {
            el.classList.remove("rv", "rv-in");
            el.style.removeProperty("--rv-delay");
          };
          el.addEventListener("transitionend", cleanup, { once: true });
          window.setTimeout(cleanup, 1400);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const scan = () => {
      const fold = window.innerHeight * 0.92;
      collectTargets(main).forEach(([el, index]) => {
        if (el.dataset.rvSeen) return;
        el.dataset.rvSeen = "1";
        if (el.getBoundingClientRect().top < fold) return; // already on screen: leave as is
        el.style.setProperty("--rv-delay", `${Math.min(index, MAX_STAGGER) * STAGGER_MS}ms`);
        el.classList.add("rv");
        observer.observe(el);
      });
    };

    // setTimeout rather than requestAnimationFrame: rAF is paused in background tabs,
    // which would leave late-loading content unscanned.
    let timer = 0;
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(scan, 50);
    };

    schedule();
    const mutations = new MutationObserver(schedule);
    mutations.observe(main, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(timer);
      mutations.disconnect();
      observer.disconnect();
      main.querySelectorAll(".rv").forEach((el) => el.classList.remove("rv", "rv-in"));
    };
  }, [pathname]);

  return null;
}
