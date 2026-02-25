import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Auth_Get_NGO,sendVolunteerRequest} from "../../Apiendpoint.jsx";

export default function NGODetails() {
  const router = useRouter();
  const [ngo, setNgo] = useState(null);
  const { id } = useLocalSearchParams();

useEffect(() => {
  if (!id) return; 

  const fetchNgo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(Auth_Get_NGO, {
        headers: { Authorization: `Bearer ${token}` },
      });

      //console.log("API NGOs:", res.data.ngos);

      const ngoData = res.data.ngos.find(
        n => n._id.toString() === id.toString()
      );

      //console.log("Selected NGO:", ngoData);

      if (ngoData) {
        setNgo({
          name: ngoData.name,
          email: ngoData.email,
          phone: ngoData.mobileno,
          about: ngoData.aboutus,
          mission: ngoData.mission,
          image: ngoData.image,
          latitude: ngoData.address?.latitude,
          longitude: ngoData.address?.longitude,
        });
      } else {
        Alert.alert("NGO not found");
      }
    } catch (error) {
      console.log("NGO Fetch Error:", error.message);
    }
  };

  fetchNgo();
}, [id]);

  // 👉 Open Google Maps
  const openMap = () => {
  const lat = ngo?.latitude;
  const lng = ngo?.longitude;

  if (!lat || !lng) {
    Alert.alert("Location not available");
    return;
  }

  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  Linking.openURL(url).catch(() =>
    Alert.alert("Unable to open Google Maps")
  );
};

  // Volunteer Apply
  
const handleApply = () => {
  Alert.alert(
    "Apply as Volunteer",
    `Apply for ${ngo?.name || "this NGO"}?`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Apply",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");

            await axios.post(
              sendVolunteerRequest,
              { ngoId: id },   // 👉 useLocalSearchParams मधला id
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            Alert.alert("Success", "Request Submitted Successfully! ✅");
          }catch (error) {
            const errorMessage =
              error.response?.data?.message || "Failed to submit application ❌";

            console.log("Volunteer Request Error:", errorMessage);

            Alert.alert("Error", errorMessage);
          }
        },
      },
    ]
  );
};
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      {ngo?.image ? (
        <Image source={{ uri: ngo.image }} style={styles.profileCircle} />
      ) : (
        <View style={styles.profileCircle}>
          <Text style={styles.profileText}>
            {ngo?.name ? ngo.name.substring(0, 2).toUpperCase() : "NG"}
          </Text>
        </View>
      )}

      <Text style={styles.name}>{ngo?.name || "NGO Name"}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Active Cases</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Volunteers</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About Organization</Text>
        <Text style={styles.sectionText}>
          {ngo?.about || "Dedicated to animal rescue services."}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.sectionText}>
          {ngo?.mission || "To rescue injured animals."}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Contact & Location</Text>

        {/* Directions Button */}
        <TouchableOpacity style={styles.directionBtn} onPress={openMap}>
          <Ionicons name="map-outline" size={18} color="#fff" />
          <Text style={styles.directionText}> Directions</Text>
        </TouchableOpacity>

        <View style={styles.contactRow}>
          <Ionicons name="mail-outline" size={20} color="#333" />
          <Text style={styles.contactText}>
            {ngo?.email || "ngo@email.com"}
          </Text>
          <MaterialIcons name="arrow-forward-ios" size={16} color="#999" />
        </View>

        <View style={styles.contactRow}>
          <Ionicons name="call-outline" size={20} color="green" />
          <Text style={[styles.contactText, { color: "green" }]}>
            {ngo?.phone || "+91 0000000000"}
          </Text>
          <MaterialIcons name="arrow-forward-ios" size={16} color="#999" />
        </View>
      </View>

      <TouchableOpacity style={styles.volunteerBtn} onPress={handleApply}>
        <Text style={styles.volunteerText}>Apply as Volunteer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactBtn}>
        <Text style={styles.contactBtnText}>Contact</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },

  profileCircle: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#2E8B8B",
    alignSelf: "center",
    marginTop: 7,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },

  profileText: { color: "#fff", fontSize: 28, fontWeight: "bold" },

  name: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    color: "green",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },

  statCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    width: 100,
    elevation: 3,
  },

  statNumber: { fontSize: 20, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#777" },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 18,
    borderRadius: 18,
    elevation: 3,
  },

  backBtn: { marginTop: 20, marginLeft: 15 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "green",
  },

  sectionText: { color: "#555", lineHeight: 20 },

  directionBtn: {
    flexDirection: "row",
    backgroundColor: "green",
    padding: 12,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  directionText: { color: "#fff", fontWeight: "600" },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },

  contactText: { flex: 1, marginLeft: 10, fontSize: 14 },

  volunteerBtn: {
    backgroundColor: "green",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },

  volunteerText: { color: "#fff", fontWeight: "bold" },

  contactBtn: {
    borderWidth: 2,
    borderColor: "green",
    marginHorizontal: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },

  contactBtnText: { color: "green", fontWeight: "bold" },
});


