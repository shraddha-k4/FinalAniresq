import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NGO_Accept_all_Report } from "../../../Apiendpoint.jsx";

export default function Cases() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(NGO_Accept_all_Report, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data.reports || []);
    } catch (error) {
      console.log("Fetch Error:", error.response?.data || error.message);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4FFFA" />

      {/* Fixed Page Title */}
      <View style={styles.pageTitleWrapper}>
        <Text style={styles.pageTitle}>Reported Case Details</Text>
      </View>

      {/* Scrollable Reports */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {reports.length === 0 ? (
          <View style={styles.loader}>
            <Text>No Accepted Cases</Text>
          </View>
        ) : (
          reports.map((report) => (
            <View style={styles.mainCard} key={report._id}>
              <LinearGradient
                colors={["#DFFFEF", "#C6F6E3"]}
                style={styles.header}
              >
                <View style={styles.topRow}>
                  <Text style={styles.caseId}>#{report._id.slice(-6)}</Text>
                  <View style={styles.newBadge}>
                    <Text style={styles.newText}>{report.status}</Text>
                  </View>
                </View>

                <View style={styles.userRow}>
                  <Image
                    source={
                      report.user?.profileImage
                        ? { uri: report.user.profileImage }
                        : require("../../../assets/image/profile.png")
                    }
                    style={styles.avatar}
                  />
                  <View>
                    <Text style={styles.userName}>
                      {report.user?.name || "User"}
                    </Text>
                    <Text style={styles.location}>
                      {report.address || "Location not provided"}
                    </Text>
                  </View>
                </View>
              </LinearGradient>

              <View style={styles.imageWrapper}>
                <Image
                  source={
                    report.image
                      ? { uri: report.image }
                      : require("../../../assets/image/profile.png")
                  }
                  style={styles.animalImage}
                />
              </View>

              <View style={styles.detailsSection}>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Animal Type:</Text>
                  <Text style={styles.value}>{report.animalType}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Behavior:</Text>
                  <Text style={styles.value}>{report.behavior}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Injured:</Text>
                  <Text style={styles.value}>{report.injured}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Reported:</Text>
                  <Text style={styles.value}>
                    {new Date(report.createdAt).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Human Harm:</Text>
                  <Text style={styles.value}>{report.humanHarm}</Text>
                </View>
              </View>

              <View style={styles.buttonInside}>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() =>
                    router.push(`/ngo/update-status?id=${report._id}`)
                  }
                >
                  <Text style={styles.primaryText}>Update Case</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4FFFA" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  pageTitleWrapper: {
    backgroundColor: "#f1f8f4",
    paddingVertical: 16,
    paddingHorizontal: 15,
    elevation: 4,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#064E3B",
  },
  scrollContainer: { flex: 1,marginTop:10, },
  mainCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 5,
    marginBottom: 20,
  },
  header: { padding: 20 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  caseId: { fontSize: 20, fontWeight: "bold", color: "#0F5132" },
  newBadge: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  newText: { color: "#fff", fontWeight: "600" },
  userRow: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  avatar: { width: 55, height: 55, borderRadius: 30, marginRight: 12 },
  userName: { fontSize: 18, fontWeight: "bold", color: "#14532D" },
  location: { color: "#4B5563", marginTop: 3 },
  imageWrapper: { paddingHorizontal: 15, marginTop: 15 },
  animalImage: { width: "100%", height: 220, borderRadius: 15 },
  detailsSection: { backgroundColor: "#E6FFF4", padding: 18, marginTop: 15 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  label: { fontSize: 15, color: "#065F46" },
  value: { fontWeight: "bold", color: "#064E3B" },
  buttonInside: { paddingHorizontal: 18, padding: 20 },
  primaryBtn: {
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "bold" },
});