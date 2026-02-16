import { api } from "./api.js";

const stateEl = document.getElementById("state");
const detailBox = document.getElementById("detailBox");
const statusEl = document.getElementById("status");
const btnUpdate = document.getElementById("btnUpdate");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString("id-ID");
  } catch {
    return d ?? "-";
  }
}

function formatTime(t) {
  if (!t) return "-";
  return String(t).slice(0, 5);
}

function renderDetail(p) {
  return `
    <div class="detail-grid">
      <div><b>ID</b><br>${p.id}</div>
      <div><b>Nama Peminjam</b><br>${p.namaPeminjam}</div>
      <div><b>Nomor</b><br>${p.nomorPeminjam}</div>
      <div><b>Ruangan</b><br>${p.namaRuangan}</div>
      <div><b>Tanggal</b><br>${formatDate(p.tanggal)}</div>
      <div><b>Mulai</b><br>${formatTime(p.waktuMulai)}</div>
      <div><b>Selesai</b><br>${formatTime(p.waktuSelesai)}</div>
      <div><b>Status</b><br>${p.status}</div>
      <div style="grid-column: 1 / -1;">
        <b>Alasan</b><br>${p.alasanPeminjaman}
      </div>
    </div>
  `;
}

async function load() {
  if (!id) {
    stateEl.textContent = "ID tidak ditemukan. Buka dari halaman list (Detail).";
    return;
  }

  stateEl.textContent = "Loading...";
  detailBox.innerHTML = "";

  try {
    const data = await api.getById(id);
    detailBox.innerHTML = renderDetail(data);
    statusEl.value = data.status;
    stateEl.textContent = "";
  } catch (e) {
    stateEl.textContent = `Error: ${e.message}`;
  }
}

btnUpdate.addEventListener("click", async () => {
  if (!id) return;

  btnUpdate.disabled = true;
  stateEl.textContent = "Updating status...";

  try {
    await api.updateStatus(id, { Status: statusEl.value });
    await load();
    alert("Status berhasil diupdate");
  } catch (e) {
    stateEl.textContent = `Gagal update: ${e.message}`;
  } finally {
    btnUpdate.disabled = false;
  }
});

load();
