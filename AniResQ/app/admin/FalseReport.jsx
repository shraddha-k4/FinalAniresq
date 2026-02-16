import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

import {
  Admin_Update_Report_Status,
  Get_all_report,
  Admin_Delete_Report,
} from "../../Apiendpoint.jsx";

const AdminReportsUI = () => {
  const [reports, setReports] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animated value for cards

  // Fetch Reports
  const fetchReports = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(Get_all_report, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setReports(data?.reports || []);

      // Animate fade in when data loads
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.log(err);
      Alert.alert("Error fetching reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Update Status
  const updateStatus = async (id, status) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(Admin_Update_Report_Status(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adminStatus: status,
        }),
      });

      const data = await res.json();
      Alert.alert(data.message || "Status Updated");

      fetchReports();
    } catch (err) {
      console.log(err);
      Alert.alert("Update failed");
    }
  };

  // Delete Report
  const deleteReport = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(Admin_Delete_Report(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      Alert.alert(data.message || "Report Deleted");

      fetchReports();
    } catch (err) {
      console.log(err);
      Alert.alert("Delete failed");
    }
  };

  const renderItem = ({ item }) => (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <LinearGradient colors={["#141E30", "#243B55"]} style={styles.innerCard}>
        <Text style={styles.title}>
          {item?.user?.name || "Unknown User"}
        </Text>

        <Text style={styles.email}>
          {item?.user?.email || "No Email"}
        </Text>

        {item?.image && (
          <Image source={{ uri: item.image }} style={styles.image} />
        )}

        <Text style={styles.reason}>
          Date:{" "}
          {item?.incidentDate
            ? new Date(item.incidentDate).toLocaleDateString()
            : "N/A"}
        </Text>

        <Text style={styles.reason}>
          Address: {item?.address || "N/A"}
        </Text>

        <Text style={styles.reason}>
          Animal Type: {item?.animalType || "N/A"}
        </Text>

        <Text style={styles.reason}>
          Behavior: {item?.behavior || "N/A"}
        </Text>

        <Text style={styles.reason}>
          Injured: {item?.injured || "N/A"}
        </Text>

        <Text style={styles.reason}>
          Human Harm: {item?.humanHarm || "N/A"}
        </Text>

        <Text style={styles.reason}>
          Admin Status: {item?.adminStatus || "Pending"}
        </Text>

        <View style={styles.btnContainer}>
          {item.adminStatus === "Pending" && (
            <>
              <TouchableOpacity
                style={[styles.btn, styles.trueBtn]}
                onPress={() => updateStatus(item._id, "True")}
              >
                <Text style={styles.btnText}>True</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.fakeBtn]}
                onPress={() => updateStatus(item._id, "Fake")}
              >
                <Text style={styles.btnText}>Fake</Text>
              </TouchableOpacity>
            </>
          )}

          {item.adminStatus === "True" && (
            <TouchableOpacity style={[styles.btn, styles.trueBtn]}>
              <Text style={styles.btnText}>True</Text>
            </TouchableOpacity>
          )}

          {item.adminStatus === "Fake" && (
            <>
              <TouchableOpacity style={[styles.btn, styles.fakeBtn]}>
                <Text style={styles.btnText}>Fake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.deleteBtn]}
                onPress={() =>
                  Alert.alert("Delete Report", "Are you sure?", [
                    { text: "Cancel" },
                    {
                      text: "Delete",
                      onPress: () => deleteReport(item._id),
                    },
                  ])
                }
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={["#141E30", "#243B55"]}
      style={{ flex: 1 }}
    >
      <Text style={styles.header}>Reports</Text>

      <FlatList
        data={reports}
        keyExtractor={(item, index) =>
          item?._id || index.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15 }}
      />
    </LinearGradient>
  );
};

export default AdminReportsUI;

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
    color: "#fff",
  },

  card: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
     borderWidth: 2,       // Add this
  borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
   
  },

  innerCard: {
    padding: 16,
    borderRadius: 14,
    elevation: 4,
  
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  email: {
    color: "#ddd",
    marginBottom: 5,
  },

  reason: {
    marginTop: 5,
    fontSize: 15,
    color: "#eee",
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginVertical: 10,
  },

  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  btn: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 8,
  },

  trueBtn: {
    backgroundColor: "green",
  },

  fakeBtn: {
    backgroundColor: "red",
  },

  deleteBtn: {
    backgroundColor: "black",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
