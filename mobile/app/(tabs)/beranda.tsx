import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  Trash2,
  Trees,
  Recycle,
  ShieldAlert,
  Building2,
  Waves,
  Factory,
  ListFilter,
  ThumbsUp,
  MessageCircle,
} from "lucide-react-native";
import { getApiBaseUrl } from "../apiConfig";

export default function BerandaScreen() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [laporan, setLaporan] = useState<any[]>([]);
  const [kategori, setKategori] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // ICON KATEGORI
  // =========================
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Sampah":
        return "trash-2";
      case "Pencemaran":
        return "factory";
      case "Drainase & Banjir":
        return "waves";
      case "Penghijauan":
        return "trees";
      case "Limbah Berbahaya":
        return "alert-circle";
      case "Fasilitas Umum Lingkungan":
        return "building-2";
      case "Kebersihan Umum":
        return "recycle";
      default:
        return "list";
    }
  };

  // =========================
  // FETCH LAPORAN
  // =========================
  useEffect(() => {
    fetchLaporan();
    fetchKategori();
  }, []);

  const fetchLaporan = async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/laporan`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setLaporan(data);
      } else if (Array.isArray(data.data)) {
        setLaporan(data.data);
      }
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

      if (Array.isArray(data)) {
        setKategori(data);
      } else if (Array.isArray(data.data)) {
        setKategori(data.data);
      }
    } catch (error) {
      console.log("Error fetching kategori:", error);
    }
  };

  // =========================
  // FILTER LAPORAN
  // =========================
  let filteredLaporan =
    activeCategory === "Semua"
      ? laporan
      : laporan.filter((item) => item.category_name === activeCategory);

  // Sort by newest first
  filteredLaporan = [...filteredLaporan].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // =========================
  // RENDER CATEGORY ITEM
  // =========================
  const renderCategoryItem = (item: any) => {
    const isActive = activeCategory === item.category_name;
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.categoryButton,
          isActive && styles.categoryButtonActive,
        ]}
        onPress={() => setActiveCategory(item.category_name)}
      >
        <Text
          style={[
            styles.categoryButtonText,
            isActive && styles.categoryButtonTextActive,
          ]}
        >
          {item.category_name}
        </Text>
      </TouchableOpacity>
    );
  };

  const categoryRows = [[], []] as any[];
  const allCategoryItems = [
    { id: "semua", category_name: "Semua" },
    ...kategori,
  ];
  allCategoryItems.forEach((item, index) => {
    categoryRows[index % 2].push(item);
  });

  // =========================
  // RENDER LAPORAN ITEM
  // =========================
  const renderLaporanItem = ({ item }: { item: any }) => {
    const date = new Date(item.created_at).toLocaleDateString("id-ID");
    return (
      <View style={styles.laporanCard}>
        {/* Image */}
        {item.gambar ? (
          <Image
            source={{
              uri: `${getApiBaseUrl()}/uploads/${item.gambar}`,
            }}
            style={styles.laporanImage}
          />
        ) : (
          <View style={[styles.laporanImage, styles.imagePlaceholder]}>
            <Text style={styles.placeholderText}>Tidak ada gambar</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.laporanContent}>
          {/* Category & Date */}
          <View style={styles.categoryDateRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{item.category_name}</Text>
            </View>
            <Text style={styles.dateText}>{date}</Text>
          </View>

          {/* Title */}
          <Text style={styles.laporanTitle}>{item.judul_laporan}</Text>

          {/* Location */}
          <Text style={styles.laporanLocation}>{item.lokasi_kejadian}</Text>

          {/* Username */}
          <Text style={styles.laporanUsername}>
            Dilaporkan oleh {item.username}
          </Text>

          {/* Description */}
          <Text
            style={styles.laporanDescription}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.isi_laporan}
          </Text>

          {/* Footer: Like & Comment */}
          <View style={styles.laporanFooter}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>👍</Text>
                <Text style={styles.statText}>{item.total_like || 0}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>💬</Text>
                <Text style={styles.statText}>{item.total_komen || 0}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.detailButton}>
              <Text style={styles.detailButtonText}>Lihat Detail →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Laporan Terkini</Text>
        <Text style={styles.headerSubtitle}>
          Pantau perbaikan lingkungan sekitar
        </Text>
      </View>

      {/* Category Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
      >
        <View style={styles.categoryRowContainer}>
          <View style={styles.categoryRow}>
            {categoryRows[0].map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.categoryButton,
                  activeCategory === item.category_name &&
                    styles.categoryButtonActive,
                ]}
                onPress={() => setActiveCategory(item.category_name)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    activeCategory === item.category_name &&
                      styles.categoryButtonTextActive,
                  ]}
                >
                  {item.category_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.categoryRow}>
            {categoryRows[1].map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.categoryButton,
                  activeCategory === item.category_name &&
                    styles.categoryButtonActive,
                ]}
                onPress={() => setActiveCategory(item.category_name)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    activeCategory === item.category_name &&
                      styles.categoryButtonTextActive,
                  ]}
                >
                  {item.category_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Laporan List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0B6B2B" />
        </View>
      ) : filteredLaporan.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Belum ada laporan</Text>
        </View>
      ) : (
        <FlatList
          data={filteredLaporan}
          renderItem={renderLaporanItem}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={false}
          contentContainerStyle={styles.laporanListContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
  },

  categoryScroll: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  categoryScrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },

  categoryRowContainer: {
    flexDirection: "column",
    gap: 8,
  },

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  categoryButtonActive: {
    backgroundColor: "#B8CBB8",
    borderColor: "#0B6B2B",
  },

  categoryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0B6B2B",
  },

  categoryButtonTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    color: "#999",
  },

  laporanListContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
  },

  laporanCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  laporanImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: "#ccc",
    fontSize: 14,
  },

  laporanContent: {
    padding: 12,
  },

  categoryDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  categoryBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#0B6B2B",
  },

  dateText: {
    fontSize: 11,
    color: "#999",
  },

  laporanTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
  },

  laporanLocation: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },

  laporanUsername: {
    fontSize: 12,
    color: "#0B6B2B",
    fontWeight: "600",
    marginBottom: 6,
  },

  laporanDescription: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
    marginBottom: 10,
  },

  laporanFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e8e8e8",
  },

  statsRow: {
    flexDirection: "row",
    gap: 16,
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  statIcon: {
    fontSize: 14,
  },

  statText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },

  detailButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  detailButtonText: {
    fontSize: 12,
    color: "#0B6B2B",
    fontWeight: "600",
  },
});
