import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Auth_profile } from "../../../Apiendpoint.jsx";

/* ---------- DATE FORMAT ---------- */
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addressText, setAddressText] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ---------- FETCH PROFILE ---------- */
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

      // Convert latitude/longitude to address
      if (data.user?.address?.latitude && data.user?.address?.longitude) {
        const addr = await Location.reverseGeocodeAsync({
          latitude: data.user.address.latitude,
          longitude: data.user.address.longitude,
        });

        if (addr.length > 0) {
          const place = addr[0];
          setAddressText(
            `${place.city || ""}, ${place.region || ""}, ${
              place.country || ""
            }`
          );
        }
      }
    } catch (err) {
      console.log("Profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={26}
          color="black"
          onPress={() => router.replace("/ngo/tab/home")}
        />
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <Image
          source={
            user?.image
              ? { uri: user.image }
              : require("../../../assets/image/profile.png")
          }
          style={styles.profileImg}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>{user?.role}</Text>
      </View>

      {/* INFO CARD */}
      <View style={styles.infoCard}>
        <InfoRow icon="mail" text={user?.email} />
        <InfoRow icon="call" text={String(user?.mobileno || "")} />
        <InfoRow icon="location-on" text={addressText || "-"} />
        <InfoRow
          icon="calendar-today"
          text={`Joined on ${formatDate(user?.createdAt)}`}
        />
      </View>

       {/* REGISTRATION ID */}
       {user?.regiid ? (
         <>
           <Text style={styles.sectionTitle}>Registration ID</Text>
           <View style={styles.aboutCard}>
             <Text style={styles.aboutText}>{user.regiid}</Text>
           </View>
         </>
       ) : null}

       {/* ABOUT US */}
       {user?.aboutus ? (
         <>
           <Text style={styles.sectionTitle}>About Us</Text>
           <View style={styles.aboutCard}>
             <Text style={styles.aboutText}>{user.aboutus}</Text>
           </View>
         </>
       ) : null}

       {/* OUR MISSION */}
       {user?.mission ? (
         <>
           <Text style={styles.sectionTitle}>Our Mission</Text>
           <View style={styles.aboutCard}>
             <Text style={styles.aboutText}>{user.mission}</Text>
           </View>
         </>
       ) : null}



      {/* EDIT PROFILE */}
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() =>
          router.push({
            pathname: "/ngo/EditProfile",
            params: { user: JSON.stringify(user) },
          })
        }
      >
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={async () => {
          await AsyncStorage.removeItem("token");
          router.replace("/");
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------- INFO ROW ---------- */
const InfoRow = ({ icon, text }) => (
  <View style={styles.infoRow}>
    <MaterialIcons name={icon} size={22} color="#6B7280" />
    <Text style={styles.infoText}>{text || "-"}</Text>
  </View>
);

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 10,
    padding:10,
    color: "#1B1B1B",
  },

  profileCard: {
    backgroundColor: "#2E7D32",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },

  profileImg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },

  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },

  role: {
    color: "#EDE9FE",
    fontSize: 14,
  },

  infoCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },

  infoText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#374151",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginVertical: 12,
    color: "#111827",
  },

  aboutCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
  },

  aboutText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },

  editBtn: {
    backgroundColor: "#2E7D32",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },

  editText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  logoutBtn: {
    backgroundColor: "#E5E7EB",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 40,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
});
