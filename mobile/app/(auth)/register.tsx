import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { getApiBaseUrl } from "../apiConfig";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username) {
      Alert.alert("Peringatan", "Nama pengguna wajib diisi");
      return;
    }
    if (!email || !password) {
      Alert.alert("Peringatan", "Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${getApiBaseUrl()}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Gagal", data.message || "Terjadi kesalahan");
        return;
      }

      Alert.alert("Berhasil", "Akun berhasil dibuat");
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("Error", "Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>LAPOR LINGKUNGAN</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nama Pengguna</Text>
          <TextInput
            placeholder="Masukkan nama pengguna anda . . ."
            placeholderTextColor="#aaa"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Masukkan email anda . . ."
            placeholderTextColor="#aaa"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Kata Sandi</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Masukkan kata sandi anda . . ."
              placeholderTextColor="#aaa"
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility-off" : "visibility"}
                size={22}
                color="#2e7d32"
              />
            </TouchableOpacity>
          </View>

          {/* Lihat Kata Sandi & Lupa Kata Sandi */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.showPwRow}
              onPress={() => setShowPassword(!showPassword)}
            >
              <View style={[styles.checkbox, showPassword && styles.checkboxActive]}>
                {showPassword && (
                  <MaterialIcons name="check" size={12} color="#fff" />
                )}
              </View>
              <Text style={styles.showPwLabel}>Lihat Kata Sandi ?</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotText}>Lupa Kata Sandi ?</Text>
            </TouchableOpacity>
          </View>

          {/* Tombol Daftar */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Daftar</Text>
            )}
          </TouchableOpacity>

          {/* Sudah punya akun */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Sudah Punya Akun ?</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginLink}> Masuk Sekarang</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Wave — di dalam ScrollView, natural flow */}
        <View style={styles.waveContainer}>
          <Svg
            viewBox="0 0 412 100"
            width="100%"
            height={100}
            preserveAspectRatio="none"
          >
            <Path
              d="M0 60 Q80 10 180 50 Q280 90 370 30 Q395 15 412 25 L412 100 L0 100 Z"
              fill="#4a7c2f"
            />
            <Path
              d="M0 75 Q100 25 200 65 Q300 100 380 50 Q400 38 412 45 L412 100 L0 100 Z"
              fill="#1b5e20"
            />
          </Svg>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Dengan masuk, Anda menyetujui{"\n"}
              <Text style={styles.footerBold}>
                kebijakan privasi & ketentuan layanan.
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 50,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 28,
    paddingHorizontal: 28,
  },

  logo: {
    width: 90,
    height: 90,
  },

  appName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "700",
    color: "#1b5e20",
    letterSpacing: 1,
  },

  formContainer: {
    width: "100%",
    paddingHorizontal: 28,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1b5e20",
    marginBottom: 6,
    marginTop: 14,
  },

  input: {
    height: 48,
    borderWidth: 2,
    borderColor: "#2e7d32",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#222",
    backgroundColor: "#fff",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderWidth: 2,
    borderColor: "#2e7d32",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },

  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: "#222",
  },

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  showPwRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#2e7d32",
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxActive: {
    backgroundColor: "#2e7d32",
  },

  showPwLabel: {
    fontSize: 13,
    color: "#555",
    marginLeft: 6,
  },

  forgotText: {
    fontSize: 13,
    color: "#1b5e20",
    fontWeight: "600",
  },

  registerButton: {
    backgroundColor: "#1b5e20",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  registerButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },

  loginText: {
    fontSize: 13,
    color: "#555",
  },

  loginLink: {
    fontSize: 13,
    color: "#1b5e20",
    fontWeight: "700",
  },

  waveContainer: {
    marginTop: "auto",
  },

  footer: {
    backgroundColor: "#1b5e20",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },

  footerText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },

  footerBold: {
    fontWeight: "700",
  },
});
