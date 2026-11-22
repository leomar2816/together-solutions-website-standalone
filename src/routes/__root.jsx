import { HeadContent, Outlet, Scripts, createRootRoute, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { LanguageProvider } from "@/lib/i18n";
import { SiteContentProvider } from "@/lib/site-content";
import { getAdminAccess, getDraftForPreview, getPublicSiteState, getPublishedForAdmin } from "@/lib/site-api";
import SiteLayout from "@/components/site/SiteLayout";
import MaintenancePage from "@/components/site/MaintenancePage";
import AdminBar from "@/components/site/AdminBar";
import appCss from "@/index.css?url";

// Whether maintenance mode is on, and the published content. During maintenance the API
// returns no site content, only the maintenance page's wording. A browser query, not a route
// loader: the static HTML shell is prerendered at build time, when there is no API to ask.
export const siteStateQuery = {
  queryKey: ["site-state"],
  queryFn: () => getPublicSiteState().catch(() => ({ maintenance: false, content: {} })),
  enabled: typeof window !== "undefined",
  staleTime: 30_000,
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Together — progressing together toward a better future" },
      {
        name: "description",
        content:
          "Together is a Riyadh-based multi-sector group working across communications, sport, real estate, agriculture, camps and international trade since 2010.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootComponent() {
  return (
    <AuthProvider>
      <SiteShell />
      <Toaster />
    </AuthProvider>
  );
}

const isAdminPath = (pathname) => pathname === "/admin" || pathname.startsWith("/admin/");

function SiteShell() {
  // shortcut: until the state arrives (one small request) the default site shows, so a
  // maintenance page appears a moment after first paint; inject the state into index.html via PHP if that matters.
  const state = useQuery(siteStateQuery).data ?? { maintenance: false, content: {} };
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const wantsPreview = useRouterState({ select: (s) => s.location.search?.preview === "draft" });
  const { isAuthenticated } = useAuth();

  // Admin status always comes from the server, which verifies the visitor's token.
  const access = useQuery({
    queryKey: ["admin-access"],
    queryFn: () => getAdminAccess(),
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  });
  const isAdmin = Boolean(access.data?.isAdmin);

  // While maintenance hides the site, an admin receives the published content only
  // from an admin-only server function. Drafts likewise reach only verified admins.
  const adminPublished = useQuery({
    queryKey: ["admin-published"],
    queryFn: () => getPublishedForAdmin(),
    enabled: isAdmin && state.maintenance && !wantsPreview,
    staleTime: 30_000,
  });
  const draft = useQuery({
    queryKey: ["draft-preview"],
    queryFn: () => getDraftForPreview(),
    enabled: isAdmin && wantsPreview,
    staleTime: 0,
  });

  let overrides = state.content ?? {};
  const previewing = isAdmin && wantsPreview && Boolean(draft.data);
  if (previewing) overrides = draft.data.content;
  else if (isAdmin && state.maintenance && adminPublished.data) overrides = adminPublished.data.content;

  const siteUnlocked = !state.maintenance || previewing || Boolean(isAdmin && adminPublished.data);
  // Only a signed-in visitor waits on the access check; everyone else sees the sign-in link.
  const checking = state.maintenance && isAuthenticated && (access.isPending || (isAdmin && !siteUnlocked));

  let body;
  if (isAdminPath(pathname)) body = <Outlet />;
  else if (siteUnlocked)
    body = (
      <SiteLayout>
        <Outlet />
      </SiteLayout>
    );
  else body = <MaintenancePage checking={checking} noAccess={isAuthenticated && access.data && !isAdmin} />;

  return (
    <SiteContentProvider overrides={overrides}>
      {state.maintenance && <meta name="robots" content="noindex" />}
      <LanguageProvider>
        {body}
        {isAdmin && !isAdminPath(pathname) && siteUnlocked && (
          <AdminBar maintenance={state.maintenance} previewing={previewing} />
        )}
      </LanguageProvider>
    </SiteContentProvider>
  );
}

function RootDocument({ children }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body data-react-root="true">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
