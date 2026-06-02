import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Peringatan", "Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          "Login Gagal",
          data.message || "Email atau password salah"
        );
        return;
      }

      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
      }

      if (data.user) {
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      Alert.alert("Berhasil", "Login berhasil");

      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Error",
        "Tidak dapat terhubung ke server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg auth.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />

          <Text style={styles.title}>
            LAPOR LINGKUNGAN
          </Text>

          <Text style={styles.subtitle}>
            Masuk ke akun Anda
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>

          <TextInput
            placeholder="Masukkan email"
            placeholderTextColor="#666"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Masukkan password"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(!showPassword)
              }
            >
              <MaterialIcons
                name={
                  showPassword
                    ? "visibility-off"
                    : "visibility"
                }
                size={22}
                color="#035A1C"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotContainer}
          >
            <Text style={styles.forgotText}>
              Lupa Kata Sandi?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>
                Masuk
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Belum punya akun?
            </Text>

            <TouchableOpacity>
              <Text style={styles.registerLink}>
                Daftar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          Dengan masuk, Anda menyetujui syarat dan
          ketentuan yang berlaku.
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 70,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  logo: {
    width: 120,
    height: 120,
  },

  title: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: "700",
    color: "#035A1C",
  },

  subtitle: {
    marginTop: 4,
    color: "#444",
    fontSize: 14,
  },

  formContainer: {
    width: "100%",
  },

  label: {
    marginBottom: 8,
    marginTop: 14,
    fontWeight: "600",
    color: "#035A1C",
    fontSize: 15,
  },

  input: {
    height: 56,
    borderWidth: 2,
    borderColor: "#035A1C",
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.85)",
    color: "#000",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderWidth: 2,
    borderColor: "#035A1C",
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.85)",
  },

  passwordInput: {
    flex: 1,
    color: "#000",
  },

  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: 12,
  },

  forgotText: {
    color: "#035A1C",
    fontWeight: "600",
  },

  loginButton: {
    backgroundColor: "#035A1C",
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  loginButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  registerText: {
    color: "#444",
  },

  registerLink: {
    color: "#035A1C",
    fontWeight: "700",
    marginLeft: 4,
  },

  footer: {
    textAlign: "center",
    marginTop: 25,
    color: "#444",
    fontSize: 12,
  },
});