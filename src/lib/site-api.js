import { request } from "@/api/client";

/*
 * Content manager and maintenance mode. These were TanStack Start server functions on
 * Base44; they are now endpoints of the PHP API (public/api/index.php), which verifies
 * the caller's session and admin role on every admin call. Same names and call shapes.
 */

export const getPublicSiteState = () => request("/site-state");
export const getAdminAccess = () => request("/admin/access");
export const getPublishedForAdmin = () => request("/admin/published");
export const getManagerState = () => request("/admin/manager");
export const getDraftForPreview = () => request("/admin/draft");
export const saveDraft = ({ data }) => request("/admin/draft", { method: "POST", body: data });
export const publishContent = ({ data }) => request("/admin/publish", { method: "POST", body: data });
export const discardDraft = () => request("/admin/discard", { method: "POST" });
export const setMaintenance = ({ data }) => request("/admin/maintenance", { method: "POST", body: data });
