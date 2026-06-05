import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, usePathname } from "expo-router";

type Tab = {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  route: string;
};

const TABS: Tab[] = [
  {
    label: "Beranda",
    icon: "home",
    route: "/(tabs)/beranda",
  },
  {
    label: "Laporan",
    icon: "add-circle",
    route: "/(tabs)/laporan",
  },
  {
    label: "Profil",
    icon: "person",
    route: "/(tabs)/profile",
  },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  const isActive = (route: string) => {
    const segment = route.split("/").pop();
    if (segment === "index") return pathname === "/" || pathname === "/index";
    return pathname.includes(segment ?? "");
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {TABS.map((tab) => {
          const active = isActive(tab.route);

          // Tab tengah (Laporan) special style
          if (tab.icon === "add-circle") {
            return (
              <TouchableOpacity
                key={tab.route}
                style={styles.tabItem}
                onPress={() => router.replace(tab.route as any)}
                activeOpacity={0.8}
              >
                <View style={styles.fabButton}>
                  <MaterialIcons name="add" size={28} color="#fff" />
                </View>
                <Text style={[styles.label, active && styles.labelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.route}
              style={styles.tabItem}
              onPress={() => router.replace(tab.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                <MaterialIcons
                  name={tab.icon}
                  size={22}
                  color={active ? "#fff" : "#999"}
                />
              </View>
              <Text style={[styles.label, active && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    backgroundColor: "transparent",
  },

  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },

  iconWrap: {
    width: 38,
    height: 38,
    minWidth: 38,
    maxWidth: 38,
    minHeight: 38,
    maxHeight: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  iconWrapActive: {
    backgroundColor: "#1b5e20",
  },

  fabButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1b5e20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    shadowColor: "#1b5e20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  label: {
    fontSize: 10,
    color: "#999",
    fontWeight: "500",
  },

  labelActive: {
    color: "#1b5e20",
    fontWeight: "700",
  },
});
