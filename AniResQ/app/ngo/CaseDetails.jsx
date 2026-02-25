import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CaseDetails() {
  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.headerTitle}>Case #AC-2846</Text>
        <Image
          source={{
           // uri: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
          }}
          style={styles.logo}
        />
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>In Progress</Text>
        </View>
        <Text style={styles.reportDate}>Reported on Dec 15, 2024</Text>
      </View>

      {/* ANIMAL INFO */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Animal Information</Text>

        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1543852786-1cf6624b9987",
          }}
          style={styles.animalImage}
        />

        <InfoRow label="Animal Type" value="Domestic Cat" />
        <InfoRow label="Condition" value="Malnourished" />
        <InfoRow label="Estimated Age" value="6-8 months" />
        <InfoRow label="Found At" value="Riverside Area, Near Bridge" />
      </View>

      {/* REPORTED BY */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reported By</Text>

        <View style={styles.reportRow}>
          <Image
            source={{
              uri: "https://randomuser.me/api/portraits/men/32.jpg",
            }}
            style={styles.profile}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Mike Chen</Text>
            <Text style={styles.smallText}>mike.chen@email.com</Text>
            <Text style={styles.smallText}>+1 (555) 123-4567</Text>
          </View>
          <TouchableOpacity style={styles.contactBtn}>
            <Text style={{ color: "#fff" }}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TIMELINE */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Case Timeline & Updates</Text>

        <TimelineItem
          title="Veterinary Assessment Completed"
          desc="Initial health check completed. Animal is stable but requires monitoring for 48 hours."
        />
        <TimelineItem
          title="Rescue Team Deployed"
          desc="Emergency response team dispatched and animal transported to facility."
        />
        <TimelineItem
          title="Case Reported"
          desc="Initial report received and assigned for immediate action."
        />
      </View>

      {/* TREATMENT */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Treatment Documentation</Text>

        <View style={styles.photoRow}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1517849845537-4d257902454a",
            }}
            style={styles.treatmentImg}
          />
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
            }}
            style={styles.treatmentImg}
          />
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb",
            }}
            style={styles.treatmentImg}
          />
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>Latest Treatment Notes</Text>
          <Text style={styles.noteText}>
            Patient responding well to treatment. Appetite improved.
            Continue medication for 5 more days. Follow-up scheduled next week.
          </Text>
        </View>
      </View>

      {/* BUTTONS */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveBtn}>
          <Text>Save Case</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareBtn}>
          <Text style={{ color: "#fff" }}>Share Updates</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  statusBadge: {
    backgroundColor: "#a5d6a7",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: { color: "#1b5e20", fontWeight: "600" },
  reportDate: { color: "#555" },

  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 15,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1b5e20",
  },

  animalImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f1f8e9",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  label: { color: "#555" },
  value: { fontWeight: "600", color: "#1b5e20" },

  reportRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profile: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  name: { fontWeight: "bold", fontSize: 16 },
  smallText: { color: "#666", fontSize: 12 },
  contactBtn: {
    backgroundColor: "#2e7d32",
    padding: 8,
    borderRadius: 8,
  },

  timelineItem: {
    flexDirection: "row",
    marginBottom: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2e7d32",
    marginRight: 10,
    marginTop: 5,
  },
  timelineTitle: { fontWeight: "600", color: "#1b5e20" },
  timelineDesc: { fontSize: 12, color: "#555" },

  photoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  treatmentImg: {
    width: "30%",
    height: 80,
    borderRadius: 10,
  },

  noteBox: {
    backgroundColor: "#e8f5e9",
    padding: 10,
    borderRadius: 10,
  },
  noteTitle: { fontWeight: "bold", marginBottom: 5, color: "#1b5e20" },
  noteText: { fontSize: 13, color: "#333" },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 15,
  },
  saveBtn: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  shareBtn: {
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
});