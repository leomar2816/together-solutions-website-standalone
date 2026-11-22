import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Contact,
  Eye,
  FileText,
  Handshake,
  Home,
  LayoutDashboard,
  Loader2,
  LogOut,
  ShieldAlert,
  Undo2,
  Users,
  Wrench,
  Briefcase,
  Info,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import { resolveContent } from "@/lib/site-content";
import {
  discardDraft,
  getManagerState,
  publishContent,
  saveDraft,
  setMaintenance,
} from "@/lib/site-api";
import Logo from "@/components/site/Logo";
import { Panel, btn } from "@/components/admin/fields";
import {
  AboutSection,
  ContactSection,
  DivisionsSection,
  HomeSection,
  LeadershipSection,
  PartnersSection,
  TextSection,
  contactValid,
} from "@/components/admin/sections";
import ProjectsManager from "@/components/admin/ProjectsManager";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "text", label: "Page text", icon: FileText },
  { id: "home", label: "Home: hero and statistics", icon: Home },
  { id: "divisions", label: "Divisions", icon: Building2 },
  { id: "about", label: "About", icon: Info },
  { id: "leadership", label: "Leadership", icon: Users },
  { id: "partners", label: "Partners", icon: Handshake },
  { id: "contact", label: "Contact details", icon: Contact },
  { id: "projects", label: "Projects", icon: Briefcase, live: true },
  { id: "maintenance", label: "Maintenance mode", icon: Wrench },
];

const formatDate = (value) => {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Riyadh",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

export default function AdminApp() {
  const [state, setState] = useState({ status: "loading" });
  const [draft, setDraft] = useState({});
  const [savedJson, setSavedJson] = useState("{}");
  const [publishedJson, setPublishedJson] = useState("{}");
  const [section, setSection] = useState("overview");
  const [busy, setBusy] = useState(null);
  const [confirmMaintenance, setConfirmMaintenance] = useState(null);
  const { user, logout, isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();
  const queryClient = useQueryClient();

  const load = useCallback(async () => {
    try {
      const data = await getManagerState();
      setDraft(data.draft || {});
      setSavedJson(JSON.stringify(data.draft || {}));
      setPublishedJson(JSON.stringify(data.published || {}));
      setState({ status: "ready", ...data });
    } catch (error) {
      const forbidden = error?.status === 403 || /forbidden/i.test(error?.message || "");
      setState({ status: forbidden ? "forbidden" : "error" });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated, load]);

  const draftJson = JSON.stringify(draft);
  const dirty = draftJson !== savedJson;
  const unpublished = draftJson !== publishedJson;
  const resolved = useMemo(() => resolveContent(draft), [draft]);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const setOverride = useCallback((key, value) => {
    setDraft((current) => {
      const next = { ...current };
      if (value === undefined) delete next[key];
      else next[key] = value;
      return next;
    });
  }, []);

  const validate = () => {
    if (!contactValid(resolved)) {
      toast.error("Check the contact email address before saving.");
      setSection("contact");
      return false;
    }
    return true;
  };

  const doSave = async ({ quiet = false } = {}) => {
    if (!validate()) return false;
    setBusy("save");
    try {
      await saveDraft({ data: { content: draft } });
      setSavedJson(draftJson);
      queryClient.removeQueries({ queryKey: ["draft-preview"] });
      if (!quiet) toast.success("Draft saved. Visitors won't see it until you publish.");
      return true;
    } catch {
      toast.error("The draft could not be saved. Check your connection and try again.");
      return false;
    } finally {
      setBusy(null);
    }
  };

  const doPreview = async () => {
    const tab = window.open("about:blank", "_blank");
    const ok = dirty ? await doSave({ quiet: true }) : true;
    if (!ok) {
      tab?.close();
      return;
    }
    if (tab) tab.location.href = "/?preview=draft";
    else window.location.href = "/?preview=draft";
    toast.success("Preview opened in a new tab. Only signed-in admins can see it.");
  };

  const doPublish = async () => {
    if (!validate()) return;
    setBusy("publish");
    try {
      const result = await publishContent({ data: { content: draft } });
      setSavedJson(draftJson);
      setPublishedJson(draftJson);
      setState((s) => ({ ...s, publishedAt: result.publishedAt, publishedBy: user?.full_name || user?.email }));
      queryClient.removeQueries({ queryKey: ["admin-published"] });
      await queryClient.invalidateQueries({ queryKey: ["site-state"] });
      toast.success("Published. Your changes are now live on the website.");
    } catch {
      toast.error("Publishing failed. Your edits are still here; try again.");
    } finally {
      setBusy(null);
    }
  };

  const doDiscard = async () => {
    setBusy("discard");
    try {
      const result = await discardDraft();
      setDraft(result.content || {});
      setSavedJson(JSON.stringify(result.content || {}));
      toast.success("Unpublished changes discarded. The editor now matches the live site.");
    } catch {
      toast.error("The changes could not be discarded. Try again.");
    } finally {
      setBusy(null);
    }
  };

  const doMaintenance = async (enabled) => {
    setBusy("maintenance");
    try {
      await setMaintenance({ data: { enabled } });
      setState((s) => ({ ...s, maintenance: enabled, maintenanceBy: user?.full_name || user?.email }));
      queryClient.removeQueries({ queryKey: ["admin-published"] });
      await queryClient.invalidateQueries({ queryKey: ["site-state"] });
      toast.success(
        enabled
          ? "Maintenance mode is on. Visitors now see the maintenance page."
          : "Maintenance mode is off. The website is visible to everyone again.",
      );
    } catch {
      toast.error("Maintenance mode could not be changed. Try again.");
    } finally {
      setBusy(null);
      setConfirmMaintenance(null);
    }
  };

  if (!isLoadingAuth && !isAuthenticated) {
    return (
      <Shell>
        <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-start justify-center px-5">
          <Logo className="h-9 w-auto" />
          <h1 className="mt-8 font-heading text-[1.8rem] font-extrabold text-ink">Content manager</h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-graphite">
            Sign in with an admin account to edit the website and manage maintenance mode.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" className={btn.primary} onClick={navigateToLogin}>
              Sign in
            </button>
            <a href="/" className={btn.ghost}>
              Back to the website
            </a>
          </div>
        </div>
      </Shell>
    );
  }

  if (isLoadingAuth || state.status === "loading") {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center gap-2 text-graphite">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Loading the content manager
        </div>
      </Shell>
    );
  }

  if (state.status === "forbidden" || state.status === "error") {
    return (
      <Shell>
        <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-start justify-center px-5">
          <ShieldAlert className="h-8 w-8 text-ink" aria-hidden="true" />
          <h1 className="mt-4 font-heading text-[1.6rem] font-extrabold text-ink">
            {state.status === "forbidden" ? "You don't have access to the content manager" : "The content manager could not load"}
          </h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-graphite">
            {state.status === "forbidden"
              ? `You're signed in as ${user?.email ?? "a user"} without admin rights. Ask the site owner to give your account the admin role.`
              : "Check your connection and try again."}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {state.status === "error" && (
              <button type="button" className={btn.primary} onClick={load}>
                Try again
              </button>
            )}
            <a href="/" className={btn.ghost}>
              Go to the website
            </a>
            <button type="button" className={btn.ghost} onClick={logout}>
              Sign out
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  const status = dirty
    ? { text: "Unsaved changes", tone: "bg-signal text-ink" }
    : unpublished
      ? { text: "Draft saved, not published", tone: "bg-ink/10 text-ink" }
      : { text: "Everything is published", tone: "bg-div-green/15 text-ink" };

  const current = SECTIONS.find((s) => s.id === section);
  const sectionProps = { draft, resolved, setOverride };

  return (
    <Shell>
      {/* Toolbar */}
      <div className="sticky top-0 z-30 border-b border-ink/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" aria-label="Together Solutions website" className="shrink-0">
            <Logo className="h-7 w-auto" />
          </Link>
          <span className="hidden font-heading text-[0.95rem] font-bold text-ink sm:inline">Content manager</span>
          <span className={`px-2 py-1 font-body text-[0.75rem] font-semibold ${status.tone}`} role="status" aria-live="polite">
            {status.text}
          </span>
          {state.maintenance && (
            <button
              type="button"
              onClick={() => setSection("maintenance")}
              className="bg-signal px-2 py-1 font-body text-[0.75rem] font-semibold text-ink"
            >
              Maintenance on
            </button>
          )}
          <div className="ms-auto flex flex-wrap items-center gap-2">
            {unpublished && !dirty && (
              <button type="button" className={btn.ghost} onClick={doDiscard} disabled={Boolean(busy)} title="Return to the live content">
                {busy === "discard" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Undo2 className="h-4 w-4" aria-hidden="true" />}
                <span className="hidden md:inline">Discard draft</span>
              </button>
            )}
            <button type="button" className={btn.ghost} onClick={doPreview} disabled={Boolean(busy)}>
              <Eye className="h-4 w-4" aria-hidden="true" />
              Preview
            </button>
            <button type="button" className={btn.ghost} onClick={() => doSave()} disabled={Boolean(busy) || !dirty}>
              {busy === "save" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Save draft
            </button>
            <button type="button" className={btn.accent} onClick={doPublish} disabled={Boolean(busy) || !unpublished}>
              {busy === "publish" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Publish
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[250px_1fr] lg:py-8">
        {/* Section navigation: a list on desktop, a dropdown on mobile */}
        <nav aria-label="Content sections">
          <label className="block lg:hidden">
            <span className="sr-only">Section</span>
            <select
              value={section}
              onChange={(event) => setSection(event.target.value)}
              className="h-11 w-full border border-ink/20 bg-paper px-3 font-body text-[0.95rem] font-semibold text-ink"
            >
              {SECTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <ul className="hidden space-y-0.5 lg:block">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const active = s.id === section;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setSection(s.id)}
                    aria-current={active ? "page" : undefined}
                    className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-start font-body text-[0.88rem] transition-colors ${
                      active ? "bg-ink font-semibold text-paper" : "text-ink hover:bg-mist"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="flex-1">{s.label}</span>
                    {s.live && <span className={`text-[0.68rem] ${active ? "text-paper/70" : "text-graphite/70"}`}>live</span>}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 hidden border-t border-ink/10 pt-4 lg:block">
            <p className="truncate text-[0.78rem] text-graphite">Signed in as {user?.email}</p>
            <button
              type="button"
              onClick={logout}
              className="mt-2 inline-flex items-center gap-1.5 font-body text-[0.82rem] font-semibold text-ink hover:underline"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </nav>

        <main id="main" className="min-w-0 space-y-6" aria-label={current?.label}>
          {section === "overview" && (
            <Overview
              state={state}
              dirty={dirty}
              unpublished={unpublished}
              go={setSection}
              onPreview={doPreview}
            />
          )}
          {section === "text" && <TextSection {...sectionProps} />}
          {section === "home" && <HomeSection {...sectionProps} />}
          {section === "divisions" && <DivisionsSection {...sectionProps} />}
          {section === "about" && <AboutSection {...sectionProps} />}
          {section === "leadership" && <LeadershipSection {...sectionProps} />}
          {section === "partners" && <PartnersSection {...sectionProps} />}
          {section === "contact" && <ContactSection {...sectionProps} />}
          {section === "projects" && <ProjectsManager />}
          {section === "maintenance" && (
            <MaintenancePanel
              state={state}
              busy={busy === "maintenance"}
              confirm={confirmMaintenance}
              setConfirm={setConfirmMaintenance}
              onChange={doMaintenance}
            />
          )}
          <p className="pt-2 text-center text-[0.78rem] text-graphite/70 lg:hidden">
            Signed in as {user?.email}.{" "}
            <button type="button" onClick={logout} className="font-semibold text-ink underline underline-offset-4">
              Sign out
            </button>
          </p>
        </main>
      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return <div className="min-h-screen bg-mist/70 font-body text-graphite">{children}</div>;
}

function Overview({ state, dirty, unpublished, go, onPreview }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-[1.8rem] font-extrabold text-ink">Content manager</h1>
        <p className="mt-2 max-w-[68ch] text-[0.95rem] leading-relaxed text-graphite">
          Edit the website's text, images, partners, statistics and contact details. Changes are kept as a draft that
          only admins can see. Use Preview to check them on the real pages, then Publish to make them live.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Publishing">
          <dl className="space-y-2 text-[0.88rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-graphite">Draft</dt>
              <dd className="text-end font-semibold text-ink">
                {dirty ? "Unsaved changes" : unpublished ? "Saved, waiting to publish" : "Same as the live site"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-graphite">Last published</dt>
              <dd className="text-end text-ink">
                {state.publishedAt ? `${formatDate(state.publishedAt)}${state.publishedBy ? `, by ${state.publishedBy}` : ""}` : "Not yet: the site shows its original content"}
              </dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btn.ghost} onClick={onPreview}>
              <Eye className="h-4 w-4" aria-hidden="true" />
              Preview draft
            </button>
            <a href="/" target="_blank" rel="noreferrer" className={btn.ghost}>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              View live site
            </a>
          </div>
        </Panel>

        <Panel title="Maintenance mode">
          <p className="text-[0.88rem] leading-relaxed text-graphite">
            {state.maintenance
              ? "On. Visitors see the maintenance page. You can still browse the site while signed in."
              : "Off. The website is visible to everyone."}
          </p>
          <button type="button" className={state.maintenance ? btn.accent : btn.ghost} onClick={() => go("maintenance")}>
            <Wrench className="h-4 w-4" aria-hidden="true" />
            {state.maintenance ? "Manage maintenance mode" : "Turn on maintenance mode"}
          </button>
        </Panel>
      </div>

      <Panel title="What you can edit">
        <ul className="grid gap-2 sm:grid-cols-2">
          {SECTIONS.filter((s) => s.id !== "overview").map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => go(s.id)}
                  className="flex w-full items-center gap-3 border border-ink/10 px-3 py-3 text-start transition-colors hover:border-ink"
                >
                  <Icon className="h-4 w-4 shrink-0 text-ink" aria-hidden="true" />
                  <span className="flex-1 font-body text-[0.88rem] font-semibold text-ink">{s.label}</span>
                  {s.live && <span className="text-[0.72rem] text-graphite">saves live</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}

function MaintenancePanel({ state, busy, confirm, setConfirm, onChange }) {
  const on = state.maintenance;
  return (
    <Panel
      title="Maintenance mode"
      description="When it's on, everyone who isn't a signed-in admin sees a maintenance page instead of the website. The maintenance page shows no email, phone or contact links. Its wording is under Page text, in Maintenance page."
    >
      <div className="flex flex-col gap-4 border border-ink/10 bg-mist/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading text-[1.05rem] font-bold text-ink">{on ? "Maintenance mode is on" : "Maintenance mode is off"}</p>
          <p className="mt-1 text-[0.85rem] text-graphite">
            {on
              ? `Visitors see the maintenance page${state.maintenanceBy ? `. Turned on by ${state.maintenanceBy}` : ""}.`
              : "The website is visible to everyone."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label="Maintenance mode"
          disabled={busy}
          onClick={() => setConfirm(on ? "off" : "on")}
          className={`relative inline-flex h-8 w-14 shrink-0 items-center transition-colors duration-200 disabled:opacity-50 ${on ? "bg-signal" : "bg-ink/25"}`}
        >
          <span
            className={`inline-block h-6 w-6 bg-paper shadow transition-transform duration-200 ${on ? "translate-x-7 rtl:-translate-x-7" : "translate-x-1 rtl:-translate-x-1"}`}
          />
        </button>
      </div>

      {confirm && (
        <div role="alertdialog" aria-labelledby="mm-confirm" className="menu-enter border border-ink bg-paper p-4">
          <p id="mm-confirm" className="font-body text-[0.92rem] font-semibold text-ink">
            {confirm === "on"
              ? "Turn on maintenance mode? Visitors will see the maintenance page until you turn it off."
              : "Turn off maintenance mode? The website will be visible to everyone again."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={btn.ghost} onClick={() => setConfirm(null)} disabled={busy}>
              Cancel
            </button>
            <button type="button" className={confirm === "on" ? btn.accent : btn.primary} onClick={() => onChange(confirm === "on")} disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {confirm === "on" ? "Turn on maintenance mode" : "Turn off maintenance mode"}
            </button>
          </div>
        </div>
      )}

      <div className="text-[0.85rem] leading-relaxed text-graphite">
        <p className="font-semibold text-ink">While it's on</p>
        <ul className="mt-1 list-disc space-y-1 ps-5">
          <li>You and other admins can still sign in, use this content manager and browse the full site.</li>
          <li>Access is checked on the server for every request, so there is no hidden link or code to share.</li>
          <li>Search engines are told not to index the maintenance page.</li>
        </ul>
      </div>
    </Panel>
  );
}
