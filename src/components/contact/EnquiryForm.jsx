import { useDivisions } from "@/lib/site-content";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { api } from "@/api/client";
import { useLang } from "@/lib/i18n";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: "", organisation: "", email: "", phone: "", division: "", message: "" };

const inputClass =
  "mt-2 w-full border border-ink/25 bg-paper px-3.5 py-3 font-body text-[0.95rem] text-ink placeholder:text-graphite/45 focus:border-ink";

export default function EnquiryForm() {
  const { t, pick } = useLang();
  const divisions = useDivisions();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const update = (field) => (event) => {
    const value = event.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (status === "error") setStatus("idle");
  };

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = t("form.required");
    if (!values.email.trim()) next.email = t("form.required");
    else if (!EMAIL_RE.test(values.email.trim())) next.email = t("form.invalidEmail");
    if (!values.message.trim()) next.message = t("form.required");
    return next;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    try {
      await api.entities.ContactInquiry.create({
        name: values.name.trim(),
        organisation: values.organisation.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        division: values.division,
        message: values.message.trim(),
      });
      setValues(EMPTY);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-ink p-7 text-paper sm:p-10 lg:p-12">
        <span className="block h-[3px] w-14 bg-signal" aria-hidden="true" />
        <h2 className="mt-6 font-heading text-[1.7rem] font-extrabold text-paper lg:text-[2rem]">
          {t("form.success.title")}
        </h2>
        <p className="mt-4 max-w-[46ch] text-[1rem] leading-relaxed text-paper/75">
          {t("form.success.body")}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-lift mt-8 inline-flex h-12 items-center border border-paper/40 px-6 font-body text-[0.92rem] font-semibold text-paper hover:bg-paper hover:text-ink"
        >
          {t("form.again")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="bg-mist p-6 sm:p-8 lg:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="font-body text-[0.85rem] font-semibold text-ink">
            {t("form.name")} <span className="text-[#B3261E]">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={update("name")}
            aria-invalid={Boolean(errors.name)}
            className={inputClass}
          />
          {errors.name && <p className="mt-1.5 font-body text-xs text-[#B3261E]">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="organisation" className="font-body text-[0.85rem] font-semibold text-ink">
            {t("form.organisation")}
          </label>
          <input
            id="organisation"
            name="organisation"
            type="text"
            value={values.organisation}
            onChange={update("organisation")}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className="font-body text-[0.85rem] font-semibold text-ink">
            {t("form.email")} <span className="text-[#B3261E]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            value={values.email}
            onChange={update("email")}
            aria-invalid={Boolean(errors.email)}
            className={inputClass}
          />
          {errors.email && <p className="mt-1.5 font-body text-xs text-[#B3261E]">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="font-body text-[0.85rem] font-semibold text-ink">
            {t("form.phone")}{" "}
            <span className="font-normal text-graphite/60">({t("form.optional")})</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            dir="ltr"
            value={values.phone}
            onChange={update("phone")}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="division" className="font-body text-[0.85rem] font-semibold text-ink">
            {t("form.division")}{" "}
            <span className="font-normal text-graphite/60">({t("form.optional")})</span>
          </label>
          <select
            id="division"
            name="division"
            value={values.division}
            onChange={update("division")}
            className={inputClass}
          >
            <option value="">{t("form.select")}</option>
            {divisions.map((division) => (
              <option key={division.slug} value={division.slug}>
                {pick(division.name)}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="font-body text-[0.85rem] font-semibold text-ink">
            {t("form.message")} <span className="text-[#B3261E]">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={update("message")}
            aria-invalid={Boolean(errors.message)}
            className={inputClass}
          />
          {errors.message && (
            <p className="mt-1.5 font-body text-xs text-[#B3261E]">{errors.message}</p>
          )}
        </div>
      </div>

      {status === "error" && (
        <p className="mt-6 border-s-2 border-[#B3261E] bg-paper px-4 py-3 font-body text-sm text-[#B3261E]">
          {t("form.error")}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-lift group mt-7 inline-flex h-12 items-center gap-2 bg-signal px-7 font-body text-[0.95rem] font-semibold text-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? t("form.sending") : t("form.submit")}
        <ArrowRight className="arrow-nudge flip-rtl h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}