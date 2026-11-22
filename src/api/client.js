// Browser client for the PHP API in public/api. Same call shapes the pages used with the
// Base44 SDK (entities.Project.filter, auth.me, …), so the pages themselves barely changed.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const TOKEN_KEY = "tsw_token";

const isBrowser = typeof window !== "undefined";

export function getToken() {
  if (!isBrowser) return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage blocked: the session simply won't survive a reload
  }
}

/** JSON request to the API. Rejects with an Error carrying `status` on any non-2xx answer. */
export async function request(path, { method = "GET", body, form } = {}) {
  const token = getToken();
  const headers = {};
  if (token) headers["X-Auth-Token"] = token;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || res.statusText), { status: res.status, data });
  return data;
}

const projects = {
  // sort is always newest year first on the server; `query` keys: division, year, featured.
  filter: (query = {}, { limit } = {}) =>
    request("/projects?" + new URLSearchParams({ ...query, ...(limit ? { limit } : {}) })),
  list: (options) => projects.filter({}, options),
  create: (data) => request("/projects", { method: "POST", body: data }),
  update: (id, data) => request(`/projects/${encodeURIComponent(id)}`, { method: "PUT", body: data }),
  delete: (id) => request(`/projects/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

export const api = {
  entities: {
    Project: projects,
    ContactInquiry: { create: (data) => request("/inquiries", { method: "POST", body: data }) },
  },
  integrations: {
    Core: {
      UploadFile: ({ file }) => {
        const form = new FormData();
        form.append("file", file);
        return request("/admin/upload", { method: "POST", form });
      },
    },
  },
  auth: {
    hasToken: () => Boolean(getToken()),
    me: () => request("/auth/me"),
    login: async (email, password) => {
      const result = await request("/auth/login", { method: "POST", body: { email, password } });
      setToken(result.token);
      return result.user;
    },
    logout: async () => {
      await request("/auth/logout", { method: "POST" }).catch(() => {});
      setToken(null);
    },
  },
};
