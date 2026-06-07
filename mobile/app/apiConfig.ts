import { Platform } from "react-native";

// Ganti dengan IP komputer kamu di jaringan Wi-Fi
export const LOCAL_API_HOST = "192.168.1.7";
const API_PORT = "5000";

export const getApiBaseUrl = () => {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const host = window.location.hostname || LOCAL_API_HOST;
    return `http://${host}:${API_PORT}`;
  }

  if (Platform.OS === "android") {
    return `http://${LOCAL_API_HOST}:${API_PORT}`;
  }
  return `http://${LOCAL_API_HOST}:${API_PORT}`;
};

export const getUploadUrl = (filename: string) =>
  `${getApiBaseUrl()}/uploads/${filename}`;
