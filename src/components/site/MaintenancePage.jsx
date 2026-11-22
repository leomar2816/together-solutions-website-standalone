import Wordmark from "@/components/site/Wordmark";
import LangToggle from "@/components/site/LangToggle";
import { Image } from "@/components/ui/image";
import { useAuth } from "@/lib/AuthContext";
import { useLang } from "@/lib/i18n";
import { media } from "@/lib/media";

/**
 * Shown to everyone who is not a verified admin while maintenance mode is on.
 * It deliberately carries no email address, phone number or contact links.
 * The only action is a staff sign-in; access is decided on the server afterwards.
 */
export default function MaintenancePage({ checking = false, noAccess = false }) {
  const { t } = useLang();
  const { isAuthenticated, navigateToLogin, logout } = useAuth();

  return (
    <main className="relative flex min-h-[100svh] flex-col bg-paper lg:flex-row-reverse">
      <div className="relative h-[34svh] w-full overflow-hidden lg:h-auto lg:w-[58%]">
        <div className="hero-photo absolute inset-0">
          <Image
            src={media.hero}
            alt=""
            className="h-full w-full"
            fittingType="fill"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent lg:bg-gradient-to-r lg:from-ink/15 rtl:lg:bg-gradient-to-l"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 -mt-10 flex flex-1 items-start px-5 lg:items-center pb-10 sm:px-8 lg:mt-0 lg:px-12 lg:py-16">
        <div className="hero-panel relative w-full max-w-[600px] bg-ink p-7 text-paper shadow-[0_40px_80px_-36px_rgba(16,24,32,0.65)] sm:p-10 lg:-me-24 lg:p-12">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_100%_0%,rgba(15,40,55,0.9)_0%,transparent_65%)]"
            aria-hidden="true"
          />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <Wordmark size="lg" tag="SOLUTIONS" onDark />
              <LangToggle tone="dark" />
            </div>

            <h1 className="mt-9 max-w-[18ch] font-heading text-[2rem] font-extrabold leading-[1.05] text-paper sm:text-[2.5rem]">
              {t("maintenance.title")}
            </h1>
            <p className="mt-5 max-w-[46ch] text-[1rem] leading-relaxed text-paper/75">{t("maintenance.body")}</p>

            <div className="mt-9 border-t border-paper/15 pt-6" aria-live="polite">
              {checking ? (
                <p className="font-body text-[0.85rem] text-paper/60">{t("maintenance.checking")}</p>
              ) : noAccess || isAuthenticated ? (
                <div className="flex flex-wrap items-center gap-4">
                  <p className="font-body text-[0.85rem] text-paper/60">{t("maintenance.noAccess")}</p>
                  <button
                    type="button"
                    onClick={logout}
                    className="font-body text-[0.85rem] font-semibold text-paper underline decoration-paper/30 underline-offset-4 transition-colors hover:decoration-paper"
                  >
                    {t("maintenance.signout")}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={navigateToLogin}
                  className="font-body text-[0.85rem] font-semibold text-paper/70 underline decoration-paper/25 underline-offset-4 transition-colors hover:text-paper hover:decoration-paper"
                >
                  {t("maintenance.signin")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
