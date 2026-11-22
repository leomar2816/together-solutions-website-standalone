import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/api/client";
import Hero from "@/components/home/Hero";
import VisionPanel from "@/components/home/VisionPanel";
import ProofLedger from "@/components/home/ProofLedger";
import DivisionsGrid from "@/components/home/DivisionsGrid";
import RecentProjects from "@/components/home/RecentProjects";
import PartnerWall from "@/components/site/PartnerWall";
import ContactStrip from "@/components/site/ContactStrip";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Together — progressing together toward a better future" },
      {
        name: "description",
        content:
          "A Riyadh-based multi-sector group: communications, sport, real estate, agriculture, camps and international trade. Six divisions, one delivery standard.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useLang();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let active = true;
    api.entities.Project.filter({ featured: true }, { sort: "-year", limit: 4 })
      .then((page) => {
        if (active) setProjects(page.items || []);
      })
      .catch(() => {
        if (active) setProjects([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Hero />
      <VisionPanel />
      <ProofLedger />
      <DivisionsGrid />
      {projects.length > 0 && <RecentProjects projects={projects} />}
      <section className="bg-paper py-16 lg:py-24">
        <div className="container-x">
          <PartnerWall title={t("home.partners.title")} />
        </div>
      </section>
      <ContactStrip />
    </>
  );
}