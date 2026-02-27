import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { GetAiWildDetection } from "../../Apiendpoint.jsx";
import { Video } from "expo-av";
export default function WildlifeAlerts() {
  const router = useRouter();
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetections();
  }, []);

  const fetchDetections = async () => {
    try {
      const response = await axios.get(GetAiWildDetection);
      setDetections(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching detections:", error);
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.logoRow}>
            <Text style={styles.appName}></Text>
          </View>
        </View>

        <Text style={styles.title}>AI Wildlife Alerts</Text>
        <Text style={styles.subtitle}>
          Real-time detection & monitoring
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.card}>
            <Text style={styles.statNumber}>
              {detections.filter(d => d.status === "Critical Alert").length}
            </Text>
            <Text style={styles.statText}>Active Alerts</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.statNumber}>{detections.length}</Text>
            <Text style={styles.statText}>Total Detected</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statText}>Accuracy</Text>
          </View>
        </View>
      </View>

      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Detections</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0f9d58" />
        ) : (
          detections.map((item) => (
            <View key={item._id} style={styles.detectCard}>
              {item.videoUrl ? (
  <Image
    source={{ uri: item.videoUrl }}
    style={styles.detectImage}
    resizeMode="cover"
  />
) : item.videoUrl ? (
  <Video
    source={{ uri: item.videoUrl }}
    style={styles.detectImage}
    useNativeControls
    resizeMode="cover"
    isLooping
    shouldPlay={false} // set to true if you want auto-play
  />
) : null}

              <View style={styles.detectContent}>
                <View style={styles.rowBetween}>
                  <Text style={styles.animalName}>{item.animal}</Text>
                  <View style={styles.criticalBadge}>
                    <Text style={styles.badgeText}>{item.status}</Text>
                  </View>
                </View>

                <Text style={styles.location}>
                  {item.locationName}
                </Text>

                <View style={styles.rowBetween}>
                  <Text style={styles.time}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>
                      {item.confidence}% Match
                    </Text>
                  </View>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.detailsBtn}
                    onPress={() =>
                      router.push(`/citizen/alert_details?id=${item._id}`)
                    }
                  >
                    <Text style={styles.detailsText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}



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