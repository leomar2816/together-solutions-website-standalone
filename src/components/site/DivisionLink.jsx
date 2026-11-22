import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useLang } from "@/lib/i18n";

/**
 * Links to a division: its own page on this site, or, for a division with an
 * `externalUrl` (Together Global), its separate website in a new tab.
 */
export default function DivisionLink({ division, children, showIcon = true, "aria-label": ariaLabel, ...props }) {
  const { lang } = useLang();

  if (division.externalUrl) {
    const note = lang === "ar" ? "(يفتح في نافذة جديدة)" : "(opens in a new tab)";
    return (
      <a
        href={division.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel ? `${ariaLabel} ${note}` : undefined}
        {...props}
      >
        {children}
        {showIcon && <ExternalLink className="ms-1 inline-block h-3.5 w-3.5 shrink-0 align-[-2px] opacity-60" aria-hidden="true" />}
        {!ariaLabel && <span className="sr-only"> {note}</span>}
      </a>
    );
  }

  return (
    <Link to="/divisions/$division" params={{ division: division.slug }} aria-label={ariaLabel} {...props}>
      {children}
    </Link>
  );
}
