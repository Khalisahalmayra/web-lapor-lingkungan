import { Platform } from "react-native";

// Ganti dengan IP komputer kamu di jaringan Wi-Fi
export const LOCAL_API_HOST = "192.168.43.139";

export const getApiBaseUrl = () => {
  if (Platform.OS === "android") {
    return "http://192.168.43.139:5000";
  }
  return `http://${LOCAL_API_HOST}:5000`;
};

export const getUploadUrl = (filename: string) =>
  `${getApiBaseUrl()}/uploads/${filename}`;
