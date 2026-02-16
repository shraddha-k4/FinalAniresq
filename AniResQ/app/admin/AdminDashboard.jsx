import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Admin_Dashboard_Stats } from "../../Apiendpoint.jsx"; // path adjust
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";


const StatCard = ({ title, value }) => (
  <View style={styles.card}>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
  </View>
);

export default function AdminDashboard() {
  const router = useRouter();
 

  const [stats, setStats] = useState({
    totalReports: 0,
    ongoingRescues: 0,
    completedRescues: 0,
    blacklistedUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch(Admin_Dashboard_Stats, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (data.success) {
      setStats(data.stats);
    }
  } catch (error) {
    console.log(error);
  }
};

    fetchStats();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.heading}> Admin Dashboard</Text> */}
      <LinearGradient
        colors={["#4c6ef5", "#7b2ff7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.heading}>Admin Dashboard</Text>
      </LinearGradient>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <StatCard title="Total Reports" value={stats.totalReports} />
        <StatCard title="Ongoing Rescues" value={stats.ongoingRescues} />
        <StatCard title="Completed Rescues" value={stats.completedRescues} />
        <StatCard title="Blacklisted Users" value={stats.blacklistedUsers} />
      </View>

      {/* Management Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Management</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("../admin/ManageUsers")}
        >
          <Text style={styles.buttonText}>Manage Citizen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("../admin/NGOManagement")}
        >
          <Text style={styles.buttonText}>Manage NGOs</Text>
        </TouchableOpacity>

         <TouchableOpacity
          style={[styles.button, { backgroundColor: "#e11e1e" }]}
          onPress={() => router.push("../admin/Blacklist")}
        >
          <Text style={styles.buttonText}>
            View False Reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#e11e1e" }]}
          onPress={() => router.push("../admin/Blacklist")}
        >
          <Text style={styles.buttonText}>
            View Blacklisted Accounts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Analytics Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analytics Overview</Text>
        <View style={styles.analyticsBox}>
          <Text style={styles.analyticsText}>
            Reports have increased by 18% this month.
          </Text>
          <Text style={styles.analyticsText}>
            Average rescue time: 2.3 days
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
   },
   header: {
    padding:6,
  paddingVertical: 15,
  borderRadius: 15,
  marginBottom: 20,
  alignItems: "center",
},
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#ffffff",
    width: "48%",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  cardTitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  button: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  analyticsBox: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  analyticsText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#444",
  },
});
