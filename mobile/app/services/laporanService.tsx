import { getApiBaseUrl } from "../apiConfig";

const API_URL = getApiBaseUrl();

export const getLaporanDetail = async (id: string | number) => {
  const response = await fetch(`${API_URL}/api/laporan/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil detail laporan");
  }

  return data.data || data;
};

export const getAllLaporan = async () => {
  const response = await fetch(`${API_URL}/api/laporan`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil laporan");
  }

  return Array.isArray(data) ? data : data.data || [];
};

export const toggleLikeLaporan = async (
  id: string | number,
  token: string
) => {
  const response = await fetch(`${API_URL}/api/laporan/${id}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal mendukung laporan");
  }

  return data;
};
