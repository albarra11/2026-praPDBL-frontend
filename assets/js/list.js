import { api } from "./api.js";

const tbody = document.getElementById("tbody");
const stateEl = document.getElementById("state");
const keywordEl = document.getElementById("keyword");
const statusEl = document.getElementById("status");
const btnSearch = document.getElementById("btnSearch");

function buildQuery() {
  const keyword = keywordEl.value.trim();
  const status = statusEl.value;

  const params = new URLSearchParams();
  if (keyword) params.set("keyword", keyword);
  if (status) params.set("status", status);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString("id-ID");
  } catch {
    return d ?? "-";
  }
}

function formatTime(t) {
  // backend kirim TimeSpan biasanya "HH:MM:SS"
  if (!t) return "-";
  return String(t).slice(0, 5);
}

function renderRow(p) {
  return `
    <tr>
      <td>${p.namaPeminjam}</td>
      <td>${p.namaRuangan}</td>
      <td>${formatDate(p.tanggal)}</td>
      <td>${formatTime(p.waktuMulai)}</td>
      <td>${formatTime(p.waktuSelesai)}</td>
      <td>${p.status}</td>
      <td class="actions">
        <button><a href="detail.html?id=${p.id}">Detail</a></button>
        <button data-del="${p.id}">Delete</button>
      </td>
    </tr>
  `;
}

async function load() {
  stateEl.textContent = "Loading...";
  tbody.innerHTML = "";

  try {
    const data = await api.list(buildQuery());
    const items = Array.isArray(data) ? data : (data.items || []);
    tbody.innerHTML = items.map(renderRow).join("");
    stateEl.textContent = items.length ? "" : "Belum ada data.";
  } catch (e) {
    stateEl.textContent = `Error: ${e.message}`;
  }
}

btnSearch.addEventListener("click", load);

tbody.addEventListener("click", async (e) => {
  const id = e.target?.dataset?.del;
  if (!id) return;

  if (!confirm(`Yakin hapus peminjaman ID ${id}?`)) return;

  try {
    await api.delete(id);
    await load();
  } catch (err) {
    alert(`Gagal delete: ${err.message}`);
  }
});

load();
