import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getApiBaseUrl } from "../apiConfig";
import {
  getAllLaporan,
  getLaporanDetail,
  toggleLikeLaporan,
} from "../services/laporanService";
import {
  createKomentar,
  deleteKomentar,
  getKomentarByLaporan,
} from "../services/komentarService";

const API_URL = getApiBaseUrl();

const buildUploadUrl = (path?: string | null) => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_URL}/uploads/${path}`;
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function DetailLaporanScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const laporanId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [laporan, setLaporan] = useState<any>(null);
  const [laporanSerupa, setLaporanSerupa] = useState<any[]>([]);
  const [komentar, setKomentar] = useState<any[]>([]);
  const [isiKomentar, setIsiKomentar] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const gambarUrl = useMemo(() => buildUploadUrl(laporan?.gambar), [laporan?.gambar]);

  const loadCurrentUser = async () => {
    try {
      const stored = await AsyncStorage.getItem("user");
      setCurrentUser(stored ? JSON.parse(stored) : null);
    } catch {
      setCurrentUser(null);
    }
  };

  const fetchKomentar = useCallback(async () => {
    if (!laporanId) return;
    const data = await getKomentarByLaporan(laporanId);
    setKomentar(data);
  }, [laporanId]);

  const fetchDetail = useCallback(async () => {
    if (!laporanId) return;

    const detail = await getLaporanDetail(laporanId);
    setLaporan(detail);

    const semuaLaporan = await getAllLaporan();
    const filtered = semuaLaporan.filter(
      (item: any) =>
        item.id !== detail.id && item.category_name === detail.category_name
    );
    setLaporanSerupa(filtered.slice(0, 4));
  }, [laporanId]);

  const loadData = useCallback(async () => {
    try {
      await Promise.all([fetchDetail(), fetchKomentar(), loadCurrentUser()]);
    } catch (error) {
      Alert.alert(
        "Gagal",
        error instanceof Error ? error.message : "Tidak dapat memuat laporan"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchDetail, fetchKomentar]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getToken = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Login diperlukan", "Silahkan login terlebih dahulu");
      return null;
    }
    return token;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleShare = async () => {
    if (!laporan) return;
    try {
      await Share.share({
        title: laporan.judul_laporan,
        message: `${laporan.judul_laporan}\n\n${laporan.isi_laporan}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    const token = await getToken();
    if (!token || !laporanId) return;

    try {
      setLoadingLike(true);
      const data = await toggleLikeLaporan(laporanId, token);
      setLaporan((prev: any) => ({
        ...prev,
        total_like: Math.max(
          0,
          (prev.total_like || 0) + (data.liked ? 1 : -1)
        ),
      }));
      Alert.alert("Berhasil", data.message || "Dukungan diperbarui");
    } catch (error) {
      Alert.alert(
        "Gagal",
        error instanceof Error ? error.message : "Gagal mendukung laporan"
      );
    } finally {
      setLoadingLike(false);
    }
  };

  const handleKirimKomentar = async () => {
    if (!isiKomentar.trim()) {
      Alert.alert("Peringatan", "Komentar tidak boleh kosong");
      return;
    }

    const token = await getToken();
    if (!token || !laporanId) return;

    try {
      setSendingComment(true);
      await createKomentar(laporanId, isiKomentar.trim(), token);
      await fetchKomentar();
      setLaporan((prev: any) => ({
        ...prev,
        total_komen: (prev.total_komen || 0) + 1,
      }));
      setIsiKomentar("");
      Alert.alert("Berhasil", "Komentar berhasil dikirim");
    } catch (error) {
      Alert.alert(
        "Gagal",
        error instanceof Error ? error.message : "Gagal mengirim komentar"
      );
    } finally {
      setSendingComment(false);
    }
  };

  const handleDeleteKomentar = async () => {
    const token = await getToken();
    if (!token || !selectedDeleteId) return;

    try {
      setDeletingCommentId(selectedDeleteId);
      await deleteKomentar(selectedDeleteId, token);
      await fetchKomentar();
      setLaporan((prev: any) => ({
        ...prev,
        total_komen: Math.max(0, (prev.total_komen || 0) - 1),
      }));
      setSelectedDeleteId(null);
      Alert.alert("Berhasil", "Komentar berhasil dihapus");
    } catch (error) {
      Alert.alert(
        "Gagal",
        error instanceof Error ? error.message : "Gagal menghapus komentar"
      );
    } finally {
      setDeletingCommentId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingPage}>
        <ActivityIndicator size="large" color="#0B6B2B" />
        <Text style={styles.loadingText}>Memuat laporan...</Text>
      </View>
    );
  }

  if (!laporan) {
    return (
      <View style={styles.loadingPage}>
        <Text style={styles.emptyTitle}>Laporan tidak ditemukan</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#0B6B2B"]}
            tintColor="#0B6B2B"
          />
        }
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <ArrowLeft size={22} color="#111" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Detail Laporan</Text>
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Share2 size={20} color="#111" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerCard}>
          <View style={styles.headerMetaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{laporan.category_name}</Text>
            </View>
            <View style={styles.dateRow}>
              <CalendarDays size={14} color="#666" />
              <Text style={styles.dateText}>{formatDate(laporan.created_at)}</Text>
            </View>
          </View>

          <Text style={styles.title}>{laporan.judul_laporan}</Text>

          <View style={styles.reporterCard}>
            <Avatar profile={laporan.profile} name={laporan.username} size={54} />
            <View>
              <Text style={styles.reporterLabel}>Dilaporkan Oleh</Text>
              <Text style={styles.reporterName}>{laporan.username || "Pengguna"}</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <MapPin size={18} color="#0B6B2B" />
            <Text style={styles.locationText}>{laporan.lokasi_kejadian}</Text>
          </View>
        </View>

        <View style={styles.imageFrame}>
          {gambarUrl ? (
            <Image source={{ uri: gambarUrl }} style={styles.mainImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>Tidak ada gambar</Text>
            </View>
          )}
        </View>

        <View style={styles.descriptionSection}>
          <View style={styles.descriptionHeader}>
            <View style={styles.whiteIconCircle}>
              <MessageCircle size={20} color="#005F18" />
            </View>
            <Text style={styles.descriptionTitle}>Detail Deskripsi Laporan</Text>
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{laporan.isi_laporan}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, loadingLike && styles.disabledButton]}
              onPress={handleLike}
              disabled={loadingLike}
            >
              {loadingLike ? (
                <ActivityIndicator color="#111" />
              ) : (
                <ThumbsUp size={18} color="#111" />
              )}
              <Text style={styles.actionButtonText}>
                Dukung ({laporan.total_like || 0})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Share2 size={18} color="#111" />
              <Text style={styles.actionButtonText}>Bagikan</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>Komentar ({laporan.total_komen || 0})</Text>

          <View style={styles.commentInputRow}>
            <Avatar
              profile={currentUser?.profile}
              name={currentUser?.username}
              size={48}
            />
            <View style={styles.inputWrap}>
              <TextInput
                value={isiKomentar}
                onChangeText={setIsiKomentar}
                placeholder="Tulis komentar..."
                placeholderTextColor="#999"
                multiline
                style={styles.commentInput}
              />
              <TouchableOpacity
                style={[styles.sendButton, sendingComment && styles.disabledButton]}
                onPress={handleKirimKomentar}
                disabled={sendingComment}
              >
                {sendingComment ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Send size={18} color="#fff" />
                    <Text style={styles.sendButtonText}>Kirim</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {komentar.length === 0 ? (
            <View style={styles.emptyCommentBox}>
              <Text style={styles.emptyText}>Belum ada komentar</Text>
            </View>
          ) : (
            komentar.map((item) => (
              <View key={item.id} style={styles.commentItem}>
                <Avatar profile={item.profile} name={item.username} size={48} />
                <View style={styles.commentBubble}>
                  <View style={styles.commentHeader}>
                    <View style={styles.commentNameWrap}>
                      <Text style={styles.commentName}>{item.username}</Text>
                      <Text style={styles.commentDate}>{formatDate(item.created_at)}</Text>
                    </View>
                    {currentUser?.id === item.user_id && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => setSelectedDeleteId(item.id)}
                      >
                        <Trash2 size={17} color="#D32F2F" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.commentText}>{item.isi_komentar}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {laporanSerupa.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.sectionTitle}>Laporan Serupa</Text>
            {laporanSerupa.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.relatedCard}
                onPress={() => router.push(`/detail-laporan/${item.id}`)}
              >
                {buildUploadUrl(item.gambar) ? (
                  <Image
                    source={{ uri: buildUploadUrl(item.gambar) as string }}
                    style={styles.relatedImage}
                  />
                ) : (
                  <View style={[styles.relatedImage, styles.imagePlaceholder]}>
                    <Text style={styles.smallPlaceholderText}>No image</Text>
                  </View>
                )}
                <View style={styles.relatedInfo}>
                  <Text style={styles.relatedTitle} numberOfLines={2}>
                    {item.judul_laporan}
                  </Text>
                  <View style={styles.relatedLocation}>
                    <MapPin size={12} color="#777" />
                    <Text style={styles.relatedLocationText} numberOfLines={1}>
                      {item.lokasi_kejadian}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.emergencyBox}>
          <Text style={styles.emergencyTitle}>Butuh Laporan Segera?</Text>
          <Text style={styles.emergencyText}>
            Hubungi layanan darurat lingkungan hidup.
          </Text>
          <TouchableOpacity style={styles.emergencyButton}>
            <Phone size={18} color="#111" />
            <Text style={styles.emergencyButtonText}>Hubungi Kami</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        transparent
        visible={selectedDeleteId !== null}
        animationType="fade"
        onRequestClose={() => setSelectedDeleteId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.warningCircle}>
                <AlertCircle size={22} color="#D32F2F" />
              </View>
              <Text style={styles.modalTitle}>Hapus Komentar?</Text>
            </View>
            <Text style={styles.modalText}>
              Apakah Anda yakin ingin menghapus komentar ini? Tindakan ini tidak
              dapat dibatalkan.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSelectedDeleteId(null)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmDeleteButton,
                  deletingCommentId !== null && styles.disabledButton,
                ]}
                onPress={handleDeleteKomentar}
                disabled={deletingCommentId !== null}
              >
                <Text style={styles.confirmDeleteText}>
                  {deletingCommentId ? "Menghapus..." : "Hapus"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function Avatar({
  profile,
  name,
  size,
}: {
  profile?: string | null;
  name?: string | null;
  size: number;
}) {
  const url = buildUploadUrl(profile);
  const initial = name?.charAt(0)?.toUpperCase() || "U";

  if (url) {
    return (
      <Image
        source={{ uri: url }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#E8F5E9",
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#0B6B2B",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={styles.avatarInitial}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  loadingPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    padding: 24,
  },
  loadingText: { marginTop: 12, color: "#222", fontWeight: "600" },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#111", marginBottom: 16 },
  topBar: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBarTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCard: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  headerMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  categoryBadge: {
    backgroundColor: "#DDEBDD",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    maxWidth: "58%",
  },
  categoryBadgeText: { color: "#0B6B2B", fontSize: 12, fontWeight: "700" },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  dateText: { fontSize: 12, color: "#666" },
  title: {
    fontSize: 23,
    lineHeight: 30,
    fontWeight: "800",
    color: "#111",
    marginTop: 16,
  },
  reporterCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    marginTop: 16,
  },
  reporterLabel: { fontSize: 12, color: "#777", fontWeight: "600" },
  reporterName: { fontSize: 15, color: "#111", fontWeight: "700", marginTop: 2 },
  locationRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 14 },
  locationText: { flex: 1, fontSize: 14, lineHeight: 20, color: "#222" },
  imageFrame: {
    height: 300,
    marginHorizontal: 16,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#E8E8E8",
  },
  mainImage: { width: "100%", height: "100%" },
  imagePlaceholder: { alignItems: "center", justifyContent: "center" },
  placeholderText: { color: "#999", fontWeight: "600" },
  smallPlaceholderText: { color: "#999", fontSize: 11 },
  descriptionSection: {
    margin: 16,
    backgroundColor: "#005F18",
    borderRadius: 18,
    padding: 16,
  },
  descriptionHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  whiteIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  descriptionTitle: { flex: 1, color: "#fff", fontSize: 18, fontWeight: "800" },
  descriptionBox: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
  },
  descriptionText: { color: "#fff", fontSize: 14, lineHeight: 22 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  actionButton: {
    flex: 1,
    minHeight: 48,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  actionButtonText: { color: "#111", fontWeight: "800", fontSize: 13 },
  disabledButton: { opacity: 0.65 },
  commentSection: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  sectionTitle: { fontSize: 19, fontWeight: "800", color: "#111", marginBottom: 14 },
  commentInputRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  inputWrap: { flex: 1 },
  commentInput: {
    minHeight: 108,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 14,
    padding: 12,
    color: "#111",
    fontSize: 14,
    textAlignVertical: "top",
  },
  sendButton: {
    alignSelf: "flex-end",
    marginTop: 10,
    minWidth: 112,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#005F18",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  sendButtonText: { color: "#fff", fontWeight: "800" },
  emptyCommentBox: { paddingVertical: 24, alignItems: "center" },
  emptyText: { color: "#777", fontWeight: "600" },
  commentItem: { flexDirection: "row", gap: 10, marginTop: 18, alignItems: "flex-start" },
  commentBubble: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 14,
    padding: 12,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  commentNameWrap: { flex: 1 },
  commentName: { color: "#111", fontWeight: "800", fontSize: 14 },
  commentDate: { color: "#777", fontSize: 12, marginTop: 2 },
  commentText: { color: "#222", fontSize: 14, lineHeight: 20, marginTop: 10 },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FDECEC",
    alignItems: "center",
    justifyContent: "center",
  },
  relatedSection: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
  },
  relatedCard: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
  },
  relatedImage: {
    width: 82,
    height: 82,
    borderRadius: 12,
    backgroundColor: "#E8E8E8",
  },
  relatedInfo: { flex: 1, justifyContent: "center" },
  relatedTitle: { fontSize: 14, fontWeight: "800", color: "#111", lineHeight: 19 },
  relatedLocation: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 },
  relatedLocationText: { flex: 1, fontSize: 12, color: "#777" },
  emergencyBox: {
    margin: 16,
    backgroundColor: "#5A8516",
    borderRadius: 18,
    padding: 18,
  },
  emergencyTitle: { color: "#fff", fontSize: 19, fontWeight: "800" },
  emergencyText: { color: "#fff", opacity: 0.9, marginTop: 8, lineHeight: 20 },
  emergencyButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  emergencyButtonText: { color: "#111", fontWeight: "800" },
  bottomSpacer: { height: 30 },
  avatarInitial: { color: "#fff", fontWeight: "800", fontSize: 18 },
  primaryButton: {
    backgroundColor: "#0B6B2B",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: { color: "#fff", fontWeight: "800" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.42)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
  },
  modalHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  warningCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FDECEC",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: { color: "#111", fontSize: 18, fontWeight: "800" },
  modalText: { color: "#666", marginTop: 14, lineHeight: 20 },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 18 },
  cancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: { color: "#111", fontWeight: "800" },
  confirmDeleteButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#D32F2F",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmDeleteText: { color: "#fff", fontWeight: "800" },
});
