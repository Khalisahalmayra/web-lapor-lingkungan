import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
  Users,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  Share,
  StatusBar,
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
  updateKomentar, // ← tambahkan ini di komentarService
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

const getStatusStyle = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "selesai":   return { bg: "#D1FAE5", text: "#065F46" };
    case "diproses":  return { bg: "#FEF3C7", text: "#92400E" };
    case "ditolak":   return { bg: "#FEE2E2", text: "#991B1B" };
    default:          return { bg: "#DBEAFE", text: "#1E40AF" };
  }
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
  const [imageError, setImageError] = useState(false);

  // ── EDIT STATE ─────────────────────────────────────────────
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editIsiKomentar, setEditIsiKomentar] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  // ───────────────────────────────────────────────────────────

  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const gambarUrl = useMemo(() => buildUploadUrl(laporan?.gambar), [laporan?.gambar]);

  useEffect(() => {
    if (!loading && laporan) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, laporan]);

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
      (item: any) => item.id !== detail.id && item.category_name === detail.category_name
    );
    setLaporanSerupa(filtered.slice(0, 4));
  }, [laporanId]);

  const loadData = useCallback(async () => {
    try {
      await Promise.all([fetchDetail(), fetchKomentar(), loadCurrentUser()]);
    } catch (error) {
      Alert.alert("Gagal", error instanceof Error ? error.message : "Tidak dapat memuat laporan");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchDetail, fetchKomentar]);

  useEffect(() => { loadData(); }, [loadData]);

  const getToken = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Login diperlukan", "Silahkan login terlebih dahulu");
      return null;
    }
    return token;
  };

  const handleRefresh = () => { setRefreshing(true); loadData(); };

  const handleShare = async () => {
    if (!laporan) return;
    try {
      await Share.share({ title: laporan.judul_laporan, message: `${laporan.judul_laporan}\n\n${laporan.isi_laporan}` });
    } catch (error) { console.log(error); }
  };

  const handleLike = async () => {
    const token = await getToken();
    if (!token || !laporanId) return;
    try {
      setLoadingLike(true);
      const data = await toggleLikeLaporan(laporanId, token);
      setLaporan((prev: any) => ({
        ...prev,
        total_like: Math.max(0, (prev.total_like || 0) + (data.liked ? 1 : -1)),
      }));
      Alert.alert("Berhasil", data.message || "Dukungan diperbarui");
    } catch (error) {
      Alert.alert("Gagal", error instanceof Error ? error.message : "Gagal mendukung laporan");
    } finally { setLoadingLike(false); }
  };

  const handleKirimKomentar = async () => {
    if (!isiKomentar.trim()) { Alert.alert("Peringatan", "Komentar tidak boleh kosong"); return; }
    const token = await getToken();
    if (!token || !laporanId) return;
    try {
      setSendingComment(true);
      await createKomentar(laporanId, isiKomentar.trim(), token);
      await fetchKomentar();
      setLaporan((prev: any) => ({ ...prev, total_komen: (prev.total_komen || 0) + 1 }));
      setIsiKomentar("");
      Alert.alert("Berhasil", "Komentar berhasil dikirim");
    } catch (error) {
      Alert.alert("Gagal", error instanceof Error ? error.message : "Gagal mengirim komentar");
    } finally { setSendingComment(false); }
  };

  const handleDeleteKomentar = async () => {
    const token = await getToken();
    if (!token || !selectedDeleteId) return;
    try {
      setDeletingCommentId(selectedDeleteId);
      await deleteKomentar(selectedDeleteId, token);
      await fetchKomentar();
      setLaporan((prev: any) => ({ ...prev, total_komen: Math.max(0, (prev.total_komen || 0) - 1) }));
      setSelectedDeleteId(null);
      Alert.alert("Berhasil", "Komentar berhasil dihapus");
    } catch (error) {
      Alert.alert("Gagal", error instanceof Error ? error.message : "Gagal menghapus komentar");
    } finally { setDeletingCommentId(null); }
  };

  // =====================================
  // EDIT KOMENTAR
  // =====================================
  const handleStartEdit = (item: any) => {
    setEditingCommentId(item.id);
    setEditIsiKomentar(item.isi_komentar);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditIsiKomentar("");
  };

  const handleSaveEdit = async (komentarId: number) => {
    if (!editIsiKomentar.trim()) {
      Alert.alert("Peringatan", "Komentar tidak boleh kosong");
      return;
    }
    const token = await getToken();
    if (!token) return;
    try {
      setSavingEdit(true);
      await updateKomentar(komentarId, editIsiKomentar.trim(), token);
      await fetchKomentar();
      setEditingCommentId(null);
      setEditIsiKomentar("");
      Alert.alert("Berhasil", "Komentar berhasil diperbarui");
    } catch (error) {
      Alert.alert("Gagal", error instanceof Error ? error.message : "Gagal memperbarui komentar");
    } finally { setSavingEdit(false); }
  };

  if (loading) {
    return (
      <View style={styles.loadingPage}>
        <StatusBar barStyle="dark-content" backgroundColor="#F7F9F7" />
        <View style={styles.loadingSpinner}>
          <ActivityIndicator size="large" color="#0B6B2B" />
        </View>
        <Text style={styles.loadingTitle}>Memuat laporan</Text>
        <Text style={styles.loadingSubtitle}>Mohon tunggu sebentar...</Text>
      </View>
    );
  }

  if (!laporan) {
    return (
      <View style={styles.loadingPage}>
        <View style={styles.notFoundIcon}>
          <AlertCircle size={40} color="#0B6B2B" />
        </View>
        <Text style={styles.emptyTitle}>Laporan tidak ditemukan</Text>
        <Text style={styles.emptySubtitle}>Laporan mungkin telah dihapus atau tidak tersedia</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
          <ArrowLeft size={16} color="#fff" />
          <Text style={styles.primaryButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusStyle = getStatusStyle(laporan.status);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Navigation */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Detail Laporan</Text>
        <TouchableOpacity style={styles.navButton} onPress={handleShare}>
          <Share2 size={18} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#0B6B2B"]} tintColor="#0B6B2B" />
        }
      >
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* Hero Image */}
          <View style={styles.heroImageContainer}>
            {gambarUrl && !imageError ? (
              <Image source={{ uri: gambarUrl }} style={styles.heroImage} onError={() => setImageError(true)} />
            ) : (
              <View style={styles.heroImagePlaceholder}>
                <View style={styles.placeholderIconBg}>
                  <MessageCircle size={36} color="#0B6B2B" />
                </View>
                <Text style={styles.placeholderLabel}>Tidak ada gambar</Text>
              </View>
            )}
          </View>

          {/* Main Info Card */}
          <View style={styles.mainCard}>
            <View style={styles.mainBadgeRow}>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>{laporan.category_name}</Text>
              </View>
              {laporan.status && (
                <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusPillText, { color: statusStyle.text }]}>{laporan.status}</Text>
                </View>
              )}
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <CalendarDays size={13} color="#6B7280" />
                <Text style={styles.metaText}>{formatDate(laporan.created_at)}</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <ThumbsUp size={13} color="#6B7280" />
                <Text style={styles.metaText}>{laporan.total_like || 0} dukungan</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <MessageCircle size={13} color="#6B7280" />
                <Text style={styles.metaText}>{laporan.total_komen || 0} komentar</Text>
              </View>
            </View>

            <Text style={styles.reportTitle}>{laporan.judul_laporan}</Text>

            <View style={styles.locationChip}>
              <MapPin size={15} color="#0B6B2B" />
              <Text style={styles.locationChipText}>{laporan.lokasi_kejadian}</Text>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.reporterRow}>
              <Avatar profile={laporan.profile} name={laporan.username} size={46} />
              <View style={styles.reporterInfo}>
                <Text style={styles.reporterLabel}>Dilaporkan oleh</Text>
                <Text style={styles.reporterName}>{laporan.username || "Pengguna"}</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.likeButton, loadingLike && styles.disabledButton]}
                onPress={handleLike}
                disabled={loadingLike}
                activeOpacity={0.75}
              >
                {loadingLike ? (
                  <ActivityIndicator size="small" color="#0B6B2B" />
                ) : (
                  <ThumbsUp size={17} color="#0B6B2B" />
                )}
                <Text style={styles.likeButtonText}>
                  Dukung {laporan.total_like > 0 ? `(${laporan.total_like})` : ""}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.75}>
                <Share2 size={17} color="#374151" />
                <Text style={styles.shareButtonText}>Bagikan</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.descSection}>
            <View style={styles.descHeader}>
              <View style={styles.descIconWrap}>
                <MessageCircle size={18} color="#fff" />
              </View>
              <Text style={styles.descHeaderTitle}>Deskripsi Laporan</Text>
            </View>
            <Text style={styles.descBody}>{laporan.isi_laporan}</Text>
          </View>

          {/* Comments Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Komentar</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{laporan.total_komen || 0}</Text>
              </View>
            </View>

            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
              <Avatar profile={currentUser?.profile} name={currentUser?.username} size={40} />
              <View style={styles.inputBox}>
                <TextInput
                  value={isiKomentar}
                  onChangeText={setIsiKomentar}
                  placeholder="Tulis komentar Anda..."
                  placeholderTextColor="#A0AEC0"
                  multiline
                  style={styles.commentInput}
                />
                <TouchableOpacity
                  style={[styles.sendBtn, sendingComment && styles.disabledButton]}
                  onPress={handleKirimKomentar}
                  disabled={sendingComment}
                  activeOpacity={0.8}
                >
                  {sendingComment ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Send size={15} color="#fff" />
                      <Text style={styles.sendBtnText}>Kirim</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Comment List */}
            {komentar.length === 0 ? (
              <View style={styles.emptyComments}>
                <Users size={28} color="#CBD5E0" />
                <Text style={styles.emptyCommentsText}>Belum ada komentar</Text>
                <Text style={styles.emptyCommentsSubtext}>Jadilah yang pertama berkomentar</Text>
              </View>
            ) : (
              komentar.map((item, index) => (
                <View key={item.id} style={[styles.commentItem, index === 0 && styles.firstCommentItem]}>
                  <Avatar profile={item.profile} name={item.username} size={40} />
                  <View style={styles.commentContent}>

                    {/* Header row: nama, tanggal, tombol aksi */}
                    <View style={styles.commentTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.commenterName}>{item.username}</Text>
                        <Text style={styles.commentDate}>{formatDate(item.created_at)}</Text>
                      </View>

                      {/* Tombol Edit & Hapus — hanya untuk pemilik komentar, sembunyikan saat mode edit */}
                      {currentUser?.id === item.user_id && editingCommentId !== item.id && (
                        <View style={styles.commentActionBtns}>
                          <TouchableOpacity
                            style={styles.editBtn}
                            onPress={() => handleStartEdit(item)}
                          >
                            <Pencil size={14} color="#3B82F6" />
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={() => setSelectedDeleteId(item.id)}
                          >
                            <Trash2 size={14} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    {/* MODE EDIT */}
                    {editingCommentId === item.id ? (
                      <View style={styles.editContainer}>
                        <TextInput
                          value={editIsiKomentar}
                          onChangeText={setEditIsiKomentar}
                          multiline
                          autoFocus
                          style={styles.editInput}
                          placeholderTextColor="#A0AEC0"
                        />
                        <View style={styles.editActionRow}>
                          <TouchableOpacity
                            style={styles.cancelEditBtn}
                            onPress={handleCancelEdit}
                          >
                            <X size={14} color="#6B7280" />
                            <Text style={styles.cancelEditText}>Batal</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.saveEditBtn, savingEdit && styles.disabledButton]}
                            onPress={() => handleSaveEdit(item.id)}
                            disabled={savingEdit}
                          >
                            {savingEdit ? (
                              <ActivityIndicator size="small" color="#fff" />
                            ) : (
                              <>
                                <Check size={14} color="#fff" />
                                <Text style={styles.saveEditText}>Simpan</Text>
                              </>
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <Text style={styles.commentText}>{item.isi_komentar}</Text>
                    )}

                  </View>
                </View>
              ))
            )}
          </View>

          {/* Related Reports */}
          {laporanSerupa.length > 0 && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Laporan Serupa</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{laporanSerupa.length}</Text>
                </View>
              </View>
              {laporanSerupa.map((item) => {
                const imgUrl = buildUploadUrl(item.gambar);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.relatedCard}
                    onPress={() => router.push(`/detail-laporan/${item.id}`)}
                    activeOpacity={0.75}
                  >
                    {imgUrl ? (
                      <Image source={{ uri: imgUrl }} style={styles.relatedImg} />
                    ) : (
                      <View style={[styles.relatedImg, styles.relatedImgPlaceholder]}>
                        <MessageCircle size={18} color="#9CA3AF" />
                      </View>
                    )}
                    <View style={styles.relatedCardInfo}>
                      <Text style={styles.relatedCardTitle} numberOfLines={2}>{item.judul_laporan}</Text>
                      <View style={styles.relatedLocationRow}>
                        <MapPin size={11} color="#9CA3AF" />
                        <Text style={styles.relatedLocationText} numberOfLines={1}>{item.lokasi_kejadian}</Text>
                      </View>
                    </View>
                    <ChevronRight size={16} color="#CBD5E0" />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Emergency CTA */}
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyContent}>
              <View style={styles.emergencyIconWrap}>
                <Phone size={22} color="#0B6B2B" />
              </View>
              <View style={styles.emergencyTextBlock}>
                <Text style={styles.emergencyTitle}>Butuh bantuan segera?</Text>
                <Text style={styles.emergencySubtitle}>Hubungi layanan darurat lingkungan hidup</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.emergencyBtn} activeOpacity={0.85}>
              <Phone size={16} color="#fff" />
              <Text style={styles.emergencyBtnText}>Hubungi Kami</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </Animated.View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        transparent
        visible={selectedDeleteId !== null}
        animationType="fade"
        onRequestClose={() => setSelectedDeleteId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalIconRow}>
              <View style={styles.modalWarningIcon}>
                <AlertCircle size={26} color="#EF4444" />
              </View>
            </View>
            <Text style={styles.modalTitle}>Hapus Komentar?</Text>
            <Text style={styles.modalBody}>
              Komentar ini akan dihapus secara permanen dan tidak dapat dipulihkan.
            </Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setSelectedDeleteId(null)}>
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalDeleteBtn, deletingCommentId !== null && styles.disabledButton]}
                onPress={handleDeleteKomentar}
                disabled={deletingCommentId !== null}
              >
                {deletingCommentId ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalDeleteText}>Hapus</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function Avatar({ profile, name, size }: { profile?: string | null; name?: string | null; size: number }) {
  const url = buildUploadUrl(profile);
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  const fontSize = size * 0.38;

  if (url) {
    return (
      <Image
        source={{ uri: url }}
        style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "#E8F5E9" }}
      />
    );
  }

  const colors = ["#0B6B2B", "#1D4ED8", "#7C3AED", "#B45309", "#DC2626", "#0891B2"];
  const colorIndex = (name?.charCodeAt(0) || 0) % colors.length;

  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors[colorIndex], alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#fff", fontWeight: "700", fontSize }}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

  loadingPage: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F7F9F7", padding: 32 },
  loadingSpinner: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#E8F5E9", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  loadingTitle: { fontSize: 17, fontWeight: "700", color: "#111827", marginBottom: 6 },
  loadingSubtitle: { fontSize: 14, color: "#6B7280" },
  notFoundIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#E8F5E9", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: "#111827", marginBottom: 8, textAlign: "center" },
  emptySubtitle: { fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 24, lineHeight: 20 },

  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: Platform.OS === "ios" ? 54 : 14, paddingBottom: 12, paddingHorizontal: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F1F3F5" },
  topBarTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  navButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" },

  heroImageContainer: { width: "100%", height: 260, backgroundColor: "#E5E7EB" },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  heroImagePlaceholder: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F0FDF4" },
  placeholderIconBg: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  placeholderLabel: { color: "#6B7280", fontSize: 14, fontWeight: "500" },
  imageOverlayRow: { position: "absolute", bottom: 14, left: 14, right: 14, flexDirection: "row", gap: 8, flexWrap: "wrap" },

  mainBadgeRow: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 },
  categoryPill: { backgroundColor: "#0B6B2B", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  categoryPillText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  statusPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  statusPillText: { fontSize: 12, fontWeight: "700" },

  mainCard: { backgroundColor: "#fff", marginHorizontal: 16, marginTop: -20, borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 4 },
  metaRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#F9FAFB", borderRadius: 10, padding: 10, marginBottom: 14 },
  metaItem: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 },
  metaDivider: { width: 1, height: 16, backgroundColor: "#E5E7EB" },
  metaText: { fontSize: 11, color: "#6B7280", fontWeight: "500" },
  reportTitle: { fontSize: 22, fontWeight: "800", color: "#111827", lineHeight: 30, marginBottom: 12, letterSpacing: -0.3 },
  locationChip: { flexDirection: "row", alignItems: "flex-start", gap: 6, backgroundColor: "#F0FDF4", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: "#D1FAE5", marginBottom: 16 },
  locationChipText: { flex: 1, fontSize: 13, color: "#065F46", lineHeight: 18, fontWeight: "500" },
  cardDivider: { height: 1, backgroundColor: "#F1F3F5", marginBottom: 16 },
  reporterRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 18 },
  reporterInfo: { flex: 1 },
  reporterLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  reporterName: { fontSize: 15, color: "#111827", fontWeight: "700", marginTop: 2 },
  actionRow: { flexDirection: "row", gap: 10 },
  likeButton: { flex: 1, height: 46, borderRadius: 12, borderWidth: 1.5, borderColor: "#0B6B2B", backgroundColor: "#F0FDF4", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  likeButtonText: { color: "#0B6B2B", fontWeight: "700", fontSize: 13 },
  shareButton: { flex: 1, height: 46, borderRadius: 12, borderWidth: 1.5, borderColor: "#E5E7EB", backgroundColor: "#F9FAFB", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  shareButtonText: { color: "#374151", fontWeight: "700", fontSize: 13 },
  disabledButton: { opacity: 0.55 },

  descSection: { marginHorizontal: 16, marginTop: 16, backgroundColor: "#0B6B2B", borderRadius: 20, padding: 20, overflow: "hidden" },
  descHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  descIconWrap: { width: 38, height: 38, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  descHeaderTitle: { color: "#fff", fontSize: 16, fontWeight: "800", flex: 1 },
  descBody: { color: "rgba(255,255,255,0.92)", fontSize: 14, lineHeight: 23, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" },

  sectionCard: { marginHorizontal: 16, marginTop: 16, backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: "#111827" },
  countBadge: { backgroundColor: "#F3F4F6", borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
  countBadgeText: { fontSize: 12, fontWeight: "700", color: "#6B7280" },

  commentInputContainer: { flexDirection: "row", gap: 10, alignItems: "flex-start", marginBottom: 16 },
  inputBox: { flex: 1 },
  commentInput: { minHeight: 90, borderWidth: 1.5, borderColor: "#E5E7EB", borderRadius: 14, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12, color: "#111827", fontSize: 14, textAlignVertical: "top", backgroundColor: "#FAFAFA", lineHeight: 20 },
  sendBtn: { alignSelf: "flex-end", marginTop: 8, height: 40, paddingHorizontal: 16, borderRadius: 10, backgroundColor: "#0B6B2B", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  sendBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  emptyComments: { alignItems: "center", justifyContent: "center", paddingVertical: 28, gap: 8 },
  emptyCommentsText: { color: "#374151", fontWeight: "700", fontSize: 15 },
  emptyCommentsSubtext: { color: "#9CA3AF", fontSize: 13 },

  commentItem: { flexDirection: "row", gap: 10, paddingTop: 14, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  firstCommentItem: { borderTopWidth: 0, paddingTop: 0 },
  commentContent: { flex: 1, backgroundColor: "#F9FAFB", borderRadius: 14, padding: 12, borderWidth: 1, borderColor: "#F1F3F5" },
  commentTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  commenterName: { fontSize: 13, fontWeight: "700", color: "#111827" },
  commentDate: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  commentText: { fontSize: 14, color: "#374151", lineHeight: 20, marginTop: 8 },

  // Tombol edit & hapus berdampingan
  commentActionBtns: { flexDirection: "row", gap: 6 },
  editBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center" },
  deleteBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center" },

  // Edit inline
  editContainer: { marginTop: 8 },
  editInput: { minHeight: 80, borderWidth: 1.5, borderColor: "#3B82F6", borderRadius: 12, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 10, color: "#111827", fontSize: 14, textAlignVertical: "top", backgroundColor: "#F0F9FF", lineHeight: 20 },
  editActionRow: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 8 },
  cancelEditBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1.5, borderColor: "#E5E7EB", backgroundColor: "#fff" },
  cancelEditText: { color: "#6B7280", fontWeight: "600", fontSize: 13 },
  saveEditBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: "#0B6B2B" },
  saveEditText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  relatedCard: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  relatedImg: { width: 72, height: 72, borderRadius: 12, backgroundColor: "#F3F4F6" },
  relatedImgPlaceholder: { alignItems: "center", justifyContent: "center" },
  relatedCardInfo: { flex: 1 },
  relatedCardTitle: { fontSize: 13, fontWeight: "700", color: "#111827", lineHeight: 18 },
  relatedLocationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  relatedLocationText: { flex: 1, fontSize: 11, color: "#9CA3AF" },

  emergencyCard: { marginHorizontal: 16, marginTop: 16, backgroundColor: "#fff", borderRadius: 20, padding: 20, borderWidth: 1.5, borderColor: "#D1FAE5" },
  emergencyContent: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 },
  emergencyIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#D1FAE5" },
  emergencyTextBlock: { flex: 1 },
  emergencyTitle: { fontSize: 15, fontWeight: "800", color: "#111827" },
  emergencySubtitle: { fontSize: 13, color: "#6B7280", marginTop: 2, lineHeight: 18 },
  emergencyBtn: { height: 46, borderRadius: 12, backgroundColor: "#0B6B2B", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  emergencyBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  bottomSpacer: { height: 40 },
  primaryButton: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#0B6B2B", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  primaryButtonText: { color: "#fff", fontWeight: "700" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: 24 },
  modalSheet: { width: "100%", maxWidth: 360, backgroundColor: "#fff", borderRadius: 24, padding: 24, alignItems: "center" },
  modalIconRow: { marginBottom: 14 },
  modalWarningIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center" },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#111827", marginBottom: 10, textAlign: "center" },
  modalBody: { fontSize: 14, color: "#6B7280", lineHeight: 20, textAlign: "center", marginBottom: 24 },
  modalBtns: { flexDirection: "row", gap: 10, width: "100%" },
  modalCancelBtn: { flex: 1, height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  modalCancelText: { color: "#374151", fontWeight: "700", fontSize: 14 },
  modalDeleteBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: "#EF4444", alignItems: "center", justifyContent: "center" },
  modalDeleteText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  avatarInitial: { color: "#fff", fontWeight: "800" },
});