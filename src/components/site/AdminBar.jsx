import { Link, useRouterState } from "@tanstack/react-router";
import { Eye, Settings2 } from "lucide-react";

/**
 * A small floating bar shown only to verified admins on the public pages: a way into
 * the content manager, and a reminder when maintenance mode or a draft preview is on.
 */
export default function AdminBar({ maintenance, previewing }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[70] flex justify-center px-3 sm:bottom-4 sm:justify-start sm:px-4">
      <div
        role="region"
        aria-label="Admin tools"
        className="menu-enter pointer-events-auto flex max-w-full flex-wrap items-center gap-x-3 gap-y-1.5 bg-ink px-3 py-2 font-body text-[0.8rem] text-paper shadow-[0_18px_40px_-18px_rgba(16,24,32,0.8)]"
      >
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 font-semibold text-paper transition-opacity hover:opacity-80"
        >
          <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
          Content manager
        </Link>
        {maintenance && (
          <span className="inline-flex items-center gap-1.5 bg-signal px-2 py-0.5 text-[0.75rem] font-semibold text-ink">
            Maintenance on: visitors see the maintenance page
          </span>
        )}
        {previewing && (
          <>
            <span className="inline-flex items-center gap-1.5 text-paper/80">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              Previewing unpublished changes
            </span>
            <a href={pathname} className="font-semibold text-paper underline decoration-paper/40 underline-offset-4">
              Exit preview
            </a>
          </>
        )}
      </div>
    </div>
  );
}
