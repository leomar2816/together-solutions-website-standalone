import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import RevealManager from "@/components/site/RevealManager";
import { useLang } from "@/lib/i18n";

export default function SiteLayout({ children }) {
  const { lang } = useLang();

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60] focus:bg-signal focus:px-4 focus:py-2 focus:font-body focus:text-sm focus:font-semibold focus:text-ink"
      >
        {lang === "ar" ? "تجاوز إلى المحتوى" : "Skip to content"}
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <RevealManager />
    </div>
  );
}