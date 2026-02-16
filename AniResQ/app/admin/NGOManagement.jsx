import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Admin_Get_NGO_Users,
  Admin_Blacklist_User,
  Admin_Delete_User,
} from "../../Apiendpoint.jsx"; // path adjust करा

export default function NGOManagement() {
  const [ngos, setNgos] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchNGOs();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // FETCH NGO USERS
  const fetchNGOs = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(Admin_Get_NGO_Users, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        const formatted = data.users.map((u) => ({
          id: u._id,
          name: u.name,
          location: u.address?.country || "Unknown",
          totalRescues: 0,
          lastRescueDays: 0,
          status: u.isBlacklisted ? "Blacklisted" : "Active",
        }));

        setNgos(formatted);
      }
    } catch (error) {
      console.log("Fetch NGO error:", error);
    }
  };

  // BLACKLIST NGO
  const toggleBlacklist = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(Admin_Blacklist_User(id), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchNGOs();
    } catch (error) {
      console.log("Blacklist error:", error);
    }
  };

  // DELETE NGO (optional — जर button add केला तर use)
  const deleteUser = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(Admin_Delete_User(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchNGOs();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.heading}>NGO Management</Text>

        {ngos.map((ngo) => (
          <Animated.View
            key={ngo.id}
            style={[styles.glassCard, { opacity: fadeAnim }]}
          >
            <TouchableOpacity
              onPress={() =>
                setExpandedId(expandedId === ngo.id ? null : ngo.id)
              }
            >
              <Text style={styles.name}>{ngo.name}</Text>

              <Text style={styles.location}>
                📍 {ngo.location}
              </Text>

              <Text
                style={[
                  styles.status,
                  ngo.status === "Blacklisted" && {
                    color: "#ff4d4d",
                  },
                ]}
              >
                {ngo.status}
              </Text>
            </TouchableOpacity>

            {expandedId === ngo.id && (
              <View style={styles.detailsBox}>
                <Text style={styles.detailText}>
                  Total Rescues: {ngo.totalRescues}
                </Text>
                <Text style={styles.detailText}>
                  Last Rescue: {ngo.lastRescueDays} days ago
                </Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.blacklistBtn}
                onPress={() => toggleBlacklist(ngo.id)}
              >
                <Text style={styles.btnText}>
                  {ngo.status === "Blacklisted"
                    ? "Reactivate"
                    : "Blacklist"}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },

  glassCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 20,
    borderRadius: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },

  location: {
    color: "#ccc",
    marginVertical: 4,
  },

  status: {
    fontWeight: "bold",
    color: "#4CAF50",
  },

  detailsBox: {
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 15,
  },

  detailText: {
    color: "#ddd",
    marginBottom: 4,
  },

  buttonContainer: {
    marginTop: 15,
  },

  blacklistBtn: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 12,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
