import { api } from "./api.js";

const form = document.getElementById("form");
const stateEl = document.getElementById("state");

function toIsoDate(dateStr) {
  // input type="date" -> "YYYY-MM-DD"
  // backend kamu pakai DateTime. Kita kirim ISO aman: "YYYY-MM-DDT00:00:00"
  return `${dateStr}T00:00:00`;
}

function toTimeSpan(timeStr) {
  // input type="time" -> "HH:MM"
  // backend TimeSpan biasanya bisa terima "HH:MM:SS"
  return `${timeStr}:00`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  stateEl.textContent = "Mengirim data...";

  const fd = new FormData(form);
  const payload = Object.fromEntries(fd.entries());

  // mapping format agar cocok dengan DTO backend
  payload.tanggal = toIsoDate(payload.tanggal);
  payload.waktuMulai = toTimeSpan(payload.waktuMulai);
  payload.waktuSelesai = toTimeSpan(payload.waktuSelesai);

  // validasi cepat di frontend (tambahan)
  if (payload.waktuMulai >= payload.waktuSelesai) {
    stateEl.textContent = "Waktu mulai harus lebih kecil dari waktu selesai.";
    return;
  }

  try {
    const res = await api.create(payload);
    stateEl.textContent = "Berhasil! Redirect ke list...";
    setTimeout(() => (window.location.href = "index.html"), 500);
  } catch (err) {
    stateEl.textContent = `Gagal: ${err.message}`;
  }
});
