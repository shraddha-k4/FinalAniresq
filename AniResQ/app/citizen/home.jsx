import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Auth_profile } from "../../Apiendpoint.jsx";

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(Auth_profile, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.log("Home profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* Header */}
        <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/aniresq.png")}
            style={styles.logoImage}
          />
          <Text style={styles.logo}>AniResQ</Text>
        </View>

          {/* Profile Avatar */}
          <TouchableOpacity onPress={() => router.push("/citizen/profile")}>
            <Image
              source={
                user?.image
                  ? { uri: user.image } // ✅ backend image
                  : require("../../assets/image/profile.png")
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            Welcome, {user?.name || "User"} 👋
          </Text>
          <Text style={styles.welcomeText}>
            Together we can make a difference for animals in need.
            Report, track, and help create a safer world for wildlife.
          </Text>
        </View>

        {/* Action Cards */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/citizen/report")}
        >
          <MaterialIcons name="report-problem" size={28} color="#E53935" />
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Report Animal Abuse</Text>
            <Text style={styles.actionSub}>Help animals in distress</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}
        onPress={() => router.push("/citizen/AI_alert")}>
          <Ionicons name="alert-circle" size={28} color="#FB8C00" />
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Wildlife Alerts</Text>
            <Text style={styles.actionSub}>
              Stay informed about nearby wildlife
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}
        onPress={() => router.push("/citizen/reportHistory")}>
          <Ionicons name="time-outline" size={28} color="#1E88E5" />
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Report History</Text>
            <Text style={styles.actionSub}>
              Track your submitted reports
            </Text>
          </View>
        </TouchableOpacity>

        {/* NGO Updates */}
        <Text style={[styles.sectionTitle, { marginLeft: 16 }]}>
          NGO Updates
        </Text>

        <View style={styles.ngoCard}>
          <FontAwesome5 name="heart" size={22} color="#2E7D32" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.ngoTitle}>Animal Welfare NGO</Text>
            <Text style={styles.ngoText}>
              We’ve successfully rescued 15 animals this week.
              Thanks to all volunteers & supporters.
            </Text>
            <Text style={styles.ngoStats}>❤️ 24   💬 8</Text>
          </View>
        </View>
      </ScrollView> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {  backgroundColor: "white" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding:2,
    backgroundColor:"white",
     elevation: 4, // Android shadow
  },

  logo: { fontSize:10, fontWeight: "800", color: "#2E7D32" },

  profileImage: { width: 40, height:40, borderRadius: 19,marginRight:8 },

  welcomeCard: {
    backgroundColor: "#2E7D32",
    margin: 14,
    borderRadius: 14,
    padding: 18,
  },

  welcomeTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  welcomeText: {
    color: "#E8F5E9",
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },

  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 18,
    borderRadius: 12,
    elevation: 3,
  },
  logoContainer: {
  flexDirection: "row",
  alignItems: "center",
},

logoImage: {
  width:65,
  height: 60,
  borderRadius: 6,
  marginRight: 8,
},

logo: {
  fontSize: 20,
  fontWeight: "800",
  color: "#2E7D32",
},


  actionText: { marginLeft: 14 },
  actionTitle: { fontSize: 16, fontWeight: "600" },
  actionSub: { color: "#777", fontSize: 13, marginTop: 2 },

  sectionTitle: { fontWeight: "700", fontSize: 17 },

  ngoCard: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },

  ngoTitle: { fontWeight: "700", fontSize: 15 },
  ngoText: {
    fontSize: 13,
    marginTop: 6,
    color: "#555",
    lineHeight: 18,
  },
  ngoStats: { fontSize: 13, marginTop: 8, color: "#444" },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderColor: "#ddd",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  navItem: { alignItems: "center" },
  navLabel: { fontSize: 12, color: "#777", marginTop: 4 },
});
