import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Get_all_report } from "../../Apiendpoint.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function AllReportedCasesScreen() {
  const [reports, setReports] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch(Get_all_report, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (data.success) {
          setReports(data.reports);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchReports();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Reported Cases</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search by case ID, location..."
          placeholderTextColor="#8A8A8A"
          style={styles.searchInput}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <View style={[styles.tab, styles.activeTab]}>
          <Text style={styles.activeTabText}>All Cases</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>In Progress</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>Resolved</Text>
        </View>
      </View>

      {/* Dynamic Case Cards */}
      {reports.map((item) => (
        <View key={item._id} style={styles.caseCard}>
          <View style={styles.caseHeader}>
            <Text style={styles.caseId}>
              Case #{item._id.slice(-5)}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {item.status}
              </Text>
            </View>
          </View>

          <Text style={styles.caseInfo}>
            ■ Reported by: {item.user?.name}
          </Text>
          <Text style={styles.caseInfo}>
            ■ {item.address}
          </Text>

          <View style={styles.caseInner}>
            <Image
              source={{
                uri: item.image || "https://via.placeholder.com/100"
              }}
              style={styles.caseImage}
            />

            <View>
              <Text style={styles.caseTitle}>
                {item.animalType} animal
              </Text>
              <Text style={styles.caseDesc}>
                Injured: {item.injured}
              </Text>
            </View>
          </View>

          <View style={styles.caseFooter}>
            <Text style={styles.timeText}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        </View>
      ))}

    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6FA" },

  header: {
    backgroundColor: "#2E7D32",
    paddingTop:14,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backText: { fontSize: 18, color: "#fff" },
  headerTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  logo: { width: 36, height: 36, borderRadius: 6 },

  searchBox: { padding: 16 },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
  },

  tabs: { flexDirection: "row", paddingHorizontal: 16, gap: 10 },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#2E7D32",
  },
  activeTab: { backgroundColor: "#fff" },
  tabText: { color: "#fff", fontWeight: "600" },
  activeTabText: { color: "#2E7D32", fontWeight: "700" },

  statsRow: { flexDirection: "row", padding: 16, gap: 16 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  statNumber: { fontSize: 28, fontWeight: "800", color: "#1F2937" },
  statLabel: { color: "#6B7280", marginTop: 4 },
  statUp: { color: "#16A34A", marginTop: 8, fontWeight: "600" },
  statDown: { color: "#16A34A", marginTop: 8, fontWeight: "600" },

  caseCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 16,
    padding: 16,
  },
  caseHeader: { flexDirection: "row", alignItems: "center" },
  caseId: { fontSize: 16, fontWeight: "700", flex: 1 },
  statusBadge: {
    backgroundColor: "#FFE8B3",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { color: "#F59E0B", fontWeight: "700" },

  caseInfo: { color: "#4B5563", marginTop: 10 },

  caseInner: {
    backgroundColor: "#F8FAFF",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
    alignItems: "center",
  },
  caseImage: { width: 56, height: 56, borderRadius: 12 },
  caseTitle: { fontSize: 16, fontWeight: "700" },
  caseDesc: { color: "#6B7280", marginTop: 4 },

  caseFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  timeText: { flex: 1, color: "#9CA3AF" },
  detailsBtn: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  detailsText: { color: "#fff", fontWeight: "700" },
});
