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
      <div class="detail-item"><b>ID</b>${p.id}</div>
      <div class="detail-item"><b>Nama Peminjam</b>${p.namaPeminjam}</div>
      <div class="detail-item"><b>Nomor</b>${p.nomorPeminjam}</div>

      <div class="detail-item"><b>Ruangan</b>${p.namaRuangan}</div>
      <div class="detail-item"><b>Tanggal</b>${formatDate(p.tanggal)}</div>
      <div class="detail-item"><b>Status</b><span class="badge">${p.status}</span></div>

      <div class="detail-item"><b>Mulai</b>${formatTime(p.waktuMulai)}</div>
      <div class="detail-item"><b>Selesai</b>${formatTime(p.waktuSelesai)}</div>
      <div class="detail-item full"><b>Alasan</b>${p.alasanPeminjaman}</div>
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
