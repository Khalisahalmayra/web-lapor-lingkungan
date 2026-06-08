import { getApiBaseUrl } from "../apiConfig";

const API_URL = getApiBaseUrl();

export const getKomentarByLaporan = async (laporanId: string | number) => {
  const response = await fetch(`${API_URL}/api/komentar/laporan/${laporanId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil komentar");
  }

  return data.success ? data.data || [] : [];
};

export const createKomentar = async (
  laporanId: string | number,
  isiKomentar: string,
  token: string
) => {
  const response = await fetch(`${API_URL}/api/komentar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      laporan_id: laporanId,
      isi_komentar: isiKomentar,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengirim komentar");
  }

  return data;
};

export const updateKomentar = async (
  komentarId: string | number,
  isiKomentar: string,
  token: string
) => {
  const response = await fetch(
    `${API_URL}/api/komentar/${komentarId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isi_komentar: isiKomentar,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Gagal memperbarui komentar"
    );
  }

  return data;
};

export const deleteKomentar = async (
  komentarId: string | number,
  token: string
) => {
  const response = await fetch(
    `${API_URL}/api/komentar/${komentarId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Gagal menghapus komentar"
    );
  }

  return data;
};