import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  ImagePlus,
  Leaf,
  Loader2,
  MapPin,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getApiBaseUrl } from "../apiConfig";

// ─── Platform guards ─────────────────────────────────────────────────────────
// We lazy-import native modules only on native to avoid web crashes
let ImagePicker: typeof import("expo-image-picker") | null = null;
let WebViewComp: React.ComponentType<any> | null = null;

if (Platform.OS !== "web") {
  // Will be resolved at runtime on native
  ImagePicker = require("expo-image-picker");
  WebViewComp = require("react-native-webview").WebView;
}

const API_URL = getApiBaseUrl();
const { width: SW, height: SH } = Dimensions.get("window");
const GREEN = "#0B6B2B";
const GREEN_LIGHT = "#F0FDF4";
const MAX_PHOTOS = 1;
const TAB_BAR_CLEARANCE = 96;
const IS_WEB = Platform.OS === "web";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Kategori {
  id: number;
  category_name: string;
}

interface PhotoItem {
  uri: string;          // object URL (web) or file URI (native)
  name: string;
  type: string;
  file?: File;          // only on web
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const fmtDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const M = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"];
  return `${d} ${M[parseInt(m) - 1]} ${y}`;
};

// ─── Leaflet HTML (for native WebView) ───────────────────────────────────────
const LEAFLET_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body,#map{width:100%;height:100%}
    .pin{width:28px;height:28px;background:#0B6B2B;border:3px solid #fff;
         border-radius:50% 50% 50% 0;transform:rotate(-45deg);
         box-shadow:0 2px 10px rgba(0,0,0,.4)}
    .leaflet-control-attribution{font-size:9px}
  </style>
</head>
<body>
<div id="map"></div>
<script>
  var map=L.map('map',{zoomControl:true}).setView([-2.5,118],5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'© OpenStreetMap',maxZoom:19
  }).addTo(map);
  var marker=null;
  var icon=L.divIcon({className:'',html:'<div class="pin"></div>',iconAnchor:[14,28]});

  map.on('click',function(e){
    var lat=e.latlng.lat,lng=e.latlng.lng;
    if(marker)map.removeLayer(marker);
    marker=L.marker([lat,lng],{icon:icon}).addTo(map);
    window.ReactNativeWebView.postMessage(
      JSON.stringify({type:'CLICK',lat:lat,lng:lng})
    );
  });

  // Listen for SET_VIEW from RN
  function handleMsg(e){
    try{
      var d=JSON.parse(e.data||'{}');
      if(d.type==='SET_VIEW'){
        if(marker)map.removeLayer(marker);
        marker=L.marker([d.lat,d.lng],{icon:icon}).addTo(map);
        map.setView([d.lat,d.lng],d.zoom||15);
      }
    }catch(ex){}
  }
  window.addEventListener('message',handleMsg);
  document.addEventListener('message',handleMsg);
</script>
</body>
</html>
`;

// ─── Step Bar ─────────────────────────────────────────────────────────────────
const STEPS = ["Info","Foto","Lokasi","Kirim"];

function StepBar({ current }: { current: number }) {
  return (
    <View style={sb.row}>
      {STEPS.map((label, i) => {
        const done   = i + 1 < current;
        const active = i + 1 === current;
        return (
          <View key={i} style={sb.item}>
            {i > 0 && <View style={[sb.line, done && sb.lineDone]} />}
            <View style={[sb.circle, done && sb.done, active && sb.active]}>
              {done
                ? <CheckCircle2 size={13} color="#fff" />
                : <Text style={[sb.num, active && sb.numA]}>{i + 1}</Text>}
            </View>
            <Text style={[sb.label, active && sb.labelA]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}
const sb = StyleSheet.create({
  row:    { flexDirection:"row", justifyContent:"center", paddingHorizontal:16, paddingVertical:14, backgroundColor:"#fff", borderBottomWidth:1, borderBottomColor:"#F1F3F5" },
  item:   { alignItems:"center", flex:1, position:"relative" },
  line:   { position:"absolute", top:13, right:"50%", left:"-50%", height:2, backgroundColor:"#E5E7EB", zIndex:0 },
  lineDone:{ backgroundColor: GREEN },
  circle: { width:28, height:28, borderRadius:14, backgroundColor:"#E5E7EB", alignItems:"center", justifyContent:"center", zIndex:1 },
  done:   { backgroundColor: GREEN },
  active: { backgroundColor: GREEN, shadowColor: GREEN, shadowOpacity:.4, shadowRadius:6, shadowOffset:{width:0,height:2}, elevation:4 },
  num:    { fontSize:11, fontWeight:"800", color:"#9CA3AF" },
  numA:   { color:"#fff" },
  label:  { fontSize:10, fontWeight:"700", color:"#9CA3AF", marginTop:4 },
  labelA: { color: GREEN },
});

// ─── Photo Grid ───────────────────────────────────────────────────────────────
function PhotoGrid({
  photos, onAddNative, onAddWeb, onRemove,
}: {
  photos: PhotoItem[];
  onAddNative: () => void;
  onAddWeb: (files: FileList) => void;
  onRemove: (i: number) => void;
}) {
  const CELL = (SW - 32 - 16) / 3;
  const webInputRef = useRef<any>(null);
  const canAdd = photos.length < MAX_PHOTOS;

  return (
    <View style={{ flexDirection:"row", flexWrap:"wrap", gap:8 }}>
      {photos.map((p, i) => (
        <View key={i} style={{ width:CELL, height:CELL, borderRadius:14, overflow:"hidden" }}>
          <Image source={{ uri: p.uri }} style={{ width:"100%", height:"100%" }} />
          <TouchableOpacity
            style={pg.del}
            onPress={() => onRemove(i)}
          >
            <Trash2 size={12} color="#fff" />
          </TouchableOpacity>
          {i === 0 && (
            <View style={pg.badge}>
              <Text style={pg.badgeTxt}>Utama</Text>
            </View>
          )}
        </View>
      ))}

      {canAdd && (
        <TouchableOpacity
          style={[pg.addCell, { width:CELL, height:CELL }]}
          onPress={IS_WEB ? () => webInputRef.current?.click() : onAddNative}
          activeOpacity={0.7}
        >
          <View style={pg.addIcon}>
            <ImagePlus size={20} color={GREEN} />
          </View>
          <Text style={pg.addTxt}>
            {photos.length === 0 ? "Tambah\nFoto" : `+Foto\n${photos.length}/${MAX_PHOTOS}`}
          </Text>

          {/* hidden file input — only rendered on web */}
          {IS_WEB && (
            // @ts-ignore — input only exists on web
            <input
              ref={webInputRef}
              type="file"
              accept="image/*"
              style={{ display:"none" }}
              onChange={(e: any) => {
                if (e.target.files) onAddWeb(e.target.files);
                e.target.value = "";
              }}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
const pg = StyleSheet.create({
  del:      { position:"absolute", top:5, right:5, width:24, height:24, borderRadius:12, backgroundColor:"rgba(239,68,68,.9)", alignItems:"center", justifyContent:"center" },
  badge:    { position:"absolute", bottom:5, left:5, backgroundColor: GREEN, paddingHorizontal:6, paddingVertical:2, borderRadius:6 },
  badgeTxt: { color:"#fff", fontSize:9, fontWeight:"800" },
  addCell:  { borderRadius:14, borderWidth:2, borderColor: GREEN, borderStyle:"dashed", backgroundColor: GREEN_LIGHT, alignItems:"center", justifyContent:"center" },
  addIcon:  { width:40, height:40, borderRadius:20, backgroundColor:"#DCFCE7", alignItems:"center", justifyContent:"center", marginBottom:5 },
  addTxt:   { color: GREEN, fontSize:10, fontWeight:"800", textAlign:"center" },
});

// ─── Kategori Modal ───────────────────────────────────────────────────────────
function KategoriModal({
  visible, list, selected, onSelect, onClose,
}: {
  visible: boolean; list: Kategori[]; selected: string;
  onSelect: (id: string, name: string) => void; onClose: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex:1, backgroundColor:"rgba(0,0,0,.5)" }} onPress={onClose} />
      <View style={km.sheet}>
        <View style={km.handle} />
        <Text style={km.title}>Pilih Kategori</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {list.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[km.item, selected === String(item.id) && km.itemA]}
              onPress={() => { onSelect(String(item.id), item.category_name); onClose(); }}
            >
              <View style={[km.dot, selected === String(item.id) && km.dotA]} />
              <Text style={[km.txt, selected === String(item.id) && km.txtA]}>{item.category_name}</Text>
              {selected === String(item.id) && <CheckCircle2 size={18} color={GREEN} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={km.close} onPress={onClose}>
          <Text style={km.closeTxt}>Tutup</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
const km = StyleSheet.create({
  sheet:   { backgroundColor:"#fff", borderTopLeftRadius:24, borderTopRightRadius:24, padding:20, maxHeight:"70%" },
  handle:  { width:40, height:4, backgroundColor:"#E5E7EB", borderRadius:2, alignSelf:"center", marginBottom:16 },
  title:   { fontSize:18, fontWeight:"900", color:"#111827", marginBottom:14 },
  item:    { flexDirection:"row", alignItems:"center", gap:12, paddingVertical:14, paddingHorizontal:12, borderRadius:12, marginBottom:4 },
  itemA:   { backgroundColor: GREEN_LIGHT },
  dot:     { width:10, height:10, borderRadius:5, backgroundColor:"#E5E7EB" },
  dotA:    { backgroundColor: GREEN },
  txt:     { flex:1, fontSize:15, color:"#374151", fontWeight:"500" },
  txtA:    { color: GREEN, fontWeight:"800" },
  close:   { height:48, borderRadius:12, backgroundColor:"#F3F4F6", alignItems:"center", justifyContent:"center", marginTop:10 },
  closeTxt:{ fontSize:15, fontWeight:"700", color:"#374151" },
});

// ─── Success Modal ────────────────────────────────────────────────────────────
function SuccessModal({ visible, onClose, onNew }: { visible: boolean; onClose: () => void; onNew: () => void }) {
  const scale = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    if (visible)
      Animated.spring(scale, { toValue:1, useNativeDriver:true, tension:80, friction:8 }).start();
    else scale.setValue(0.6);
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={sm.overlay}>
        <Animated.View style={[sm.card, { transform:[{ scale }] }]}>
          <View style={sm.ring}><View style={sm.inner}><CheckCircle2 size={52} color={GREEN} /></View></View>
          <Text style={sm.title}>Laporan Terkirim! 🌱</Text>
          <Text style={sm.body}>Laporan Anda berhasil dikirim. Tim kami akan segera memverifikasi dan menindaklanjutinya.</Text>
          <TouchableOpacity style={sm.btnP} onPress={onClose} activeOpacity={0.85}>
            <Text style={sm.btnPTxt}>Kembali ke Beranda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={sm.btnS} onPress={onNew}>
            <Text style={sm.btnSTxt}>Buat Laporan Baru</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
const sm = StyleSheet.create({
  overlay: { flex:1, backgroundColor:"rgba(0,0,0,.6)", alignItems:"center", justifyContent:"center", padding:24 },
  card:    { width:"100%", maxWidth:360, backgroundColor:"#fff", borderRadius:28, padding:28, alignItems:"center" },
  ring:    { width:100, height:100, borderRadius:50, backgroundColor:"#D1FAE5", alignItems:"center", justifyContent:"center", marginBottom:22 },
  inner:   { width:78, height:78, borderRadius:39, backgroundColor:"#A7F3D0", alignItems:"center", justifyContent:"center" },
  title:   { fontSize:22, fontWeight:"900", color:"#111827", marginBottom:12, textAlign:"center" },
  body:    { fontSize:14, color:"#6B7280", lineHeight:22, textAlign:"center", marginBottom:26 },
  btnP:    { width:"100%", height:52, borderRadius:14, backgroundColor: GREEN, alignItems:"center", justifyContent:"center", marginBottom:10 },
  btnPTxt: { color:"#fff", fontSize:15, fontWeight:"900" },
  btnS:    { width:"100%", height:46, borderRadius:14, borderWidth:1.5, borderColor:"#D1FAE5", alignItems:"center", justifyContent:"center" },
  btnSTxt: { color: GREEN, fontSize:14, fontWeight:"800" },
});

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, icon, error, children }: {
  label: string; icon?: React.ReactNode; error?: string; children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom:20 }}>
      <View style={{ flexDirection:"row", alignItems:"center", gap:7, marginBottom:9 }}>
        {icon}
        <Text style={{ fontSize:14, fontWeight:"800", color:"#111827" }}>{label}</Text>
      </View>
      {children}
      {!!error && (
        <View style={{ flexDirection:"row", alignItems:"center", gap:5, marginTop:6 }}>
          <AlertCircle size={13} color="#EF4444" />
          <Text style={{ color:"#EF4444", fontSize:12, fontWeight:"600" }}>{error}</Text>
        </View>
      )}
    </View>
  );
}

// ─── Review Row ───────────────────────────────────────────────────────────────
function ReviewRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[rr.row, !last && rr.border]}>
      <Text style={rr.label}>{label}</Text>
      <Text style={rr.value}>{value || "—"}</Text>
    </View>
  );
}
const rr = StyleSheet.create({
  row:   { paddingVertical:12 },
  border:{ borderBottomWidth:1, borderBottomColor:"#F3F4F6" },
  label: { fontSize:10, fontWeight:"800", color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.5, marginBottom:3 },
  value: { fontSize:14, color:"#111827", fontWeight:"600", lineHeight:20 },
});

// ─── Web Map Component (Leaflet native on web) ────────────────────────────────
function WebMapLeaflet({
  onLocationPick,
  panTo,
}: {
  onLocationPick: (lat: number, lng: number) => void;
  panTo: { lat: number; lng: number; zoom?: number } | null;
}) {
  const mapContainerRef = useRef<any>(null);
  const mapInstanceRef  = useRef<any>(null);
  const markerRef       = useRef<any>(null);
  const iconRef         = useRef<any>(null);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || mapInstanceRef.current) return;

    let cancelled = false;

    // Inject Leaflet CSS once
    if (!document.getElementById("lf-css")) {
      const link = document.createElement("link");
      link.id = "lf-css"; link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    import("leaflet").then((L: any) => {
      if (cancelled || !container) return;
      if ((container as any)._leaflet_id) delete (container as any)._leaflet_id;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(container).setView([-2.5, 118.0], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors", maxZoom: 19,
      }).addTo(map);

      const customIcon = L.divIcon({
        className: "",
        html: `<div style="width:28px;height:28px;background:#0B6B2B;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
        iconAnchor: [14, 28],
      });
      iconRef.current = customIcon;

      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) map.removeLayer(markerRef.current);
        markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);
        onLocationPick(lat, lng);
      });

      mapInstanceRef.current = map;
      setTimeout(() => map.invalidateSize(), 200);
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Pan map when panTo changes
  useEffect(() => {
    if (!panTo || !mapInstanceRef.current) return;
    import("leaflet").then((L: any) => {
      if (markerRef.current) mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = L.marker([panTo.lat, panTo.lng], {
        icon: iconRef.current || new L.Icon.Default(),
      }).addTo(mapInstanceRef.current);
      mapInstanceRef.current.setView([panTo.lat, panTo.lng], panTo.zoom || 15);
    });
  }, [panTo]);

  // On web, render a plain div that Leaflet mounts into
  // @ts-ignore — this JSX is only evaluated on web
  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100%", minHeight: 300 }}
    />
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function LaporScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep]         = useState(1);
  const [judul, setJudul]       = useState("");
  const [isi, setIsi]           = useState("");
  const [tanggal, setTanggal]   = useState(today());
  const [lokasi, setLokasi]     = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [kategori, setKategori] = useState("");
  const [kategoriName, setKategoriName] = useState("");
  const [photos, setPhotos]     = useState<PhotoItem[]>([]);
  const [panTo, setPanTo]       = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);

  const [loading, setLoading]           = useState(false);
  const [lokasiLoading, setLokasiLoading] = useState(false);
  const [showKategori, setShowKategori] = useState(false);
  const [showSuccess, setShowSuccess]   = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errorMsg, setErrorMsg]         = useState("");
  const [errors, setErrors]             = useState<Record<string, string>>({});

  // Native WebView ref (only used on native)
  const webViewRef = useRef<any>(null);
  const scrollRef  = useRef<ScrollView>(null);
  const bottomClearance = TAB_BAR_CLEARANCE + (IS_WEB ? 24 : insets.bottom);

  useEffect(() => {
    fetch(`${API_URL}/api/kategori`)
      .then((r) => r.json())
      .then(setKategoriList)
      .catch(() => console.log("kategori fetch failed"));
  }, []);

  // ─── Reverse geocode ────────────────────────────────────────────────────────
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setLokasiLoading(true);
    setLokasi("");
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=id`
      );
      const data = await res.json();
      const addr = data.address || {};
      const parts = [
        addr.village || addr.suburb || addr.quarter,
        addr.city_district || addr.district || addr.county,
        addr.city || addr.town,
        addr.state,
      ].filter(Boolean);
      const name = parts.length > 0 ? parts.join(", ") : data.display_name;
      setLokasi(name);
      setSearchQuery(name);
      setErrors((p) => ({ ...p, lokasi: "" }));
    } catch {
      setLokasi(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setLokasiLoading(false);
    }
  }, []);

  // ─── Native WebView message ─────────────────────────────────────────────────
  const handleWebViewMessage = useCallback((e: any) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === "CLICK") reverseGeocode(msg.lat, msg.lng);
    } catch { /* ignore */ }
  }, [reverseGeocode]);

  // ─── Search location ────────────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLokasiLoading(true);
    try {
      const res     = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&accept-language=id`
      );
      const results = await res.json();
      if (!results?.length) { Alert.alert("Tidak ditemukan", "Coba kata kunci lain"); return; }
      const place = results[0];
      const lat = parseFloat(place.lat);
      const lng = parseFloat(place.lon);
      setLokasi(place.display_name);
      setSearchQuery(place.display_name);
      setErrors((p) => ({ ...p, lokasi: "" }));

      if (IS_WEB) {
        // trigger pan in WebMapLeaflet
        setPanTo({ lat, lng, zoom: 15 });
      } else {
        // inject into WebView
        webViewRef.current?.injectJavaScript(`
          window.dispatchEvent(new MessageEvent('message',{
            data: JSON.stringify({type:'SET_VIEW',lat:${lat},lng:${lng},zoom:15})
          }));
          true;
        `);
      }
    } catch { Alert.alert("Error", "Gagal mencari lokasi"); }
    finally { setLokasiLoading(false); }
  };

  // ─── Photo — native ─────────────────────────────────────────────────────────
  const handlePickNative = useCallback(async () => {
    if (!ImagePicker) return;
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert("Batas Foto", `Maksimal ${MAX_PHOTOS} foto`); return;
    }
    const pick = async () => {
      const { status } = await ImagePicker!.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") { Alert.alert("Izin diperlukan", "Akses galeri"); return; }
      const res = await ImagePicker!.launchImageLibraryAsync({
        mediaTypes: ImagePicker!.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        selectionLimit: MAX_PHOTOS - photos.length,
        quality: 0.8,
      });
      if (!res.canceled) {
        const newP = res.assets.map((a) => ({
          uri: a.uri, name: a.fileName || `photo_${Date.now()}.jpg`, type: a.mimeType || "image/jpeg",
        }));
        setPhotos((p) => [...p, ...newP].slice(0, MAX_PHOTOS));
      }
    };
    const take = async () => {
      const { status } = await ImagePicker!.requestCameraPermissionsAsync();
      if (status !== "granted") { Alert.alert("Izin diperlukan", "Akses kamera"); return; }
      const res = await ImagePicker!.launchCameraAsync({ quality: 0.8 });
      if (!res.canceled) {
        const a = res.assets[0];
        setPhotos((p) => [...p, { uri: a.uri, name: a.fileName || `photo_${Date.now()}.jpg`, type: a.mimeType || "image/jpeg" }].slice(0, MAX_PHOTOS));
      }
    };
    if (Platform.OS === "ios") {
      const { ActionSheetIOS } = require("react-native");
      ActionSheetIOS.showActionSheetWithOptions(
        { options:["Batal","Kamera","Galeri"], cancelButtonIndex:0 },
        (i: number) => { if (i === 1) take(); else if (i === 2) pick(); }
      );
    } else {
      Alert.alert("Tambah Foto", "Pilih sumber", [
        { text:"Kamera", onPress: take },
        { text:"Galeri", onPress: pick },
        { text:"Batal", style:"cancel" },
      ]);
    }
  }, [photos.length]);

  // ─── Photo — web ─────────────────────────────────────────────────────────────
  const handleAddWeb = useCallback((files: FileList) => {
    const arr   = Array.from(files).slice(0, MAX_PHOTOS - photos.length);
    const items: PhotoItem[] = arr.map((f) => ({
      uri: URL.createObjectURL(f), name: f.name, type: f.type, file: f,
    }));
    setPhotos((p) => [...p, ...items].slice(0, MAX_PHOTOS));
    setErrors((p) => ({ ...p, photos: "" }));
  }, [photos.length]);

  // ─── Validate ────────────────────────────────────────────────────────────────
  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!judul.trim()) e.judul = "Judul wajib diisi";
      if (!isi.trim())   e.isi   = "Deskripsi wajib diisi";
      if (!tanggal)      e.tanggal = "Tanggal wajib diisi";
      if (!kategori)     e.kategori = "Kategori wajib dipilih";
    }
    if (s === 2 && photos.length === 0) e.photos = "Minimal 1 foto wajib ditambahkan";
    if (s === 3 && !lokasi.trim())      e.lokasi = "Lokasi wajib dipilih dari peta";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 4));
    scrollRef.current?.scrollTo({ y:0, animated:true });
  };
  const goBack = () => {
    if (step === 1) router.back();
    else setStep((s) => s - 1);
    scrollRef.current?.scrollTo({ y:0, animated:true });
  };

  const resetForm = () => {
    setJudul(""); setIsi(""); setTanggal(today()); setLokasi(""); setSearchQuery("");
    setKategori(""); setKategoriName(""); setPhotos([]); setPanTo(null);
    setStep(1); setErrors({}); setErrorMsg("");
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setLoading(true); setErrorMsg("");
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Silakan login terlebih dahulu");

      const formData = new FormData();
      formData.append("judul_laporan", judul);
      formData.append("isi_laporan", isi);
      formData.append("tanggal_kejadian", tanggal);
      formData.append("lokasi_kejadian", lokasi);
      formData.append("kategori_id", kategori);

      photos.slice(0, MAX_PHOTOS).forEach((p) => {
        if (IS_WEB && p.file) {
          // web: append the actual File object
          formData.append("gambar", p.file);
        } else {
          // native: append RN-style blob descriptor
          formData.append("gambar", { uri: p.uri, name: p.name, type: p.type } as any);
        }
      });

      const res = await fetch(`${API_URL}/api/laporan`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const text = await res.text();
      let data: any;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        const preview = text.replace(/\s+/g, " ").trim().slice(0, 120);
        console.log("laporan submit non-json response", {
          status: res.status,
          contentType: res.headers.get("content-type"),
          body: text.slice(0, 500),
        });
        throw new Error(
          `Server membalas bukan JSON (${res.status}). ${preview || "Cek endpoint API/backend."}`
        );
      }
      if (!res.ok) throw new Error(data.message || "Gagal mengirim laporan");
      setShowSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 1 ──────────────────────────────────────────────────────────────────
  const renderStep1 = () => (
    <View>
      <Field label="Judul Laporan" icon={<FileText size={15} color={GREEN} />} error={errors.judul}>
        <TextInput
          style={[s.input, !!errors.judul && s.inputErr]}
          value={judul}
          onChangeText={(t) => { setJudul(t); setErrors((p) => ({ ...p, judul:"" })); }}
          placeholder="Masukkan judul yang singkat dan jelas"
          placeholderTextColor="#9CA3AF"
        />
      </Field>

      <Field label="Deskripsi Laporan" icon={<FileText size={15} color={GREEN} />} error={errors.isi}>
        <TextInput
          style={[s.textarea, !!errors.isi && s.inputErr]}
          value={isi}
          onChangeText={(t) => { setIsi(t); setErrors((p) => ({ ...p, isi:"" })); }}
          placeholder="Deskripsikan masalah lingkungan secara detail..."
          placeholderTextColor="#9CA3AF"
          multiline textAlignVertical="top"
        />
      </Field>

      <Field label="Tanggal Kejadian" icon={<CalendarDays size={15} color={GREEN} />} error={errors.tanggal}>
        {IS_WEB ? (
          // @ts-ignore — input[type=date] on web
          <input
            type="date"
            value={tanggal}
            onChange={(e: any) => {
              setTanggal(e.target.value);
              setErrors((p) => ({ ...p, tanggal:"" }));
            }}
            style={{
              width:"100%", border:`1.5px solid ${errors.tanggal ? "#EF4444" : "#E5E7EB"}`,
              borderRadius:14, padding:"14px 16px", fontSize:15, color:"#111827",
              backgroundColor: errors.tanggal ? "#FEF2F2" : "#FAFAFA", outline:"none",
            }}
          />
        ) : (
          <>
            <TouchableOpacity
              style={[s.selectBtn, !!errors.tanggal && s.inputErr]}
              onPress={() => setShowDatePicker(!showDatePicker)}
            >
              <CalendarDays size={16} color={tanggal ? GREEN : "#9CA3AF"} />
              <Text style={[s.selectTxt, !tanggal && { color:"#9CA3AF", fontWeight:"400" }]}>
                {tanggal ? fmtDate(tanggal) : "Pilih tanggal"}
              </Text>
              <ChevronDown size={15} color="#9CA3AF" />
            </TouchableOpacity>
            {showDatePicker && (
              <View style={s.datePicker}>
                <TextInput
                  autoFocus style={s.dateInput}
                  value={tanggal}
                  onChangeText={(t) => {
                    const c = t.replace(/[^0-9-]/g, "");
                    setTanggal(c);
                    if (c.length === 10) { setShowDatePicker(false); setErrors((p) => ({ ...p, tanggal:"" })); }
                  }}
                  placeholder={`YYYY-MM-DD  (contoh: ${today()})`}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numbers-and-punctuation"
                  maxLength={10}
                />
              </View>
            )}
          </>
        )}
      </Field>

      <Field label="Kategori Laporan" icon={<Leaf size={15} color={GREEN} />} error={errors.kategori}>
        {IS_WEB ? (
          // @ts-ignore — native select on web
          <select
            value={kategori}
            onChange={(e: any) => {
              setKategori(e.target.value);
              setKategoriName(e.target.options[e.target.selectedIndex]?.text || "");
              setErrors((p) => ({ ...p, kategori:"" }));
            }}
            style={{
              width:"100%", border:`1.5px solid ${errors.kategori ? "#EF4444" : "#E5E7EB"}`,
              borderRadius:14, padding:"14px 16px", fontSize:15, color:"#111827",
              backgroundColor: errors.kategori ? "#FEF2F2" : "#FAFAFA", outline:"none", appearance:"none",
            }}
          >
            <option value="">Pilih kategori laporan</option>
            {kategoriList.map((item) => (
              <option key={item.id} value={item.id}>{item.category_name}</option>
            ))}
          </select>
        ) : (
          <TouchableOpacity
            style={[s.selectBtn, !!errors.kategori && s.inputErr]}
            onPress={() => setShowKategori(true)}
            activeOpacity={0.8}
          >
            <Text style={[s.selectTxt, !kategoriName && { color:"#9CA3AF", fontWeight:"400" }]}>
              {kategoriName || "Pilih kategori laporan"}
            </Text>
            <ChevronDown size={15} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </Field>
    </View>
  );

  // ─── Step 2 ──────────────────────────────────────────────────────────────────
  const renderStep2 = () => (
    <View>
      <View style={s.tipBox}>
        <Camera size={16} color={GREEN} />
        <Text style={s.tipTxt}>
          Tambahkan <Text style={{ fontWeight:"900" }}>1 foto</Text> sebagai bukti.
          {IS_WEB ? " Pilih dari file di komputer/HP." : " Pilih dari kamera atau galeri."}
        </Text>
      </View>

      <PhotoGrid
        photos={photos}
        onAddNative={handlePickNative}
        onAddWeb={handleAddWeb}
        onRemove={(i) => setPhotos((p) => p.filter((_, j) => j !== i))}
      />

      {photos.length > 0 && (
        <View style={{ flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginTop:12 }}>
          <Text style={{ fontSize:12, color:"#6B7280", fontWeight:"600" }}>{photos.length}/{MAX_PHOTOS} foto</Text>
          {photos.length < MAX_PHOTOS && !IS_WEB && (
            <TouchableOpacity onPress={handlePickNative}>
              <Text style={{ fontSize:12, color: GREEN, fontWeight:"800" }}>+ Tambah lagi</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {!!errors.photos && (
        <View style={{ flexDirection:"row", alignItems:"center", gap:5, marginTop:10 }}>
          <AlertCircle size={13} color="#EF4444" />
          <Text style={{ color:"#EF4444", fontSize:12, fontWeight:"600" }}>{errors.photos}</Text>
        </View>
      )}
    </View>
  );

  // ─── Step 3 ──────────────────────────────────────────────────────────────────
  const renderStep3 = () => (
    <View>
      {/* Search */}
      <View style={s.searchRow}>
        <TextInput
          style={s.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Cari nama daerah, jalan..."
          placeholderTextColor="#9CA3AF"
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={s.searchBtn} onPress={handleSearch} disabled={lokasiLoading}>
          {lokasiLoading
            ? <ActivityIndicator size="small" color="#fff" />
            : <Search size={17} color="#fff" />}
        </TouchableOpacity>
      </View>

      {/* Lokasi result */}
      <View style={[s.lokasiBox, !!errors.lokasi && s.inputErr]}>
        <MapPin size={15} color={lokasi ? GREEN : "#9CA3AF"} />
        {lokasiLoading
          ? <ActivityIndicator size="small" color={GREEN} style={{ marginLeft:8 }} />
          : <Text style={[s.lokasiTxt, !lokasi && { color:"#9CA3AF" }]} numberOfLines={2}>
              {lokasi || "Ketuk peta untuk memilih lokasi"}
            </Text>}
      </View>

      {!!errors.lokasi && (
        <View style={{ flexDirection:"row", alignItems:"center", gap:5, marginTop:6, marginBottom:4 }}>
          <AlertCircle size={13} color="#EF4444" />
          <Text style={{ color:"#EF4444", fontSize:12, fontWeight:"600" }}>{errors.lokasi}</Text>
        </View>
      )}

      {/* Map */}
      <View style={[s.mapWrap, !!errors.lokasi && { borderColor:"#EF4444" }]}>
        {IS_WEB ? (
          <WebMapLeaflet onLocationPick={reverseGeocode} panTo={panTo} />
        ) : WebViewComp ? (
          <WebViewComp
            ref={webViewRef}
            source={{ html: LEAFLET_HTML }}
            style={{ flex:1 }}
            onMessage={handleWebViewMessage}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={["*"]}
            scrollEnabled={false}
          />
        ) : null}

        <View style={s.mapHint} pointerEvents="none">
          <MapPin size={12} color="#fff" />
          <Text style={s.mapHintTxt}>Ketuk peta untuk tandai lokasi</Text>
        </View>
      </View>
    </View>
  );

  // ─── Step 4 ──────────────────────────────────────────────────────────────────
  const renderStep4 = () => (
    <View>
      <Text style={s.reviewTitle}>Ringkasan Laporan</Text>
      <View style={s.reviewCard}>
        <ReviewRow label="Judul"    value={judul} />
        <ReviewRow label="Kategori" value={kategoriName} />
        <ReviewRow label="Tanggal"  value={fmtDate(tanggal)} />
        <ReviewRow label="Lokasi"   value={lokasi} last />
      </View>

      <Text style={s.reviewSub}>{photos.length} Foto Terlampir</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
        {photos.map((p, i) => (
          <Image key={i} source={{ uri: p.uri }}
            style={{ width:76, height:76, borderRadius:12, marginRight:8, backgroundColor:"#E5E7EB" }} />
        ))}
      </ScrollView>

      <Text style={s.reviewSub}>Deskripsi</Text>
      <View style={s.descPreview}>
        <Text style={{ fontSize:14, color:"#374151", lineHeight:22 }} numberOfLines={6}>{isi}</Text>
      </View>

      {!!errorMsg && (
        <View style={s.errorBox}>
          <AlertCircle size={17} color="#EF4444" />
          <Text style={{ flex:1, color:"#DC2626", fontSize:13, fontWeight:"600", lineHeight:18 }}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );

  const ICONS  = [<FileText size={20} color={GREEN} />, <Camera size={20} color={GREEN} />, <MapPin size={20} color={GREEN} />, <Send size={20} color={GREEN} />];
  const TITLES = ["Informasi Laporan", "Foto Bukti", "Lokasi Kejadian", "Tinjau & Kirim"];
  const SUBS   = ["Isi detail laporan", "Tambah 1 foto", "Tandai lokasi di peta", "Periksa sebelum kirim"];

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top bar */}
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={goBack}>
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={s.topTitle}>Buat Laporan</Text>
        <View style={{ width:40 }} />
      </View>

      <StepBar current={step} />

      <ScrollView
        ref={scrollRef}
        style={{ flex:1 }}
        contentContainerStyle={{ paddingBottom: bottomClearance }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step heading */}
        <View style={s.stepHd}>
          <View style={s.stepIcon}>{ICONS[step - 1]}</View>
          <View style={{ flex:1 }}>
            <Text style={s.stepTitle}>{TITLES[step - 1]}</Text>
            <Text style={s.stepSub}>{SUBS[step - 1]}</Text>
          </View>
        </View>

        <View style={s.formCard}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </View>

        <View style={s.navRow}>
          {step > 1 && (
            <TouchableOpacity style={s.prevBtn} onPress={goBack}>
              <ArrowLeft size={17} color="#374151" />
              <Text style={s.prevTxt}>Kembali</Text>
            </TouchableOpacity>
          )}
          {step < 4 ? (
            <TouchableOpacity style={[s.nextBtn, step === 1 && { flex:1 }]} onPress={goNext} activeOpacity={0.85}>
              <Text style={s.nextTxt}>Lanjut</Text>
              <ChevronRight size={18} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[s.submitBtn, loading && { opacity:.6 }]}
              onPress={handleSubmit} disabled={loading} activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <><Send size={17} color="#fff" /><Text style={s.submitTxt}>Kirim Laporan</Text></>}
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height:8 }} />
      </ScrollView>

      {/* Modals — native only */}
      {!IS_WEB && (
        <KategoriModal
          visible={showKategori}
          list={kategoriList}
          selected={kategori}
          onSelect={(id, name) => { setKategori(id); setKategoriName(name); setErrors((p) => ({ ...p, kategori:"" })); }}
          onClose={() => setShowKategori(false)}
        />
      )}

      <SuccessModal
        visible={showSuccess}
        onClose={() => { setShowSuccess(false); router.back(); }}
        onNew={() => { setShowSuccess(false); resetForm(); }}
      />
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:      { flex:1, backgroundColor:"#F3F4F6" },
  topBar:    { flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop: Platform.OS === "ios" ? 54 : 14, paddingBottom:12, paddingHorizontal:16, backgroundColor:"#fff", borderBottomWidth:1, borderBottomColor:"#F1F3F5" },
  backBtn:   { width:40, height:40, borderRadius:12, backgroundColor:"#F3F4F6", alignItems:"center", justifyContent:"center" },
  topTitle:  { fontSize:17, fontWeight:"900", color:"#111827" },

  stepHd:    { flexDirection:"row", alignItems:"center", gap:12, marginHorizontal:16, marginTop:16, marginBottom:14 },
  stepIcon:  { width:46, height:46, borderRadius:14, backgroundColor: GREEN_LIGHT, borderWidth:1.5, borderColor:"#D1FAE5", alignItems:"center", justifyContent:"center" },
  stepTitle: { fontSize:17, fontWeight:"900", color:"#111827" },
  stepSub:   { fontSize:12, color:"#6B7280", marginTop:2 },

  formCard:  { backgroundColor:"#fff", marginHorizontal:16, borderRadius:20, padding:20, shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:.06, shadowRadius:12, elevation:3 },

  input:     { borderWidth:1.5, borderColor:"#E5E7EB", borderRadius:14, paddingHorizontal:16, height:52, fontSize:15, color:"#111827", backgroundColor:"#FAFAFA" },
  textarea:  { borderWidth:1.5, borderColor:"#E5E7EB", borderRadius:14, paddingHorizontal:16, paddingVertical:14, fontSize:15, color:"#111827", backgroundColor:"#FAFAFA", minHeight:130 },
  inputErr:  { borderColor:"#EF4444", backgroundColor:"#FEF2F2" },
  selectBtn: { flexDirection:"row", alignItems:"center", justifyContent:"space-between", borderWidth:1.5, borderColor:"#E5E7EB", borderRadius:14, paddingHorizontal:16, height:52, backgroundColor:"#FAFAFA" },
  selectTxt: { flex:1, fontSize:15, color:"#111827", fontWeight:"600" },
  datePicker:{ marginTop:8, backgroundColor:"#F9FAFB", borderRadius:12, padding:12, borderWidth:1, borderColor:"#E5E7EB" },
  dateInput: { fontSize:16, color:"#111827", fontWeight:"600", letterSpacing:1 },

  tipBox:    { flexDirection:"row", alignItems:"flex-start", gap:10, backgroundColor: GREEN_LIGHT, borderRadius:12, padding:12, borderWidth:1, borderColor:"#D1FAE5", marginBottom:16 },
  tipTxt:    { flex:1, fontSize:13, color:"#166534", lineHeight:19 },

  searchRow: { flexDirection:"row", gap:8, marginBottom:10 },
  searchInput:{ flex:1, borderWidth:1.5, borderColor:"#E5E7EB", borderRadius:14, paddingHorizontal:14, height:48, fontSize:14, color:"#111827", backgroundColor:"#FAFAFA" },
  searchBtn: { width:48, height:48, borderRadius:14, backgroundColor: GREEN, alignItems:"center", justifyContent:"center" },
  lokasiBox: { flexDirection:"row", alignItems:"center", gap:10, borderWidth:1.5, borderColor:"#E5E7EB", borderRadius:14, paddingHorizontal:14, minHeight:52, paddingVertical:12, backgroundColor:"#FAFAFA", marginBottom:10 },
  lokasiTxt: { flex:1, fontSize:14, color:"#111827", fontWeight:"500", lineHeight:19 },
  mapWrap:   { borderRadius:18, overflow:"hidden", borderWidth:1.5, borderColor:"#E5E7EB", height:300, position:"relative" },
  mapHint:   { position:"absolute", bottom:10, left:10, right:10, backgroundColor:"rgba(0,0,0,.52)", borderRadius:9, paddingHorizontal:12, paddingVertical:7, flexDirection:"row", alignItems:"center", gap:6 },
  mapHintTxt:{ color:"#fff", fontSize:12, fontWeight:"600" },

  reviewTitle:{ fontSize:16, fontWeight:"900", color:"#111827", marginBottom:12 },
  reviewSub:  { fontSize:13, fontWeight:"800", color:"#374151", marginTop:14, marginBottom:8 },
  reviewCard: { backgroundColor:"#F9FAFB", borderRadius:14, borderWidth:1, borderColor:"#E5E7EB", paddingHorizontal:14 },
  descPreview:{ backgroundColor:"#F9FAFB", borderRadius:12, padding:14, borderWidth:1, borderColor:"#E5E7EB" },
  errorBox:   { flexDirection:"row", alignItems:"flex-start", gap:10, backgroundColor:"#FEF2F2", borderRadius:12, padding:14, borderWidth:1, borderColor:"#FCA5A5", marginTop:14 },

  navRow:    { flexDirection:"row", gap:10, paddingHorizontal:16, marginTop:18 },
  prevBtn:   { flexDirection:"row", alignItems:"center", gap:6, height:52, paddingHorizontal:18, borderRadius:14, borderWidth:1.5, borderColor:"#E5E7EB", backgroundColor:"#fff" },
  prevTxt:   { fontSize:14, fontWeight:"800", color:"#374151" },
  nextBtn:   { flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center", gap:6, height:52, borderRadius:14, backgroundColor: GREEN, shadowColor: GREEN, shadowOffset:{width:0,height:4}, shadowOpacity:.3, shadowRadius:8, elevation:4 },
  nextTxt:   { fontSize:15, fontWeight:"900", color:"#fff" },
  submitBtn: { flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center", gap:8, height:52, borderRadius:14, backgroundColor: GREEN, shadowColor: GREEN, shadowOffset:{width:0,height:4}, shadowOpacity:.3, shadowRadius:8, elevation:4 },
  submitTxt: { fontSize:15, fontWeight:"900", color:"#fff" },
});
