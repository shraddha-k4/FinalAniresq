import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SuccessUpdate() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4FFFA" />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#065F46" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Confirmation</Text>
      </View>

      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={40} color="#fff" />
        </View>
      </View>

      {/* Main Title */}
      <Text style={styles.title}>Update Saved Successfully!</Text>
      <Text style={styles.subtitle}>
        Your case update has been recorded and the reporter will be notified shortly.
      </Text>

      {/* Details Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Case ID</Text>
          <Text style={styles.value}>#ANM2024-0847</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Reporter</Text>
          <Text style={styles.value}>Rahul Sharma</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Animal Type</Text>
          <Text style={styles.value}>Stray Dog</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Updated On</Text>
          <Text style={styles.value}>Dec 28, 2024 - 3:45 PM</Text>
        </View>
      </View>

      {/* Notification Card */}
      <View style={styles.notifyCard}>
        <Ionicons name="notifications" size={24} color="#065F46" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.notifyTitle}>Notification Sent</Text>
          <Text style={styles.notifySub}>
            Reporter will receive update via SMS and Email
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => router.replace("/ngo/tab/home")}
      >
        <Text style={styles.primaryText}>Back to Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => router.replace("/ngo/tab/cases")}
      >
        <Text style={styles.secondaryText}>View All Cases</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4FFFA",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    color: "#065F46",
  },

  iconContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  iconCircle: {
    backgroundColor: "#16A34A",
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#065F46",
  },

  subtitle: {
    textAlign: "center",
    color: "#4B5563",
    marginTop: 10,
    marginBottom: 25,
    paddingHorizontal: 10,
  },

  card: {
    backgroundColor: "#E6FFF4",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  label: {
    color: "#065F46",
  },

  value: {
    fontWeight: "bold",
    color: "#064E3B",
  },

  notifyCard: {
    flexDirection: "row",
    backgroundColor: "#DCFCE7",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 30,
  },

  notifyTitle: {
    fontWeight: "bold",
    color: "#065F46",
  },

  notifySub: {
    fontSize: 13,
    color: "#4B5563",
  },

  primaryBtn: {
    backgroundColor: "#16A34A",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "bold",
  },

  secondaryBtn: {
    backgroundColor: "#DCFCE7",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
  },

  secondaryText: {
    color: "#166534",
    fontWeight: "bold",
  },
});