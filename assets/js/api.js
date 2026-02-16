export const API_BASE = "http://localhost:5086";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  let data = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) data = await res.json();

  if (!res.ok) {
    const msg = (data && (data.message || data.title)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  list: (qs = "") => request(`/api/Peminjaman${qs}`),
  getById: (id) => request(`/api/Peminjaman/${id}`),
  create: (payload) =>
    request(`/api/Peminjaman`, { method: "POST", body: JSON.stringify(payload) }),
  updateStatus: (id, payload) =>
    request(`/api/Peminjaman/${id}/status`, { method: "PUT", body: JSON.stringify(payload) }),
  delete: (id) => request(`/api/Peminjaman/${id}`, { method: "DELETE" }),
};
