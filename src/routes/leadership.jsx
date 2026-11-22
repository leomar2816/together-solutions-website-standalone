import { useSiteContent } from "@/lib/site-content";
import { createFileRoute } from "@tanstack/react-router";
import ContactStrip from "@/components/site/ContactStrip";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership — Together" },
      {
        name: "description",
        content:
          "Together is led by Ashraf Alhalawani, Chairman and CEO, and Abdulaziz Aldabagh, Vice Chairman and CBDO.",
      },
    ],
  }),
  component: Leadership,
});

function Leadership() {
  const { t, pick } = useLang();
  const { leadership } = useSiteContent();

  return (
    <>
      <section className="bg-paper pt-[68px] lg:pt-[76px]">
        <div className="container-x py-14 lg:py-20">
          <h1 className="font-heading text-[2.3rem] font-extrabold leading-[1.02] text-ink sm:text-[3.1rem] lg:text-[3.7rem]">
            {t("leadership.title")}
          </h1>
          <p className="measure mt-6 text-[1.05rem] leading-relaxed text-graphite">
            {t("leadership.body")}
          </p>
        </div>
      </section>

      <section className="bg-mist py-14 lg:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-2 lg:gap-10">
          {leadership.map((person) => (
            <article key={person.name} className="flex flex-col bg-paper p-7 lg:p-10">
              <div className="flex items-start justify-between gap-6">
                <span
                  className="font-heading text-[2.4rem] font-extrabold leading-none tracking-[-0.04em] text-ink/15"
                  aria-hidden="true"
                >
                  {person.initials}
                </span>
                <span className="h-[3px] w-14 bg-signal" aria-hidden="true" />
              </div>
              <h2 className="mt-8 font-heading text-[1.6rem] font-extrabold leading-tight text-ink lg:text-[1.9rem]">
                {person.name}
              </h2>
              <p className="mt-2 font-body text-[0.92rem] font-semibold text-graphite">
                {pick(person.role)}
              </p>
              <p className="mt-5 text-[1rem] leading-relaxed text-graphite">{pick(person.bio)}</p>
            </article>
          ))}
        </div>
      </section>

      <ContactStrip />
    </>
  );
}