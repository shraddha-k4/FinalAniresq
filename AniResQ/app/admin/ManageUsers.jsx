import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Admin_Get_Citizen_Users,
  Admin_Blacklist_User,
  Admin_Delete_User,
} from "../../Apiendpoint.jsx"; // path adjust करा

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchUsers();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(Admin_Get_Citizen_Users, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        const formattedUsers = data.users.map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          status: u.isBlacklisted ? "Blacklisted" : "Active",
          reports: 0,
          reason: "",
        }));

        setUsers(formattedUsers);
      }
    } catch (error) {
      console.log("Fetch users error:", error);
    }
  };

  // BLACKLIST USER
  const toggleBlacklist = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(Admin_Blacklist_User(id), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();
    } catch (error) {
      console.log("Blacklist error:", error);
    }
  };

  // DELETE USER
  const deleteUser = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(Admin_Delete_User(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LinearGradient colors={["#141E30", "#243B55"]} style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.heading}>Manage Users</Text>

        <TextInput
          placeholder="Search users..."
          placeholderTextColor="#ccc"
          style={styles.search}
          value={search}
          onChangeText={setSearch}
        />

        {filteredUsers.map((user) => (
          <Animated.View
            key={user.id}
            style={[styles.glassCard, { opacity: fadeAnim }]}
          >
            <TouchableOpacity
              onPress={() =>
                setExpandedId(expandedId === user.id ? null : user.id)
              }
            >
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>

              <Text
                style={[
                  styles.status,
                  user.status === "Blacklisted" && { color: "#ff4d4d" },
                ]}
              >
                {user.status}
              </Text>

              <Text style={styles.reportCount}>
                NGO Reports: {user.reports}
              </Text>
            </TouchableOpacity>

            {expandedId === user.id && (
              <View style={styles.detailsBox}>
                <Text style={styles.reasonTitle}>Reported Reason:</Text>
                <Text style={styles.reason}>{user.reason}</Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.blacklistBtn}
                onPress={() => toggleBlacklist(user.id)}
              >
                <Text style={styles.btnText}>
                  {user.status === "Active"
                    ? "Blacklist"
                    : "Unblacklist"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteUser(user.id)}
              >
                <Text style={styles.btnText}>Delete</Text>
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

  search: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 15,
    borderRadius: 20,
    color: "#fff",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },

  glassCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 20,
    borderRadius: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },

  email: {
    fontSize: 14,
    color: "#ccc",
    marginVertical: 4,
  },

  status: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },

  reportCount: {
    fontSize: 13,
    color: "#ffd700",
    marginTop: 4,
  },

  detailsBox: {
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 15,
  },

  reasonTitle: {
    fontWeight: "bold",
    color: "#fff",
  },

  reason: {
    color: "#ddd",
    marginTop: 5,
  },

  buttonContainer: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
  },

  blacklistBtn: {
    backgroundColor: "#ff9800",
    padding: 10,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
  },

  deleteBtn: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 12,
    flex: 1,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
