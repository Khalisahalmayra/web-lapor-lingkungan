import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
} from "react-native";
import {
  Trash2,
  Trees,
  Recycle,
  AlertCircle,
  Building2,
  Waves,
  Factory,
  ThumbsUp,
  MessageCircle,
  Search,
  Bell,
  MapPin,
  TrendingUp,
  Clock,
  ChevronRight,
} from "lucide-react-native";
import { getApiBaseUrl } from "../apiConfig";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SortType = "terbaru" | "terpopuler";

export default function BerandaScreen() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [sortType, setSortType] = useState<SortType>("terbaru");
  const [laporan, setLaporan] = useState<any[]>([]);
  const [kategori, setKategori] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLaporan();
    fetchKategori();
    loadUser();
  }, []);

  const loadUser = async () => {
  try {
    const storedUser = await AsyncStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  } catch (error) {
    console.log("Error load user:", error);
  }
};

  const fetchLaporan = async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/laporan`);
      const data = await res.json();
      if (Array.isArray(data)) setLaporan(data);
      else if (Array.isArray(data.data)) setLaporan(data.data);
    } catch (error) {
      console.log("Error fetching laporan:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKategori = async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/kategori`);
      const data = await res.json();
      if (Array.isArray(data)) setKategori(data);
      else if (Array.isArray(data.data)) setKategori(data.data);
    } catch (error) {
      console.log("Error fetching kategori:", error);
    }
  };

  const getCategoryIconComponent = (name: string, size = 16, color = "#0B6B2B") => {
    switch (name) {
      case "Sampah": return <Trash2 size={size} color={color} />;
      case "Pencemaran": return <Factory size={size} color={color} />;
      case "Drainase & Banjir": return <Waves size={size} color={color} />;
      case "Penghijauan": return <Trees size={size} color={color} />;
      case "Limbah Berbahaya": return <AlertCircle size={size} color={color} />;
      case "Fasilitas Umum Lingkungan": return <Building2 size={size} color={color} />;
      case "Kebersihan Umum": return <Recycle size={size} color={color} />;
      default: return null;
    }
  };

  const allCategoryItems = [{ id: "semua", category_name: "Semua" }, ...kategori];

  // Featured: 3 laporan terpopuler
  const featuredLaporan = [...laporan]
    .sort((a, b) => (b.total_like || 0) - (a.total_like || 0))
    .slice(0, 3);

  // Stats
  const totalLaporan = laporan.length;
  const totalSelesai = laporan.filter((l) => l.status === "selesai").length;

  // Filter + sort
  let filteredLaporan = activeCategory === "Semua"
    ? laporan
    : laporan.filter((item) => item.category_name === activeCategory);

  if (searchQuery.trim()) {
    filteredLaporan = filteredLaporan.filter(
      (item) =>
        item.judul_laporan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lokasi_kejadian?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (sortType === "terbaru") {
    filteredLaporan = [...filteredLaporan].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } else {
    filteredLaporan = [...filteredLaporan].sort(
      (a, b) => (b.total_like || 0) - (a.total_like || 0)
    );
  }

  const renderLaporanCard = (item: any) => {
    const date = new Date(item.created_at).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
    });
    return (
      <View key={item.id} style={styles.laporanCard}>
        {item.gambar ? (
          <Image
            source={{ uri: `${getApiBaseUrl()}/uploads/${item.gambar}` }}
            style={styles.laporanImage}
          />
        ) : (
          <View style={[styles.laporanImage, styles.imagePlaceholder]}>
            <Text style={styles.placeholderText}>Tidak ada gambar</Text>
          </View>
        )}

        <View style={styles.laporanContent}>
          <View style={styles.categoryDateRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{item.category_name}</Text>
            </View>
            <Text style={styles.dateText}>{date}</Text>
          </View>

          <Text style={styles.laporanTitle}>{item.judul_laporan}</Text>

          <View style={styles.locationRow}>
            <MapPin size={12} color="#999" />
            <Text style={styles.laporanLocation}>{item.lokasi_kejadian}</Text>
          </View>

          <Text style={styles.laporanUsername}>Dilaporkan oleh {item.username}</Text>

          <Text style={styles.laporanDescription} numberOfLines={2} ellipsizeMode="tail">
            {item.isi_laporan}
          </Text>

          <View style={styles.laporanFooter}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <ThumbsUp size={14} color="#666" />
                <Text style={styles.statText}>{item.total_like || 0}</Text>
              </View>
              <View style={styles.statItem}>
                <MessageCircle size={14} color="#666" />
                <Text style={styles.statText}>{item.total_komen || 0}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => router.push(`/detail-laporan/${item.id}`)}
            >
              <Text style={styles.detailButtonText}>Lihat Detail</Text>
              <ChevronRight size={12} color="#0B6B2B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View>
        <Text style={styles.headerGreeting}>
            Selamat Datang 👋
          </Text>

          <Text style={styles.headerName}>
            {user?.username || "Pengguna"}
          </Text>
          <Text style={styles.headerTitle}>Lapor Lingkungan</Text>
        </View>
        <TouchableOpacity style={styles.bellButton}>
          <Bell size={22} color="#0B6B2B" />
        </TouchableOpacity>
      </View>

      {/* ── SEARCH ── */}
      <View style={styles.searchContainer}>
        <Search size={16} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari laporan atau lokasi..."
          placeholderTextColor="#bbb"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* ── STATS BANNER ── */}
      <View style={styles.statsBanner}>
        <View style={styles.statsBannerItem}>
          <Text style={styles.statsBannerNumber}>{totalLaporan}</Text>
          <Text style={styles.statsBannerLabel}>Total Laporan</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsBannerItem}>
          <Text style={styles.statsBannerNumber}>{totalSelesai}</Text>
          <Text style={styles.statsBannerLabel}>Ditangani</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsBannerItem}>
          <Text style={styles.statsBannerNumber}>{kategori.length}</Text>
          <Text style={styles.statsBannerLabel}>Kategori</Text>
        </View>
      </View>

      {/* ── FEATURED / TERPOPULER ── */}
      {featuredLaporan.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={16} color="#0B6B2B" />
            <Text style={styles.sectionTitle}>Sedang Viral</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {featuredLaporan.map((item) => {
              const date = new Date(item.created_at).toLocaleDateString("id-ID", {
                day: "numeric", month: "short",
              });
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.featuredCard}
                  onPress={() => router.push(`/detail-laporan/${item.id}`)}
                >
                  {item.gambar ? (
                    <Image
                      source={{ uri: `${getApiBaseUrl()}/uploads/${item.gambar}` }}
                      style={styles.featuredImage}
                    />
                  ) : (
                    <View style={[styles.featuredImage, styles.imagePlaceholder]}>
                      <Text style={styles.placeholderText}>No Image</Text>
                    </View>
                  )}
                  <View style={styles.featuredOverlay}>
                    <View style={styles.featuredBadge}>
                      <Text style={styles.featuredBadgeText}>{item.category_name}</Text>
                    </View>
                    <Text style={styles.featuredTitle} numberOfLines={2}>
                      {item.judul_laporan}
                    </Text>
                    <View style={styles.featuredStats}>
                      <ThumbsUp size={12} color="#fff" />
                      <Text style={styles.featuredStatText}>{item.total_like || 0}</Text>
                      <MessageCircle size={12} color="#fff" style={{ marginLeft: 8 }} />
                      <Text style={styles.featuredStatText}>{item.total_komen || 0}</Text>
                      <Text style={styles.featuredDate}>{date}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* ── KATEGORI ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kategori</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {allCategoryItems.map((item: any) => {
            const isActive = activeCategory === item.category_name;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.categoryButton, isActive && styles.categoryButtonActive]}
                onPress={() => setActiveCategory(item.category_name)}
              >
                {item.category_name !== "Semua" && (
                  <View style={styles.categoryIconWrapper}>
                    {getCategoryIconComponent(item.category_name, 14, isActive ? "#fff" : "#0B6B2B")}
                  </View>
                )}
                <Text style={[styles.categoryButtonText, isActive && styles.categoryButtonTextActive]}>
                  {item.category_name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── LAPORAN LIST ── */}
      <View style={styles.section}>
        {/* Sort Toggle */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Semua Laporan</Text>
          <View style={styles.sortToggle}>
            <TouchableOpacity
              style={[styles.sortButton, sortType === "terbaru" && styles.sortButtonActive]}
              onPress={() => setSortType("terbaru")}
            >
              <Clock size={12} color={sortType === "terbaru" ? "#fff" : "#0B6B2B"} />
              <Text style={[styles.sortButtonText, sortType === "terbaru" && styles.sortButtonTextActive]}>
                Terbaru
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortType === "terpopuler" && styles.sortButtonActive]}
              onPress={() => setSortType("terpopuler")}
            >
              <TrendingUp size={12} color={sortType === "terpopuler" ? "#fff" : "#0B6B2B"} />
              <Text style={[styles.sortButtonText, sortType === "terpopuler" && styles.sortButtonTextActive]}>
                Terpopuler
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0B6B2B" />
          </View>
        ) : filteredLaporan.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada laporan</Text>
          </View>
        ) : (
          <View style={styles.laporanListContent}>
            {filteredLaporan.map((item) => renderLaporanCard(item))}
          </View>
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  headerGreeting: { fontSize: 13, color: "#999" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#0B6B2B" },
  bellButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#E8F5E9",
    justifyContent: "center", alignItems: "center",
  },
  headerName: {
  fontSize: 22,
  fontWeight: "700",
  color: "#0B6B2B",
  marginTop: 2,
},

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: "#222" },

  // Stats Banner
  statsBanner: {
    flexDirection: "row",
    backgroundColor: "#0B6B2B",
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 4,
  },
  statsBannerItem: { flex: 1, alignItems: "center" },
  statsBannerNumber: { fontSize: 22, fontWeight: "700", color: "#fff" },
  statsBannerLabel: { fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  statsDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },

  // Section
  section: { marginTop: 16, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111" },

  // Featured
  featuredScroll: { gap: 12, paddingBottom: 4 },
  featuredCard: {
    width: 220, height: 150, borderRadius: 14,
    overflow: "hidden", backgroundColor: "#e0e0e0",
  },
  featuredImage: { width: "100%", height: "100%" },
  featuredOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  featuredBadge: {
    backgroundColor: "#0B6B2B", alignSelf: "flex-start",
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginBottom: 4,
  },
  featuredBadgeText: { fontSize: 10, color: "#fff", fontWeight: "600" },
  featuredTitle: { fontSize: 13, fontWeight: "700", color: "#fff", marginBottom: 6 },
  featuredStats: { flexDirection: "row", alignItems: "center", gap: 4 },
  featuredStatText: { fontSize: 11, color: "#fff" },
  featuredDate: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginLeft: "auto" },

  // Category
  categoryScrollContent: { gap: 8, paddingBottom: 4 },
  categoryButton: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd",
    flexDirection: "row", alignItems: "center", gap: 6,
  },
  categoryButtonActive: { backgroundColor: "#0B6B2B", borderColor: "#0B6B2B" },
  categoryButtonText: { fontSize: 13, fontWeight: "600", color: "#0B6B2B" },
  categoryButtonTextActive: { color: "#fff" },
  categoryIconWrapper: { justifyContent: "center", alignItems: "center" },

  // Sort toggle
  listHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 12,
  },
  sortToggle: {
    flexDirection: "row", backgroundColor: "#f0f0f0",
    borderRadius: 20, padding: 3, gap: 2,
  },
  sortButton: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16,
  },
  sortButtonActive: { backgroundColor: "#0B6B2B" },
  sortButtonText: { fontSize: 12, fontWeight: "600", color: "#0B6B2B" },
  sortButtonTextActive: { color: "#fff" },

  // Laporan
  loadingContainer: { justifyContent: "center", alignItems: "center", paddingVertical: 40 },
  emptyContainer: { justifyContent: "center", alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 14, color: "#bbb" },
  laporanListContent: { gap: 12, paddingBottom: 100 },

  laporanCard: {
    backgroundColor: "#fff", borderRadius: 14,
    overflow: "hidden", borderWidth: 1, borderColor: "#f0f0f0",
  },
  laporanImage: { width: "100%", height: 190, backgroundColor: "#f0f0f0" },
  imagePlaceholder: { justifyContent: "center", alignItems: "center" },
  placeholderText: { color: "#ccc", fontSize: 13 },
  laporanContent: { padding: 12 },
  categoryDateRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: "#E8F5E9", paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 10,
  },
  categoryBadgeText: { fontSize: 11, fontWeight: "600", color: "#0B6B2B" },
  dateText: { fontSize: 11, color: "#bbb" },
  laporanTitle: { fontSize: 15, fontWeight: "700", color: "#111", marginBottom: 6 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 4 },
  laporanLocation: { fontSize: 12, color: "#999" },
  laporanUsername: { fontSize: 12, color: "#0B6B2B", fontWeight: "600", marginBottom: 6 },
  laporanDescription: { fontSize: 13, color: "#555", lineHeight: 18, marginBottom: 10 },
  laporanFooter: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingTop: 8,
    borderTopWidth: 1, borderTopColor: "#f0f0f0",
  },
  statsRow: { flexDirection: "row", gap: 14 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontSize: 12, color: "#666", fontWeight: "600" },
  detailButton: { flexDirection: "row", alignItems: "center", gap: 2 },
  detailButtonText: { fontSize: 12, color: "#0B6B2B", fontWeight: "600" },
});