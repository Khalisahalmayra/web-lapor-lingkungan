import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: "Laporkan Masalah Lingkungan",
    description:
      "Laporkan sampah, pencemaran, atau kerusakan lingkungan secara cepat langsung dari ponsel Anda.",
    image:
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  {
    id: 2,
    title: "Pantau Status Laporan",
    description:
      "Lihat perkembangan laporan yang telah dikirim dan dapatkan informasi terbaru secara real-time.",
    image:
      "https://cdn-icons-png.flaticon.com/512/681/681494.png",
  },
  {
    id: 3,
    title: "Bersama Menjaga Lingkungan",
    description:
      "Mari berkontribusi menciptakan lingkungan yang lebih bersih, sehat, dan nyaman untuk semua.",
    image:
      "https://cdn-icons-png.flaticon.com/512/427/427735.png",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const slide = slides[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => setCurrentIndex(slides.length - 1)}
        >
          <Text style={styles.skipText}>Lewati</Text>
        </TouchableOpacity>
      )}

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: slide.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{slide.title}</Text>

        <Text style={styles.description}>
          {slide.description}
        </Text>

        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {currentIndex < slides.length - 1 ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={nextSlide}
          >
            <Text style={styles.primaryButtonText}>
              Selanjutnya
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.replace("/login")}
            >
              <Text style={styles.primaryButtonText}>
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.replace("/register")}
            >
              <Text style={styles.secondaryButtonText}>
                Daftar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF4",
  },

  skipButton: {
    alignSelf: "flex-end",
    marginTop: 20,
    marginRight: 20,
  },

  skipText: {
    color: "#22C55E",
    fontSize: 15,
    fontWeight: "600",
  },

  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: width * 0.75,
    height: 280,
  },

  content: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 25,
    paddingTop: 35,
    paddingBottom: 40,
    minHeight: 320,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#166534",
    textAlign: "center",
    marginBottom: 15,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 35,
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 35,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#BBF7D0",
    marginHorizontal: 5,
  },

  activeDot: {
    width: 28,
    backgroundColor: "#22C55E",
  },

  buttonContainer: {
    width: "100%",
  },

  primaryButton: {
    width: "100%",
    backgroundColor: "#22C55E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    width: "100%",
    marginTop: 12,
    borderWidth: 2,
    borderColor: "#22C55E",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#22C55E",
    fontSize: 16,
    fontWeight: "700",
  },
});