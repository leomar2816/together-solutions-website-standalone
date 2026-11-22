import DivisionLink from "@/components/site/DivisionLink";
import { useDivisions } from "@/lib/site-content";
import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import Logo from "@/components/site/Logo";
import LangToggle from "@/components/site/LangToggle";
import { useLang } from "@/lib/i18n";
import { NAV_LINKS } from "@/lib/content";

const isActive = (pathname, to) => pathname === to || pathname.startsWith(`${to}/`);

export default function SiteHeader() {
  const { t, pick } = useLang();
  const divisions = useDivisions();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [divisionsOpen, setDivisionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const divisionsRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDivisionsOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!divisionsOpen) return;
    const onPointerDown = (event) => {
      if (divisionsRef.current && !divisionsRef.current.contains(event.target)) setDivisionsOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setDivisionsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [divisionsOpen]);

  const solid = scrolled || divisionsOpen || mobileOpen;
  const tone = solid ? "text-paper" : "text-ink";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        mobileOpen
          ? "bg-ink"
          : solid
            ? "bg-ink/95 shadow-[0_12px_32px_-20px_rgba(16,24,32,0.7)] backdrop-blur supports-[backdrop-filter]:bg-ink/90"
            : "bg-transparent"
      } ${tone}`}
    >
      <div className="container-x flex h-[68px] items-center justify-between gap-6 lg:h-[76px]">
        <Link to="/" aria-label="Together Solutions, home" className="shrink-0">
          <Logo inverted={solid} className="h-8 w-auto sm:h-9 lg:h-10" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          <div className="relative" ref={divisionsRef}>
            <button
              type="button"
              onClick={() => setDivisionsOpen((open) => !open)}
              aria-expanded={divisionsOpen}
              aria-haspopup="true"
              className="nav-underline inline-flex items-center gap-1.5 py-2 font-body text-[0.95rem] font-medium"
            >
              {t("nav.divisions")}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${divisionsOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {divisionsOpen && (
              <div className="menu-enter absolute start-0 top-full mt-2 w-[350px] border border-paper/15 bg-ink p-2 text-paper shadow-[0_24px_48px_-24px_rgba(16,24,32,0.8)]">
                {divisions.map((division) => (
                  <DivisionLink
                    key={division.slug}
                    division={division}
                    className="group flex items-center gap-3 px-3 py-2.5 transition-colors duration-150 hover:bg-paper/10 focus-visible:bg-paper/10"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 transition-transform duration-200 group-hover:scale-125"
                      style={{ backgroundColor: division.color }}
                      aria-hidden="true"
                    />
                    <span className="flex-1 font-body text-[0.95rem]">{pick(division.name)}</span>
                    <span className="font-body text-[9px] tracking-[0.2em] text-paper/40">
                      {division.tag}
                    </span>
                  </DivisionLink>
                ))}
              </div>
            )}
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="nav-underline py-2 font-body text-[0.95rem] font-medium"
            >
              {t(link.label)}
              {isActive(pathname, link.to) && (
                <span
                  className={`absolute inset-x-0 bottom-0 h-[3px] ${solid ? "bg-paper" : "bg-ink"}`}
                  aria-hidden="true"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LangToggle tone={solid ? "dark" : "light"} />
          <Link
            to="/contact"
            className="btn-lift inline-flex h-11 items-center bg-signal px-5 font-body text-[0.9rem] font-semibold text-ink hover:bg-paper"
          >
            {t("nav.contact")}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="-me-1 inline-flex h-11 w-11 items-center justify-center lg:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="menu-enter max-h-[calc(100svh-68px)] overflow-y-auto border-t border-paper/10 bg-ink pb-8 lg:hidden">
          <div className="container-x flex flex-col pt-4">
            <p className="py-2 font-body text-[11px] tracking-[0.2em] text-paper/40">
              {t("nav.divisions")}
            </p>
            {divisions.map((division) => (
              <DivisionLink
                key={division.slug}
                division={division}
                className="flex items-center gap-3 border-b border-paper/10 py-3"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0"
                  style={{ backgroundColor: division.color }}
                  aria-hidden="true"
                />
                <span className="flex-1 font-body text-[1rem] text-paper">{pick(division.name)}</span>
              </DivisionLink>
            ))}

            <div className="mt-6 flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="border-b border-paper/10 py-3 font-body text-[1rem] text-paper"
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <LangToggle tone="dark" />
              <Link
                to="/contact"
                className="inline-flex h-12 items-center bg-signal px-6 font-body text-[0.95rem] font-semibold text-ink"
              >
                {t("nav.contact")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}