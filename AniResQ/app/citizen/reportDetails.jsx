import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Get_Report_By_Id } from "../../Apiendpoint.jsx";

export default function ReportDetails() {
  const { id } = useLocalSearchParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(Get_Report_By_Id(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setReport(data.report);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!report)
    return <Text style={{ textAlign: "center" }}>No report found</Text>;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} />
        </TouchableOpacity>
        <Text style={styles.title}>Report Details</Text>
      </View>

      {/* Image */}
      {report.image && (
        <Image source={{ uri: report.image }} style={styles.image} />
      )}

      {/* Details */}
      <Text>Date: {new Date(report.incidentDate).toLocaleDateString()}</Text>
      <Text>Address: {report.address}</Text>
      <Text>Animal: {report.animalType}</Text>
      <Text>Behavior: {report.behavior}</Text>
      <Text>Injured: {report.injured}</Text>
      <Text>Human Harm: {report.humanHarm}</Text>

      <Text>
        Location: {report.location?.latitude},{" "}
        {report.location?.longitude}
      </Text>

      <Text>Status: {report.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
});
