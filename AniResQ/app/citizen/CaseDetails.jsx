import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Get_all_report } from "../../Apiendpoint.jsx";

// Import your default local image
import DefaultProfile from "../../assets/image/profile.png";

export default function CaseDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // get ID from route
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(Get_all_report, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data.success) {
          const reportItem = data.reports.find((r) => r._id === id);
          setReport(reportItem || null);
        }
      } catch (err) {
        console.log("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) return <Text style={{ padding: 20 }}>Loading...</Text>;
  if (!report) return <Text style={{ padding: 20 }}>Report not found.</Text>;

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Case #{report._id.slice(-5)}</Text>
        <View style={styles.logo} />
      </View>

      {/* STATUS */}
      <View style={styles.statusRow}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{report.status}</Text>
        </View>
        <Text style={styles.reportDate}>
          Reported on {new Date(report.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {/* ANIMAL INFO */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Animal Information</Text>

        <Image
          source={report.image ? { uri: report.image } : DefaultProfile}
          style={styles.animalImage}
        />

        <InfoRow label="Animal Type" value={report.animalType || "Unknown"} />
        <InfoRow label="Condition" value={report.injured || "Unknown"} />
        <InfoRow label="Found At" value={report.address || "Not specified"} />
      </View>

      {/* REPORTED BY */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reported By</Text>
        <View style={styles.reportRow}>
          <Image
            source={
              report.user?.avatar
                ? { uri: report.user.avatar }
                : DefaultProfile
            }
            style={styles.profile}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{report.user?.name || "Unknown"}</Text>
            <Text style={styles.smallText}>{report.user?.email || "-"}</Text>
          </View>
          <TouchableOpacity style={styles.contactBtn}>
            <Text style={{ color: "#fff" }}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TIMELINE & TREATMENT */}
      {report.updates?.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Case Timeline & Updates</Text>
          {report.updates.map((update) => (
            <TimelineItem
              key={update._id}
              title={update.status}
              desc={update.description}
            />
          ))}

          <View style={styles.photoRow}>
            {report.updates[0]?.media?.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.treatmentImg} />
            ))}
          </View>

          {report.updates[0]?.veterinaryNotes && (
            <View style={styles.noteBox}>
              <Text style={styles.noteTitle}>Latest Treatment Notes</Text>
              <Text style={styles.noteText}>
                {report.updates[0].veterinaryNotes}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* BUTTONS */}
      {/* <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveBtn}>
          <Text>Save Case</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={{ color: "#fff" }}>Share Updates</Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
}

// Components
const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const TimelineItem = ({ title, desc }) => (
  <View style={styles.timelineItem}>
    <View style={styles.dot} />
    <View style={{ flex: 1 }}>
      <Text style={styles.timelineTitle}>{title}</Text>
      <Text style={styles.timelineDesc}>{desc}</Text>
    </View>
  </View>
);

// styles (same as before)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4fff6" },
  header: {
    backgroundColor: "#2e7d32",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  logo: { width: 30, height: 30 },
  statusRow: { flexDirection: "row", justifyContent: "space-between", padding: 15 },
  statusBadge: { backgroundColor: "#a5d6a7", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  statusText: { color: "#1b5e20", fontWeight: "600" },
  reportDate: { color: "#555" },
  card: { backgroundColor: "#fff", margin: 15, padding: 15, borderRadius: 15, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#1b5e20" },
  animalImage: { width: "100%", height: 200, borderRadius: 12, marginBottom: 10 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#f1f8e9", padding: 10, borderRadius: 8, marginVertical: 5 },
  label: { color: "#555" },
  value: { fontWeight: "600", color: "#1b5e20" },
  reportRow: { flexDirection: "row", alignItems: "center" },
  profile: { width: 60, height: 60, borderRadius: 30, marginRight: 10 },
  name: { fontWeight: "bold", fontSize: 16 },
  smallText: { color: "#666", fontSize: 12 },
  contactBtn: { backgroundColor: "#2e7d32", padding: 8, borderRadius: 8 },
  timelineItem: { flexDirection: "row", marginBottom: 15 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#2e7d32", marginRight: 10, marginTop: 5 },
  timelineTitle: { fontWeight: "600", color: "#1b5e20" },
  timelineDesc: { fontSize: 12, color: "#555" },
  photoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  treatmentImg: { width: "30%", height: 80, borderRadius: 10 },
  noteBox: { backgroundColor: "#e8f5e9", padding: 10, borderRadius: 10 },
  noteTitle: { fontWeight: "bold", marginBottom: 5, color: "#1b5e20" },
  noteText: { fontSize: 13, color: "#333" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", margin: 15 },
  saveBtn: { backgroundColor: "#e0e0e0", padding: 12, borderRadius: 10, width: "48%", alignItems: "center" },
  shareBtn: { backgroundColor: "#2e7d32", padding: 12, borderRadius: 10, width: "48%", alignItems: "center" },
});