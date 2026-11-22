import { createFileRoute } from "@tanstack/react-router";
import AdminApp from "@/components/admin/AdminApp";

// Browser-only: the server renders pages anonymously, and nothing about the content
// manager belongs in server HTML. Access is enforced by the admin server functions.
export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Content manager — Together" }, { name: "robots", content: "noindex" }] }),
  component: AdminApp,
});
