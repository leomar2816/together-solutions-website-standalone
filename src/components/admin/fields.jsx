import { useId, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api/client";

export const inputCls =
  "w-full border border-ink/20 bg-paper px-3 py-2 font-body text-[0.92rem] text-ink placeholder:text-graphite/45 transition-colors focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-signal";

export const btn = {
  primary:
    "inline-flex h-10 items-center justify-center gap-2 bg-ink px-4 font-body text-[0.88rem] font-semibold text-paper transition-colors hover:bg-deepnavy disabled:cursor-not-allowed disabled:opacity-50",
  accent:
    "inline-flex h-10 items-center justify-center gap-2 bg-signal px-4 font-body text-[0.88rem] font-semibold text-ink transition-colors hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50",
  ghost:
    "inline-flex h-10 items-center justify-center gap-2 border border-ink/20 bg-paper px-4 font-body text-[0.88rem] font-semibold text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-50",
  small:
    "inline-flex h-8 items-center justify-center gap-1.5 border border-ink/15 bg-paper px-2.5 font-body text-[0.78rem] font-semibold text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40",
  icon: "inline-flex h-8 w-8 items-center justify-center border border-ink/15 bg-paper text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-30",
};

/** A titled panel inside a section. */
export function Panel({ title, description, actions, children }) {
  return (
    <section className="border border-ink/10 bg-paper">
      <header className="flex flex-col gap-3 border-b border-ink/10 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-[1.1rem] font-bold text-ink">{title}</h2>
          {description && <p className="mt-1 max-w-[70ch] text-[0.88rem] leading-relaxed text-graphite">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </header>
      <div className="space-y-5 px-5 py-5">{children}</div>
    </section>
  );
}

export function Field({ label, hint, children, htmlFor }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block font-body text-[0.82rem] font-semibold text-ink">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-[0.78rem] text-graphite/80">{hint}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export function TextInput({ value, onChange, multiline = false, rows = 3, dir, ...props }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <Tag
      {...props}
      dir={dir}
      rows={multiline ? rows : undefined}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
      className={`${inputCls} ${multiline ? "resize-y leading-relaxed" : "h-10"}`}
    />
  );
}

/** English + Arabic side by side (stacked on mobile). value = { en, ar }. */
export function BilingualField({ label, hint, value, onChange, multiline = false, rows }) {
  const id = useId();
  const v = value || {};
  return (
    <fieldset>
      <legend className="font-body text-[0.82rem] font-semibold text-ink">{label}</legend>
      {hint && <p className="mt-0.5 text-[0.78rem] text-graphite/80">{hint}</p>}
      <div className="mt-1.5 grid gap-3 md:grid-cols-2">
        <div>
          <label htmlFor={`${id}-en`} className="mb-1 block text-[0.72rem] font-semibold text-graphite/80">
            English
          </label>
          <TextInput id={`${id}-en`} value={v.en} onChange={(en) => onChange({ ...v, en })} multiline={multiline} rows={rows} />
        </div>
        <div>
          <label htmlFor={`${id}-ar`} className="mb-1 block text-[0.72rem] font-semibold text-graphite/80">
            العربية
          </label>
          <TextInput id={`${id}-ar`} dir="rtl" value={v.ar} onChange={(ar) => onChange({ ...v, ar })} multiline={multiline} rows={rows} />
        </div>
      </div>
    </fieldset>
  );
}

/** Upload or replace an image; reports { url, width, height }. */
export function ImageField({ label, hint, value, onChange, preview = "cover", alt = "" }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const id = useId();

  const upload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file (PNG, JPG, WebP or SVG).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("That image is larger than 10 MB. Choose a smaller file.");
      return;
    }
    setBusy(true);
    try {
      const { file_url } = await api.integrations.Core.UploadFile({ file });
      const size = await new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => resolve({ width: 0, height: 0 });
        img.src = file_url;
      });
      onChange({ url: file_url, ...size });
      toast.success("Image uploaded. Save or publish to keep it.");
    } catch {
      toast.error("The image could not be uploaded. Check your connection and try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block font-body text-[0.82rem] font-semibold text-ink">
          {label}
        </label>
      )}
      {hint && <p className="mt-0.5 text-[0.78rem] text-graphite/80">{hint}</p>}
      <div className="mt-1.5 flex flex-wrap items-center gap-3">
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden border border-ink/10 bg-mist ${
            preview === "logo" ? "h-16 w-40 bg-paper p-2" : "h-20 w-32"
          }`}
        >
          {value ? (
            <img
              src={value}
              alt={alt}
              className={preview === "logo" ? "max-h-full max-w-full object-contain" : "h-full w-full object-cover"}
            />
          ) : (
            <span className="text-[0.72rem] text-graphite/60">No image</span>
          )}
        </div>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => upload(event.target.files?.[0])}
        />
        <button type="button" className={btn.small} onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />}
          {busy ? "Uploading" : value ? "Replace image" : "Upload image"}
        </button>
      </div>
    </div>
  );
}

/** An editable, reorderable list of items. */
export function ListEditor({ items, onChange, renderItem, newItem, itemLabel, addLabel = "Add item", min = 0 }) {
  const move = (from, to) => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };
  return (
    <div className="space-y-3">
      <ol className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="border border-ink/10 bg-mist/60">
            <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-3 py-2">
              <span className="truncate font-body text-[0.82rem] font-semibold text-ink">
                {itemLabel(item, index)}
              </span>
              <div className="flex shrink-0 gap-1.5">
                <button type="button" className={btn.icon} onClick={() => move(index, index - 1)} disabled={index === 0} aria-label="Move up">
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={btn.icon}
                  onClick={() => move(index, index + 1)}
                  disabled={index === items.length - 1}
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={btn.icon}
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                  disabled={items.length <= min}
                  aria-label={`Remove ${itemLabel(item, index)}`}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="space-y-4 p-3 sm:p-4">
              {renderItem(item, (patch) => onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it))), index)}
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className={btn.small} onClick={() => onChange([...items, newItem()])}>
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        {addLabel}
      </button>
    </div>
  );
}

/** "Edited" badge + restore-original button for a content block. */
export function OverrideActions({ edited, onReset }) {
  if (!edited) return <span className="self-center text-[0.75rem] text-graphite/70">Original content</span>;
  return (
    <>
      <span className="self-center bg-signal/20 px-2 py-0.5 text-[0.75rem] font-semibold text-ink">Edited</span>
      <button type="button" className={btn.small} onClick={onReset}>
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        Restore original
      </button>
    </>
  );
}
