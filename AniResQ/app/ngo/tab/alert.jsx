import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function alert() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.logoRow}>
            {/* <Image
              source={require("../../assets/aniresq.png")}
              style={styles.logo}
            /> */}
            <Text style={styles.appName}></Text>
          </View>
        </View>

        <Text style={styles.title}>AI Wildlife Alerts</Text>
        <Text style={styles.subtitle}>
          Real-time detection & monitoring
        </Text>

        {/* ================= STATS ================= */}
        <View style={styles.statsRow}>
          <View style={styles.card}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statText}>Active Alerts</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statText}>Total Detected</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statText}>Accuracy</Text>
          </View>
        </View>
      </View>

      {/* ================= RECENT DETECTIONS ================= */}
      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Detections</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>

        <View style={styles.detectCard}>
          
        <Image
  source={require("../../../assets/tiger.jpeg")}
  style={styles.detectImage}
  resizeMode="cover"
/>

          <View style={styles.detectContent}>
            
            <View style={styles.rowBetween}>
              <Text style={styles.animalName}>Bengal Tiger</Text>
              <View style={styles.criticalBadge}>
                <Text style={styles.badgeText}>Critical</Text>
              </View>
            </View>

            <Text style={styles.location}>
              Sundarbans National Park, Zone A3
            </Text>

            <View style={styles.rowBetween}>
              <Text style={styles.time}>Detected 12 minutes ago</Text>
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>99% Match</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() => router.push("/ngo/alert_details")}
              >
                <Text style={styles.detailsText}>View Details</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareBtn}>
                <Text style={styles.shareText}>Share Alert</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4fff7",
  },

  header: {
    backgroundColor: "#0f9d58",
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 35,
    height: 35,
    borderRadius: 8,
    marginRight: 8,
  },

  appName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 25,
  },

  subtitle: {
    color: "#d9ffe6",
    marginTop: 6,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  card: {
    backgroundColor: "#ffffff",
    width: "30%",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    elevation: 6,
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f9d58",
  },

  statText: {
    fontSize: 12,
    marginTop: 5,
    color: "#555",
  },

  recentSection: {
    padding: 20,
  },

  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  recentTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  viewAll: {
    color: "#0f9d58",
    fontWeight: "600",
  },

  detectCard: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    marginTop: 18,
    overflow: "hidden",
    elevation: 8,
  },

  detectImage: {
    width: "100%",
    height: 220,
  },

  detectContent: {
    padding: 18,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  animalName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },

  criticalBadge: {
    backgroundColor: "#ffe5e5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: "red",
    fontSize: 12,
    fontWeight: "600",
  },

  location: {
    marginTop: 8,
    color: "#444",
    fontSize: 14,
  },

  time: {
    marginTop: 12,
    fontSize: 12,
    color: "#777",
  },

  matchBadge: {
    backgroundColor: "#d4f8dd",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  matchText: {
    color: "#0f9d58",
    fontSize: 12,
    fontWeight: "600",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  detailsBtn: {
    backgroundColor: "#0f9d58",
    padding: 14,
    borderRadius: 15,
    width: "48%",
    alignItems: "center",
  },

  detailsText: {
    color: "#fff",
    fontWeight: "bold",
  },

  shareBtn: {
    backgroundColor: "#e0f7e9",
    padding: 14,
    borderRadius: 15,
    width: "48%",
    alignItems: "center",
  },

  shareText: {
    color: "#0f9d58",
    fontWeight: "600",
  },
});