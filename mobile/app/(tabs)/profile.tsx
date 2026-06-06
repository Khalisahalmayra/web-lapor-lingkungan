import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  ImageIcon,
  Inbox,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  Save,
  Shield,
  ThumbsUp,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react-native";
import { getApiBaseUrl } from "../apiConfig";

const API_URL = getApiBaseUrl();
const { width: SW, height: SH } = Dimensions.get("window");

// ─── Types ────────────────────────────────────────────────────────────────────
interface Laporan {
  id: number;
  judul_laporan: string;
  isi_laporan: string;
  gambar: string | null;
  tanggal_kejadian: string;
  lokasi_kejadian: string;
  status: string;
  alasan_penolakan: string | null;
  pesan_admin: string | null;
  category_name: string;
  total_like?: number;
  total_komen?: number;
}

type TabKey = "Semua" | "Pending" | "Diproses" | "Selesai" | "Ditolak";

// ─── Constants ────────────────────────────────────────────────────────────────
const GREEN = "#0B6B2B";
const GREEN_LIGHT = "#F0FDF4";
const TABS: TabKey[] = ["Semua", "Pending", "Diproses", "Selesai", "Ditolak"];

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string; bar: string }> = {
  pending:  { label: "Menunggu",  bg: "#FEF9C3", text: "#854D0E", dot: "#EAB308", bar: "#EAB308" },
  diproses: { label: "Diproses",  bg: "#DBEAFE", text: "#1E40AF", dot: "#3B82F6", bar: "#3B82F6" },
  selesai:  { label: "Selesai",   bg: "#D1FAE5", text: "#065F46", dot: "#10B981", bar: "#10B981" },
  ditolak:  { label: "Ditolak",   bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444", bar: "#EF4444" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const buildUrl = (p?: string | null) => {
  if (!p) return null;
  return p.startsWith("http") ? p : `${API_URL}/uploads/${p}`;
};

const normalizeStatus = (s?: string) => {
  const l = s?.toLowerCase() || "";
  if (l === "pending") return "pending";
  if (l === "diproses" || l === "sedang diproses") return "diproses";
  if (l === "selesai") return "selesai";
  return "ditolak";
};

const formatDate = (d?: string) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ uri, name, size }: { uri?: string | null; name?: string | null; size: number }) {
  const url = buildUrl(uri);
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  const colors = ["#0B6B2B", "#1D4ED8", "#7C3AED", "#B45309", "#0891B2", "#BE185D"];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  const fs = Math.round(size * 0.38);
  if (url)
    return <Image source={{ uri: url }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#fff", fontWeight: "900", fontSize: fs }}>{initial}</Text>
    </View>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  const y = useRef(new Animated.Value(-80)).current;
  useEffect(() => {
    Animated.spring(y, { toValue: 0, useNativeDriver: true, tension: 100, friction: 10 }).start();
  }, []);
  return (
    <Animated.View style={[toast.wrap, { transform: [{ translateY: y }], backgroundColor: type === "success" ? GREEN : "#EF4444" }]}>
      {type === "success" ? <CheckCircle2 size={17} color="#fff" /> : <AlertCircle size={17} color="#fff" />}
      <Text style={toast.text}>{msg}</Text>
    </Animated.View>
  );
}
const toast = StyleSheet.create({
  wrap: { position: "absolute", top: Platform.OS === "ios" ? 60 : 16, left: 16, right: 16, zIndex: 9999, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 18, paddingVertical: 14, borderRadius: 18, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  text: { color: "#fff", fontWeight: "700", fontSize: 14, flex: 1 },
});

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View style={[stat.card, { borderTopColor: color }]}>
      <Text style={[stat.val, { color }]}>{value}</Text>
      <Text style={stat.lbl}>{label}</Text>
    </View>
  );
}
const stat = StyleSheet.create({
  card: { flex: 1, backgroundColor: "#fff", borderRadius: 16, padding: 14, alignItems: "center", borderTopWidth: 3, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  val: { fontSize: 24, fontWeight: "900" },
  lbl: { fontSize: 10, color: "#6B7280", fontWeight: "700", marginTop: 3, textAlign: "center", textTransform: "uppercase", letterSpacing: 0.4 },
});

// ─── Laporan Card ─────────────────────────────────────────────────────────────
function LaporanCard({ item, onPress }: { item: Laporan; onPress: () => void }) {
  const st = normalizeStatus(item.status);
  const cfg = STATUS_CFG[st] || STATUS_CFG.pending;
  const imgUrl = buildUrl(item.gambar);
  return (
    <TouchableOpacity style={lc.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[lc.bar, { backgroundColor: cfg.bar }]} />
      <View style={lc.inner}>
        <View style={lc.imgWrap}>
          {imgUrl ? (
            <Image source={{ uri: imgUrl }} style={lc.img} />
          ) : (
            <View style={[lc.img, lc.imgEmpty]}>
              <FileText size={18} color="#D1D5DB" />
            </View>
          )}
        </View>
        <View style={lc.body}>
          <View style={lc.topRow}>
            <View style={[lc.pill, { backgroundColor: cfg.bg }]}>
              <View style={[lc.dot, { backgroundColor: cfg.dot }]} />
              <Text style={[lc.pillText, { color: cfg.text }]}>{cfg.label}</Text>
            </View>
            <Text style={lc.date}>{formatDate(item.tanggal_kejadian)}</Text>
          </View>
          <Text style={lc.title} numberOfLines={2}>{item.judul_laporan}</Text>
          <View style={lc.metaRow}>
            <MapPin size={11} color="#9CA3AF" />
            <Text style={lc.meta} numberOfLines={1}>{item.lokasi_kejadian}</Text>
          </View>
          {item.category_name ? (
            <View style={lc.cat}>
              <Text style={lc.catText}>{item.category_name}</Text>
            </View>
          ) : null}
        </View>
        <ChevronRight size={16} color="#D1D5DB" style={{ alignSelf: "center" }} />
      </View>
    </TouchableOpacity>
  );
}
const lc = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 18, marginBottom: 10, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  bar: { height: 3, width: "100%" },
  inner: { flexDirection: "row", padding: 14, gap: 12 },
  imgWrap: { flexShrink: 0 },
  img: { width: 76, height: 76, borderRadius: 14, backgroundColor: "#F3F4F6" },
  imgEmpty: { alignItems: "center", justifyContent: "center" },
  body: { flex: 1 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  pill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  pillText: { fontSize: 11, fontWeight: "800" },
  date: { fontSize: 10, color: "#9CA3AF" },
  title: { fontSize: 13, fontWeight: "800", color: "#111827", lineHeight: 18, marginBottom: 5 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  meta: { flex: 1, fontSize: 11, color: "#9CA3AF" },
  cat: { marginTop: 6, backgroundColor: GREEN_LIGHT, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7, alignSelf: "flex-start" },
  catText: { fontSize: 10, color: GREEN, fontWeight: "800" },
});

// ─── Laporan Detail Modal ─────────────────────────────────────────────────────
function LaporanDetailModal({ item, onClose }: { item: Laporan; onClose: () => void }) {
  const st = normalizeStatus(item.status);
  const cfg = STATUS_CFG[st] || STATUS_CFG.pending;
  const imgUrl = buildUrl(item.gambar);
  const slideY = useRef(new Animated.Value(SH)).current;
  useEffect(() => {
    Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }).start();
  }, []);
  const dismiss = () => {
    Animated.timing(slideY, { toValue: SH, duration: 220, useNativeDriver: true }).start(onClose);
  };
  return (
    <Modal transparent visible animationType="fade" onRequestClose={dismiss}>
      <View style={dm.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
        <Animated.View style={[dm.sheet, { transform: [{ translateY: slideY }] }]}>
          <View style={[dm.topBar, { backgroundColor: cfg.bar }]} />
          {/* Header */}
          <View style={dm.hdr}>
            <View style={[dm.pill, { backgroundColor: cfg.bg }]}>
              <View style={[dm.dot, { backgroundColor: cfg.dot }]} />
              <Text style={[dm.pillTxt, { color: cfg.text }]}>{cfg.label}</Text>
            </View>
            <TouchableOpacity style={dm.closeBtn} onPress={dismiss}>
              <X size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={dm.scroll}>
            <Text style={dm.title}>{item.judul_laporan}</Text>
            {/* Image */}
            {imgUrl && (
              <View style={dm.imgWrap}>
                <Image source={{ uri: imgUrl }} style={dm.img} />
              </View>
            )}
            {/* Desc */}
            <View style={dm.section}>
              <Text style={dm.secLabel}>Deskripsi</Text>
              <View style={dm.textBox}>
                <Text style={dm.bodyText}>{item.isi_laporan}</Text>
              </View>
            </View>
            {/* Meta grid */}
            <View style={dm.metaGrid}>
              <View style={dm.metaCell}>
                <Text style={dm.secLabel}>Tanggal Kejadian</Text>
                <Text style={dm.metaVal}>{formatDate(item.tanggal_kejadian)}</Text>
              </View>
              <View style={dm.metaCell}>
                <Text style={dm.secLabel}>Kategori</Text>
                <Text style={dm.metaVal}>{item.category_name || "—"}</Text>
              </View>
            </View>
            <View style={dm.section}>
              <Text style={dm.secLabel}>Lokasi Kejadian</Text>
              <View style={[dm.textBox, { flexDirection: "row", alignItems: "flex-start", gap: 8 }]}>
                <MapPin size={14} color={GREEN} style={{ marginTop: 2 }} />
                <Text style={[dm.bodyText, { flex: 1 }]}>{item.lokasi_kejadian}</Text>
              </View>
            </View>
            {/* Admin pesan */}
            {st === "selesai" && item.pesan_admin ? (
              <View style={[dm.adminBox, { borderColor: "#10B981", backgroundColor: "#D1FAE5" }]}>
                <CheckCircle2 size={18} color="#065F46" />
                <View style={{ flex: 1 }}>
                  <Text style={[dm.adminLabel, { color: "#065F46" }]}>Pesan dari Admin</Text>
                  <Text style={[dm.adminBody, { color: "#047857" }]}>{item.pesan_admin}</Text>
                </View>
              </View>
            ) : null}
            {st === "ditolak" && item.alasan_penolakan ? (
              <View style={[dm.adminBox, { borderColor: "#EF4444", backgroundColor: "#FEE2E2" }]}>
                <XCircle size={18} color="#991B1B" />
                <View style={{ flex: 1 }}>
                  <Text style={[dm.adminLabel, { color: "#991B1B" }]}>Alasan Penolakan</Text>
                  <Text style={[dm.adminBody, { color: "#B91C1C" }]}>{item.alasan_penolakan}</Text>
                </View>
              </View>
            ) : null}
            {/* CTA */}
            <TouchableOpacity
              style={dm.cta}
              onPress={() => { dismiss(); setTimeout(() => router.push(`/detail-laporan/${item.id}`), 250); }}
            >
              <Text style={dm.ctaText}>Lihat Detail Lengkap</Text>
              <ChevronRight size={18} color="#fff" />
            </TouchableOpacity>
            <View style={{ height: 32 }} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
const dm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: SH * 0.88, overflow: "hidden" },
  topBar: { height: 4, width: "100%" },
  hdr: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  pillTxt: { fontSize: 12, fontWeight: "800" },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" },
  scroll: { paddingHorizontal: 20 },
  title: { fontSize: 20, fontWeight: "900", color: "#111827", lineHeight: 27, marginTop: 8, marginBottom: 16 },
  imgWrap: { borderRadius: 18, overflow: "hidden", height: 200, marginBottom: 16, backgroundColor: "#F3F4F6" },
  img: { width: "100%", height: "100%", resizeMode: "cover" },
  section: { marginBottom: 14 },
  secLabel: { fontSize: 10, fontWeight: "800", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 7 },
  textBox: { backgroundColor: "#F9FAFB", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#F1F3F5" },
  bodyText: { fontSize: 14, color: "#374151", lineHeight: 22 },
  metaGrid: { flexDirection: "row", gap: 10, marginBottom: 14 },
  metaCell: { flex: 1, backgroundColor: "#F9FAFB", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#F1F3F5" },
  metaVal: { fontSize: 14, fontWeight: "700", color: "#111827", marginTop: 4 },
  adminBox: { flexDirection: "row", alignItems: "flex-start", gap: 10, borderWidth: 1.5, borderRadius: 16, padding: 14, marginBottom: 14 },
  adminLabel: { fontSize: 13, fontWeight: "800", marginBottom: 4 },
  adminBody: { fontSize: 13, lineHeight: 19 },
  cta: { backgroundColor: GREEN, borderRadius: 16, height: 52, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});

// ─── Logout Modal ─────────────────────────────────────────────────────────────
function LogoutModal({ onConfirm, onCancel, loading }: { onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <Modal transparent visible animationType="fade" onRequestClose={onCancel}>
      <View style={lo.overlay}>
        <View style={lo.card}>
          <View style={lo.icon}><LogOut size={28} color="#EF4444" /></View>
          <Text style={lo.title}>Keluar dari Akun?</Text>
          <Text style={lo.body}>Sesi Anda akan berakhir. Data laporan tetap tersimpan.</Text>
          <View style={lo.btns}>
            <TouchableOpacity style={lo.cancel} onPress={onCancel}>
              <Text style={lo.cancelTxt}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[lo.logout, loading && { opacity: 0.6 }]} onPress={onConfirm} disabled={loading}>
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={lo.logoutTxt}>Ya, Keluar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const lo = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", alignItems: "center", justifyContent: "center", padding: 24 },
  card: { width: "100%", maxWidth: 340, backgroundColor: "#fff", borderRadius: 26, padding: 28, alignItems: "center" },
  icon: { width: 68, height: 68, borderRadius: 34, backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "900", color: "#111827", marginBottom: 10 },
  body: { fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 21, marginBottom: 24 },
  btns: { flexDirection: "row", gap: 10, width: "100%" },
  cancel: { flex: 1, height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  cancelTxt: { fontSize: 14, fontWeight: "800", color: "#374151" },
  logout: { flex: 1, height: 50, borderRadius: 14, backgroundColor: "#EF4444", alignItems: "center", justifyContent: "center" },
  logoutTxt: { color: "#fff", fontWeight: "800", fontSize: 14 },
});

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
function EditProfileModal({
  visible, user, onClose, onSaved,
}: {
  visible: boolean; user: any; onClose: () => void; onSaved: (u: any) => void;
}) {
  const [nama, setNama] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [noHp, setNoHp] = useState(user?.no_hp || "");
  const [password, setPassword] = useState("");
  const [editPwd, setEditPwd] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      setNama(user?.username || ""); setEmail(user?.email || ""); setNoHp(user?.no_hp || "");
      setPassword(""); setEditPwd(false); setShowPwd(false); setPhotoUri(null); setPhotoFile(null); setErrors({});
    }
  }, [visible, user]);

  const pickPhoto = async () => {
    const pick = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") return Alert.alert("Izin diperlukan", "Akses galeri diperlukan");
      const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.85, allowsEditing: true, aspect: [1, 1] });
      if (!res.canceled) {
        const a = res.assets[0];
        setPhotoUri(a.uri);
        setPhotoFile({ uri: a.uri, name: a.fileName || "profile.jpg", type: a.mimeType || "image/jpeg" });
      }
    };
    const take = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") return Alert.alert("Izin diperlukan", "Akses kamera diperlukan");
      const res = await ImagePicker.launchCameraAsync({ quality: 0.85, allowsEditing: true, aspect: [1, 1] });
      if (!res.canceled) {
        const a = res.assets[0];
        setPhotoUri(a.uri);
        setPhotoFile({ uri: a.uri, name: a.fileName || "profile.jpg", type: a.mimeType || "image/jpeg" });
      }
    };
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ["Batal", "Kamera", "Galeri"], cancelButtonIndex: 0 },
        (i) => { if (i === 1) take(); else if (i === 2) pick(); }
      );
    } else {
      Alert.alert("Foto Profil", "Pilih sumber foto", [
        { text: "Kamera", onPress: take }, { text: "Galeri", onPress: pick }, { text: "Batal", style: "cancel" },
      ]);
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nama.trim()) e.nama = "Nama tidak boleh kosong";
    if (!email.trim()) e.email = "Email tidak boleh kosong";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Format email tidak valid";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan, silakan login ulang");
      const formData = new FormData();
      formData.append("username", nama);
      formData.append("email", email);
      formData.append("no_hp", noHp);
      formData.append("password", editPwd ? password : "");
      if (photoFile) formData.append("profile", photoFile as any);

      const res = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui profil");
      const updated = data.user;
      await AsyncStorage.setItem("user", JSON.stringify(updated));
      onSaved(updated);
      onClose();
    } catch (err: any) {
      Alert.alert("Gagal", err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable style={ep.overlay} onPress={onClose} />
        <View style={ep.sheet}>
          <View style={ep.handle} />
          <View style={ep.hdr}>
            <Text style={ep.title}>Edit Profil</Text>
            <TouchableOpacity style={ep.closeBtn} onPress={onClose}>
              <X size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Photo picker */}
            <TouchableOpacity style={ep.photoRow} onPress={pickPhoto} activeOpacity={0.8}>
              <View style={ep.photoPreview}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={ep.photoImg} />
                ) : (
                  <Avatar uri={user?.profile} name={user?.username} size={60} />
                )}
                <View style={ep.camBadge}><Camera size={13} color="#fff" /></View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={ep.photoLabel}>Foto Profil</Text>
                <Text style={ep.photoHint}>Ketuk untuk ganti foto</Text>
              </View>
              <ChevronRight size={16} color="#D1D5DB" />
            </TouchableOpacity>

            {/* Nama */}
            <View style={ep.field}>
              <Text style={ep.label}>Nama Pengguna</Text>
              <View style={[ep.inputWrap, !!errors.nama && ep.inputErr]}>
                <User size={15} color="#9CA3AF" />
                <TextInput style={ep.input} value={nama} onChangeText={(t) => { setNama(t); setErrors((p) => ({ ...p, nama: "" })); }} placeholder="Nama lengkap" placeholderTextColor="#9CA3AF" />
              </View>
              {!!errors.nama && <Text style={ep.errTxt}>{errors.nama}</Text>}
            </View>

            {/* Email */}
            <View style={ep.field}>
              <Text style={ep.label}>Email</Text>
              <View style={[ep.inputWrap, !!errors.email && ep.inputErr]}>
                <Mail size={15} color="#9CA3AF" />
                <TextInput style={ep.input} value={email} onChangeText={(t) => { setEmail(t); setErrors((p) => ({ ...p, email: "" })); }} placeholder="email@contoh.com" placeholderTextColor="#9CA3AF" keyboardType="email-address" autoCapitalize="none" />
              </View>
              {!!errors.email && <Text style={ep.errTxt}>{errors.email}</Text>}
            </View>

            {/* No HP */}
            <View style={ep.field}>
              <Text style={ep.label}>No. HP <Text style={ep.optional}>(opsional)</Text></Text>
              <View style={ep.inputWrap}>
                <Phone size={15} color="#9CA3AF" />
                <TextInput style={ep.input} value={noHp} onChangeText={setNoHp} placeholder="08xxxxxxxxxx" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" />
              </View>
            </View>

            {/* Password */}
            <View style={ep.field}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Text style={ep.label}>Kata Sandi</Text>
                <TouchableOpacity onPress={() => setEditPwd(!editPwd)}>
                  <Text style={ep.togglePwd}>{editPwd ? "Batalkan" : "Ubah password"}</Text>
                </TouchableOpacity>
              </View>
              <View style={[ep.inputWrap, !editPwd && { backgroundColor: "#F9FAFB" }]}>
                <Shield size={15} color="#9CA3AF" />
                <TextInput
                  style={ep.input}
                  value={editPwd ? password : "••••••••"}
                  onChangeText={setPassword}
                  secureTextEntry={!showPwd}
                  editable={editPwd}
                  placeholder="Password baru"
                  placeholderTextColor="#9CA3AF"
                />
                {editPwd && (
                  <TouchableOpacity onPress={() => setShowPwd(!showPwd)}>
                    {showPwd ? <EyeOff size={17} color="#9CA3AF" /> : <Eye size={17} color="#9CA3AF" />}
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Actions */}
            <View style={ep.actions}>
              <TouchableOpacity style={ep.cancelBtn} onPress={onClose}>
                <Text style={ep.cancelTxt}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[ep.saveBtn, loading && { opacity: 0.6 }]} onPress={handleSave} disabled={loading}>
                {loading ? <ActivityIndicator size="small" color="#fff" /> : <><Save size={16} color="#fff" /><Text style={ep.saveTxt}>Simpan</Text></>}
              </TouchableOpacity>
            </View>
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const ep = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 0, maxHeight: SH * 0.92 },
  handle: { width: 40, height: 4, backgroundColor: "#E5E7EB", borderRadius: 2, alignSelf: "center", marginBottom: 20 },
  hdr: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "900", color: "#111827" },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" },
  photoRow: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#F9FAFB", borderRadius: 16, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: "#F1F3F5" },
  photoPreview: { width: 60, height: 60, borderRadius: 30, overflow: "hidden", position: "relative" },
  photoImg: { width: 60, height: 60, borderRadius: 30 },
  camBadge: { position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderRadius: 10, backgroundColor: GREEN, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "#fff" },
  photoLabel: { fontSize: 14, fontWeight: "800", color: "#111827" },
  photoHint: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  field: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: "800", color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
  optional: { fontWeight: "500", color: "#9CA3AF", textTransform: "none", letterSpacing: 0 },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1.5, borderColor: "#E5E7EB", borderRadius: 14, paddingHorizontal: 14, height: 52, backgroundColor: "#FAFAFA" },
  inputErr: { borderColor: "#EF4444", backgroundColor: "#FEF2F2" },
  input: { flex: 1, fontSize: 15, color: "#111827" },
  errTxt: { color: "#EF4444", fontSize: 12, marginTop: 5, fontWeight: "600" },
  togglePwd: { fontSize: 12, color: GREEN, fontWeight: "700" },
  actions: { flexDirection: "row", gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  cancelTxt: { fontSize: 15, fontWeight: "800", color: "#374151" },
  saveBtn: { flex: 1, height: 50, borderRadius: 14, backgroundColor: GREEN, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  saveTxt: { color: "#fff", fontWeight: "900", fontSize: 15 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileRiwayatScreen() {
  const [user, setUser] = useState<any>(null);
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingLaporan, setLoadingLaporan] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("Semua");
  const [selectedLaporan, setSelectedLaporan] = useState<Laporan | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [toastData, setToastData] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToastData({ msg, type });
    setTimeout(() => setToastData(null), 3200);
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");
      if (!token) { router.replace("/login"); return; }

      if (stored) setUser(JSON.parse(stored));

      const res = await fetch(`${API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        await AsyncStorage.setItem("user", JSON.stringify(data));
      }
    } catch (err) {
      console.error("loadUser:", err);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const loadLaporan = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API_URL}/api/laporan/riwayat`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLaporan(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      console.error("loadLaporan:", err);
    } finally {
      setLoadingLaporan(false);
      setRefreshing(false);
      Animated.timing(fadeAnim, { toValue: 1, duration: 420, useNativeDriver: true }).start();
    }
  }, []);

  useEffect(() => {
    loadUser();
    loadLaporan();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadUser();
    loadLaporan();
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await AsyncStorage.multiRemove(["token", "user"]);
      router.replace("/login");
    } catch {
      showToast("Gagal logout", "error");
    } finally {
      setLoggingOut(false);
      setShowLogout(false);
    }
  };

  // Stats
  const stats = {
    total: laporan.length,
    selesai: laporan.filter((l) => normalizeStatus(l.status) === "selesai").length,
    diproses: laporan.filter((l) => normalizeStatus(l.status) === "diproses").length,
    menunggu: laporan.filter((l) => normalizeStatus(l.status) === "pending").length,
    ditolak: laporan.filter((l) => normalizeStatus(l.status) === "ditolak").length,
  };

  // Filter
  const filtered = laporan.filter((l) => {
    if (activeTab === "Semua") return true;
    return normalizeStatus(l.status) === normalizeStatus(activeTab);
  });

  // Header avatar opacity on scroll
  const headerAvatarScale = scrollY.interpolate({ inputRange: [0, 80], outputRange: [1, 0.7], extrapolate: "clamp" });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      {/* Toast */}
      {toastData && <Toast msg={toastData.msg} type={toastData.type} />}

      {/* Modals */}
      {showLogout && <LogoutModal onConfirm={handleLogout} onCancel={() => setShowLogout(false)} loading={loggingOut} />}
      {showEdit && <EditProfileModal visible={showEdit} user={user} onClose={() => setShowEdit(false)} onSaved={(u) => { setUser(u); showToast("Profil berhasil diperbarui!"); }} />}
      {selectedLaporan && <LaporanDetailModal item={selectedLaporan} onClose={() => setSelectedLaporan(null)} />}

      <Animated.ScrollView
        style={s.root}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[GREEN]} tintColor={GREEN} />}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* ── Green Header ── */}
        <View style={s.header}>
          {/* Deco circles */}
          <View style={s.deco1} />
          <View style={s.deco2} />
          <View style={s.deco3} />

          {/* Top row */}
          <View style={s.headerTop}>
            <TouchableOpacity style={s.headerBackBtn} onPress={() => router.back()}>
              <ArrowLeft size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={s.headerTitle}>Profil & Riwayat</Text>
            <TouchableOpacity style={s.headerLogoutBtn} onPress={() => setShowLogout(true)}>
              <LogOut size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Profile info */}
          <Animated.View style={[s.profileBlock, { transform: [{ scale: headerAvatarScale }] }]}>
            <View style={s.avatarOuter}>
              {loadingUser ? (
                <View style={s.avatarPlaceholder}><ActivityIndicator color={GREEN} /></View>
              ) : (
                <Avatar uri={user?.profile} name={user?.username} size={84} />
              )}
              <TouchableOpacity style={s.camBtn} onPress={() => setShowEdit(true)}>
                <Camera size={13} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={s.profileText}>
              <Text style={s.profileName}>{user?.username || "Pengguna"}</Text>
              <Text style={s.profileEmail}>{user?.email || ""}</Text>
              {user?.no_hp ? <Text style={s.profilePhone}>{user.no_hp}</Text> : null}
            </View>
          </Animated.View>

          {/* Edit button */}
          <TouchableOpacity style={s.editProfileBtn} onPress={() => setShowEdit(true)} activeOpacity={0.85}>
            <Pencil size={14} color={GREEN} />
            <Text style={s.editProfileTxt}>Edit Profil</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          {/* ── Stats ── */}
          <View style={s.statsRow}>
            <StatCard value={stats.total} label="Total" color="#111827" />
            <StatCard value={stats.selesai} label="Selesai" color="#10B981" />
            <StatCard value={stats.diproses} label="Diproses" color="#3B82F6" />
            <StatCard value={stats.menunggu} label="Menunggu" color="#EAB308" />
          </View>

          {/* ── Riwayat Section ── */}
          <View style={s.section}>
            <View style={s.sectionHdr}>
              <View style={s.sectionTitleRow}>
                <View style={s.sectionIcon}><FileText size={16} color={GREEN} /></View>
                <Text style={s.sectionTitle}>Riwayat Laporan</Text>
              </View>
              <TouchableOpacity style={s.newBtn} onPress={() => router.push("/lapor")}>
                <Text style={s.newBtnTxt}>+ Buat</Text>
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsScroll} contentContainerStyle={s.tabsContent}>
              {TABS.map((tab) => {
                const count = tab === "Semua" ? stats.total : tab === "Pending" ? stats.menunggu : tab === "Diproses" ? stats.diproses : tab === "Selesai" ? stats.selesai : stats.ditolak;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[s.tab, activeTab === tab && s.tabActive]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[s.tabTxt, activeTab === tab && s.tabTxtActive]}>{tab}</Text>
                    {count > 0 && (
                      <View style={[s.tabBadge, activeTab === tab && s.tabBadgeActive]}>
                        <Text style={[s.tabBadgeTxt, activeTab === tab && s.tabBadgeTxtActive]}>{count}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* List */}
            {loadingLaporan ? (
              <View style={s.emptyBox}>
                <ActivityIndicator size="large" color={GREEN} />
                <Text style={s.emptyTxt}>Memuat laporan...</Text>
              </View>
            ) : filtered.length === 0 ? (
              <View style={s.emptyBox}>
                <View style={s.emptyIcon}><Inbox size={30} color="#D1D5DB" /></View>
                <Text style={s.emptyTitle}>{activeTab === "Semua" ? "Belum ada laporan" : `Tidak ada laporan ${activeTab}`}</Text>
                <Text style={s.emptyBody}>{activeTab === "Semua" ? "Laporan yang Anda buat akan muncul di sini" : "Coba tab yang lain"}</Text>
                {activeTab === "Semua" && (
                  <TouchableOpacity style={s.createBtn} onPress={() => router.push("/lapor")}>
                    <Text style={s.createBtnTxt}>Buat Laporan Pertama</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              filtered.map((item) => (
                <LaporanCard key={item.id} item={item} onPress={() => setSelectedLaporan(item)} />
              ))
            )}
          </View>

          {/* ── Logout bottom row ── */}
          <View style={s.section}>
            <TouchableOpacity style={s.logoutRow} onPress={() => setShowLogout(true)} activeOpacity={0.8}>
              <View style={s.logoutIcon}><LogOut size={18} color="#EF4444" /></View>
              <Text style={s.logoutTxt}>Keluar dari Akun</Text>
              <ChevronRight size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <View style={{ height: 48 }} />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F3F4F6" },

  // Header
  header: {
    backgroundColor: GREEN,
    paddingTop: Platform.OS === "ios" ? 56 : 20,
    paddingHorizontal: 20,
    paddingBottom: 28,
    overflow: "hidden",
    position: "relative",
  },
  deco1: { position: "absolute", width: 220, height: 220, borderRadius: 110, backgroundColor: "rgba(255,255,255,0.06)", top: -70, right: -50 },
  deco2: { position: "absolute", width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(255,255,255,0.05)", bottom: -60, left: -30 },
  deco3: { position: "absolute", width: 90, height: 90, borderRadius: 45, backgroundColor: "rgba(255,255,255,0.04)", top: 40, left: SW * 0.45 },

  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  headerBackBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "900", color: "#fff", letterSpacing: -0.3 },
  headerLogoutBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },

  profileBlock: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 },
  avatarOuter: { position: "relative" },
  avatarPlaceholder: { width: 84, height: 84, borderRadius: 42, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  camBtn: { position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: "#1D4ED8", borderWidth: 2, borderColor: "#fff", alignItems: "center", justifyContent: "center" },
  profileText: { flex: 1 },
  profileName: { fontSize: 22, fontWeight: "900", color: "#fff", letterSpacing: -0.5 },
  profileEmail: { fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 3 },
  profilePhone: { fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 },

  editProfileBtn: { flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, alignSelf: "flex-start" },
  editProfileTxt: { color: GREEN, fontSize: 13, fontWeight: "900" },

  // Stats
  statsRow: { flexDirection: "row", gap: 8, marginHorizontal: 16, marginTop: 16, marginBottom: 4 },

  // Section
  section: { marginHorizontal: 16, marginTop: 16 },
  sectionHdr: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  sectionIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: GREEN_LIGHT, alignItems: "center", justifyContent: "center" },
  sectionTitle: { fontSize: 17, fontWeight: "900", color: "#111827" },
  newBtn: { backgroundColor: GREEN_LIGHT, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12 },
  newBtnTxt: { fontSize: 12, fontWeight: "900", color: GREEN },

  // Tabs
  tabsScroll: { marginBottom: 14 },
  tabsContent: { gap: 8, paddingRight: 4 },
  tab: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: "#E9EBF0" },
  tabActive: { backgroundColor: GREEN },
  tabTxt: { fontSize: 12, fontWeight: "700", color: "#6B7280" },
  tabTxtActive: { color: "#fff" },
  tabBadge: { backgroundColor: "#D1D5DB", borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 },
  tabBadgeActive: { backgroundColor: "rgba(255,255,255,0.25)" },
  tabBadgeTxt: { fontSize: 10, fontWeight: "900", color: "#6B7280" },
  tabBadgeTxtActive: { color: "#fff" },

  // Empty
  emptyBox: { backgroundColor: "#fff", borderRadius: 22, padding: 36, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  emptyIcon: { width: 68, height: 68, borderRadius: 22, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  emptyTxt: { color: "#6B7280", fontWeight: "700", fontSize: 14, marginTop: 12 },
  emptyTitle: { fontSize: 16, fontWeight: "900", color: "#111827", marginBottom: 7, textAlign: "center" },
  emptyBody: { fontSize: 13, color: "#9CA3AF", textAlign: "center", lineHeight: 19, marginBottom: 22 },
  createBtn: { backgroundColor: GREEN, paddingHorizontal: 22, paddingVertical: 13, borderRadius: 14 },
  createBtnTxt: { color: "#fff", fontWeight: "900", fontSize: 14 },

  // Logout row
  logoutRow: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#fff", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "#FEE2E2", shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  logoutIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center" },
  logoutTxt: { flex: 1, fontSize: 15, fontWeight: "800", color: "#EF4444" },
});