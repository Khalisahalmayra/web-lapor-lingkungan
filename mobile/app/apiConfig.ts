import { Platform } from "react-native";

// Ganti dengan IP komputer kamu di jaringan Wi-Fi
export const LOCAL_API_HOST = "192.168.1.7";

export const getApiBaseUrl = () => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000";
  }
  return `http://${LOCAL_API_HOST}:5000`;
};

export const getUploadUrl = (filename: string) =>
  `${getApiBaseUrl()}/uploads/${filename}`;
