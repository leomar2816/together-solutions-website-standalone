import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api/client";
import { DIVISIONS, getDivision } from "@/lib/divisions";
import { Field, ImageField, Panel, TextInput, btn, inputCls } from "@/components/admin/fields";

/*
 * Projects are database records (the Project entity). Its access rules let only admins
 * create, change or delete them, so these calls are enforced on the server.
 * Changes here are live as soon as they are saved; there is no draft step.
 */

const empty = () => ({
  title: "",
  title_ar: "",
  year: new Date().getFullYear(),
  year_label: "",
  division: "solutions",
  client: "",
  client_ar: "",
  summary: "",
  summary_ar: "",
  images: [],
  video_url: "",
  featured: false,
});

export default function ProjectsManager() {
  const [projects, setProjects] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    try {
      const page = await api.entities.Project.list({ sort: "-year", limit: 500 });
      setProjects(page.items || []);
    } catch {
      setProjects([]);
      toast.error("Projects could not be loaded. Refresh the page to try again.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing.title.trim()) {
      toast.error("Add a project title before saving.");
      return;
    }
    const year = Number(editing.year);
    if (!Number.isInteger(year) || year < 1990 || year > 2100) {
      toast.error("Enter the year as four digits, for example 2025.");
      return;
    }
    setSaving(true);
    const { id, created_date, updated_date, created_by, created_by_id, ...data } = editing;
    try {
      const payload = { ...data, title: data.title.trim(), year };
      if (id) await api.entities.Project.update(id, payload);
      else await api.entities.Project.create(payload);
      toast.success(id ? "Project saved. The change is live." : "Project added. It is live on the site.");
      setEditing(null);
      await load();
    } catch {
      toast.error("The project could not be saved. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (project) => {
    setSaving(true);
    try {
      await api.entities.Project.delete(project.id);
      toast.success(`“${project.title}” deleted.`);
      setConfirmDelete(null);
      await load();
    } catch {
      toast.error("The project could not be deleted. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    const cover = editing.images?.[0] || "";
    return (
      <Panel
        title={editing.id ? "Edit project" : "New project"}
        description="Saving updates the live site straight away."
        actions={
          <>
            <button type="button" className={btn.ghost} onClick={() => setEditing(null)} disabled={saving}>
              Cancel
            </button>
            <button type="button" className={btn.primary} onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {editing.id ? "Save project" : "Add project"}
            </button>
          </>
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Project name (English)" htmlFor="p-title">
            <TextInput id="p-title" value={editing.title} onChange={(title) => setEditing({ ...editing, title })} />
          </Field>
          <Field label="Project name (Arabic)" hint="Both names are shown on the project card." htmlFor="p-title-ar">
            <TextInput id="p-title-ar" dir="rtl" value={editing.title_ar} onChange={(title_ar) => setEditing({ ...editing, title_ar })} />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Start year" htmlFor="p-year">
            <TextInput id="p-year" inputMode="numeric" value={String(editing.year ?? "")} onChange={(year) => setEditing({ ...editing, year: year.replace(/\D/g, "").slice(0, 4) })} />
          </Field>
          <Field label="Year label" hint="Optional, for example 2023–25" htmlFor="p-yl">
            <TextInput id="p-yl" value={editing.year_label} onChange={(year_label) => setEditing({ ...editing, year_label })} />
          </Field>
          <Field label="Division" htmlFor="p-div">
            <select id="p-div" value={editing.division} onChange={(event) => setEditing({ ...editing, division: event.target.value })} className={`${inputCls} h-10`}>
              {DIVISIONS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name.en}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Client (English)" htmlFor="p-client">
            <TextInput id="p-client" value={editing.client} onChange={(client) => setEditing({ ...editing, client })} />
          </Field>
          <Field label="Client (Arabic)" htmlFor="p-client-ar">
            <TextInput id="p-client-ar" dir="rtl" value={editing.client_ar} onChange={(client_ar) => setEditing({ ...editing, client_ar })} />
          </Field>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Summary (English)" htmlFor="p-summary">
            <TextInput id="p-summary" multiline rows={4} value={editing.summary} onChange={(summary) => setEditing({ ...editing, summary })} />
          </Field>
          <Field label="Summary (Arabic)" htmlFor="p-summary-ar">
            <TextInput id="p-summary-ar" dir="rtl" multiline rows={4} value={editing.summary_ar} onChange={(summary_ar) => setEditing({ ...editing, summary_ar })} />
          </Field>
        </div>
        <ImageField label="Cover photo" value={cover} alt={editing.title} onChange={({ url }) => setEditing({ ...editing, images: [url, ...(editing.images || []).slice(1)] })} />
        <Field label="Video link" hint="Optional." htmlFor="p-video">
          <TextInput id="p-video" type="url" value={editing.video_url} onChange={(video_url) => setEditing({ ...editing, video_url })} />
        </Field>
        <label className="flex items-center gap-2.5 font-body text-[0.88rem] text-ink">
          <input
            type="checkbox"
            checked={Boolean(editing.featured)}
            onChange={(event) => setEditing({ ...editing, featured: event.target.checked })}
            className="h-4 w-4 accent-ink"
          />
          Feature on the home page (recent projects)
        </label>
      </Panel>
    );
  }

  return (
    <Panel
      title="Projects"
      description="The project record shown on the Projects page, the division pages and the home page. Changes here are live as soon as you save them."
      actions={
        <button type="button" className={btn.primary} onClick={() => setEditing(empty())}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add project
        </button>
      }
    >
      {projects === null ? (
        <p className="flex items-center gap-2 text-[0.9rem] text-graphite">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading projects
        </p>
      ) : projects.length === 0 ? (
        <p className="text-[0.9rem] text-graphite">No projects yet. Add the first one.</p>
      ) : (
        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {projects.map((project) => {
            const division = getDivision(project.division);
            return (
              <li key={project.id} className="flex items-center gap-3 py-3">
                <div className="h-12 w-16 shrink-0 overflow-hidden bg-mist">
                  {project.images?.[0] && <img src={project.images[0]} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-body text-[0.9rem] font-semibold text-ink">
                    {project.title}
                    {project.featured && <Star className="ms-1.5 inline h-3.5 w-3.5 fill-signal text-signal" aria-label="Featured" />}
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 text-[0.78rem] text-graphite">
                    <span className="h-2 w-2" style={{ backgroundColor: division.color }} aria-hidden="true" />
                    {division.name.en}, {project.year_label || project.year}
                  </p>
                </div>
                {confirmDelete === project.id ? (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="hidden text-[0.78rem] text-graphite sm:inline">Delete this project?</span>
                    <button type="button" className={btn.small} onClick={() => setConfirmDelete(null)} disabled={saving}>
                      Keep
                    </button>
                    <button type="button" className={`${btn.small} border-red-700 text-red-700`} onClick={() => remove(project)} disabled={saving}>
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="flex shrink-0 gap-1.5">
                    <button type="button" className={btn.icon} onClick={() => setEditing({ ...empty(), ...project })} aria-label={`Edit ${project.title}`}>
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button type="button" className={btn.icon} onClick={() => setConfirmDelete(project.id)} aria-label={`Delete ${project.title}`}>
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

