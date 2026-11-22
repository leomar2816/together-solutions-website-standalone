import { useLang } from "@/lib/i18n";

export default function LangToggle({ tone = "dark", className = "" }) {
  const { lang, setLang } = useLang();
  const active = tone === "dark" ? "bg-paper text-ink" : "bg-ink text-paper";
  const idle = tone === "dark" ? "text-paper/60 hover:text-paper" : "text-graphite/70 hover:text-ink";
  const border = tone === "dark" ? "border-paper/30" : "border-ink/25";

  return (
    <div className={`inline-flex items-center border ${border} ${className}`}>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`px-2.5 py-1 font-body text-[11px] font-semibold tracking-[0.12em] transition-colors ${
          lang === "en" ? active : idle
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("ar")}
        aria-pressed={lang === "ar"}
        className={`px-2.5 py-1 font-body text-[13px] font-semibold leading-none transition-colors ${
          lang === "ar" ? active : idle
        }`}
      >
        ع
      </button>
    </div>
  );
}