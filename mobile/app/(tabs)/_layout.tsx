import { Tabs } from "expo-router";
import BottomTabBar from "@/components/BottomTabBar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={() => <BottomTabBar />}
    >
      <Tabs.Screen name="beranda" />
      <Tabs.Screen name="laporan" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}