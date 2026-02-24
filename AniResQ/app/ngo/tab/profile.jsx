import React, { useState , useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { Auth_profile } from "../../../Apiendpoint.jsx";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [report, setReport] = useState(true);
  const [volunteer, setVolunteer] = useState(true);
  const [emergency, setEmergency] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(Auth_profile, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      // console.log("Profile Data:", data);

      if (response.ok) {
        setUser(data.user); // or data depending on backend
      } else {
        console.log("Unauthorized:", data);
      }

    } catch (error) {
      console.log("Profile Error:", error);
    }
  };

  fetchProfile();
}, []);

const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          router.replace("/"); 
        },
      },
    ]);
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Settings</Text>

      {/* NGO Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>NGO Information</Text>

        <View style={styles.row}>
          <MaterialIcons name="business" size={22} color="#2e7d32" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.mainText}>{user?.name}</Text>
            <Text style={styles.subText}>{user?.email}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.linkRow}
         onPress={() => {
          if (user) {
            router.push({
              pathname: "/ngo/EditProfile",
              params: { user: JSON.stringify(user) },
            });
          }
        }}>
          <Feather name="edit" size={20} color="#2e7d32" />
          <Text style={styles.linkText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ccc65" />
        </TouchableOpacity>



      </View>

      {/* Notification Preferences */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>

        {renderSwitch(
          "Push Notifications",
          "Receive push notifications on your device",
          push,
          setPush
        )}

        {renderSwitch(
          "Email Notifications",
          "Receive notifications via email",
          email,
          setEmail
        )}

        {renderSwitch(
          "Report Updates",
          "Get notified when reports are updated",
          report,
          setReport
        )}

        {renderSwitch(
          "Volunteer Requests",
          "Get notified of new volunteer applications",
          volunteer,
          setVolunteer
        )}

        {renderSwitch(
          "Emergency Alerts",
          "Receive urgent notifications for critical cases",
          emergency,
          setEmergency
        )}
      </View>

      {/* App Settings */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>App Settings</Text>

        {renderNavItem("Dashboard")}
        {renderNavItem("Statistics")}
        {renderNavItem("Reports")}
        {renderNavItem("Volunteers")}
      </View>

      {/* Advanced Settings */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Advanced Settings</Text>

        {renderNavItem("Reset All Settings")}
        {renderNavItem("About")}
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function renderSwitch(title, subtitle, value, setValue) {
  return (
    <View style={styles.switchRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.mainText}>{title}</Text>
        <Text style={styles.subText}>{subtitle}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={setValue}
        trackColor={{ false: "#c8e6c9", true: "#66bb6a" }}
        thumbColor={value ? "#2e7d32" : "#f4f3f4"}
      />
    </View>
  );
}

function renderNavItem(title) {
  return (
    <TouchableOpacity style={styles.navRow}>
      <Text style={styles.mainText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#9ccc65" />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f8f4",
    padding: 16,
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2e7d32",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  mainText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#263238",
  },

  subText: {
    fontSize: 13,
    color: "#78909c",
    marginTop: 2,
  },

  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  linkText: {
    flex: 1,
    marginLeft: 10,
    fontWeight: "600",
    color: "#2e7d32",
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

  logoutBtn: {
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 4,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 16,
  },
});