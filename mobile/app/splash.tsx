import React, { useEffect, useRef } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
} from "react-native";

export default function SplashScreen() {
  const circleTranslateY = useRef(new Animated.Value(-500)).current;
  const circleScale = useRef(new Animated.Value(0)).current;

  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  const textTranslateY = useRef(new Animated.Value(40)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(circleTranslateY, {
          toValue: 0,
          friction: 7,
          useNativeDriver: true,
        }),

        Animated.spring(circleScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),

        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.spring(textTranslateY, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),

        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      try {
        router.replace("/(auth)/login");
      } catch (e) {
        try {
          router.push("/(auth)/login");
        } catch {}
      }
    });

    const animateDots = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(dot1, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot2, {
              toValue: 0.3,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot3, {
              toValue: 0.3,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),

          Animated.parallel([
            Animated.timing(dot1, {
              toValue: 0.3,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot2, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),

          Animated.parallel([
            Animated.timing(dot2, {
              toValue: 0.3,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot3, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    animateDots();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Circle */}
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [
              { translateY: circleTranslateY },
              { scale: circleScale },
            ],
          },
        ]}
      />

      {/* Logo */}
      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
        }}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Text */}
      <Animated.View
        style={{
          opacity: textOpacity,
          transform: [{ translateY: textTranslateY }],
        }}
      >
        <Text style={styles.title}>LAPOR</Text>
        <Text style={styles.subtitle}>LINGKUNGAN</Text>
      </Animated.View>

      {/* Loading Dots */}
      <View style={styles.loadingContainer}>
        <Animated.View
          style={[styles.dot, { opacity: dot1 }]}
        />
        <Animated.View
          style={[styles.dot, { opacity: dot2 }]}
        />
        <Animated.View
          style={[styles.dot, { opacity: dot3 }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B4F26",
    justifyContent: "center",
    alignItems: "center",
  },

  circle: {
    position: "absolute",
    top: -120,
    width: 450,
    height: 450,
    borderRadius: 225,
    backgroundColor: "#cfebd9ff",
    opacity: 0.15,
  },

  logo: {
    width: 180,
    height: 180,
  },

  title: {
    marginTop: 20,
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 4,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#D1FAE5",
    textAlign: "center",
    letterSpacing: 6,
    marginTop: 5,
  },

  loadingContainer: {
    flexDirection: "row",
    marginTop: 45,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 6,
  },
});