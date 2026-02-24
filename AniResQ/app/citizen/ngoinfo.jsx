import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Auth_Get_NGO } from "../../Apiendpoint.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NGOInfo() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [ngoData, setNgoData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👉 Initials function
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // 👉 Fetch NGOs
  const fetchNGOs = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(Auth_Get_NGO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData = res.data.ngos.map((item) => ({
        id: item._id,
        name: item.name,
        about: item.aboutus || "No description",
        verified: !item.isBlacklisted,
        activeCases: 0,
        completedCases: 0,
        volunteers: 0,
        image: item.image || "",
        address: item.address || "India",
        phone: item.mobileno,
        email: item.email,
      }));

      setNgoData(formattedData);
    } catch (err) {
      console.log(
        "NGO Fetch Error:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNGOs();
  }, []);

  const filteredData = ngoData.filter((item) => {
    if (filter === "verified") return item.verified;
    if (filter === "unverified") return !item.verified;
    if (filter === "active") return item.activeCases > 0;
    return true;
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={styles.initialAvatar}>
          <Text style={styles.initialText}>
            {getInitials(item.name)}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.statusBadge,
          { backgroundColor: item.verified ? "#2E7D32" : "#D32F2F" },
        ]}
      >
        <Text style={styles.badgeText}>
          {item.verified ? "VERIFIED" : "UNVERIFIED"}
        </Text>
      </View>

      <Text style={styles.name}>{item.name}</Text>

      <View style={styles.statsRow}>
        <Text style={styles.stat}>Active: {item.activeCases}</Text>
        <Text style={styles.stat}>Completed: {item.completedCases}</Text>
        <Text style={styles.stat}>Volunteers: {item.volunteers}</Text>
      </View>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/citizen/ngodetails",
            params: { id: item.id }, 
          })
        }
      >
        <Text style={styles.moreLink}>
          Click to view more info about NGO
        </Text>
      </TouchableOpacity>
    </View>
  );

  const FilterButton = ({ label, value }) => (
    <TouchableOpacity
      style={[
        styles.filterBtn,
        filter === value && styles.filterBtnActive,
      ]}
      onPress={() => setFilter(value)}
    >
      <Text
        style={[
          styles.filterText,
          filter === value && styles.filterTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>NGO Directory</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 50 }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <FilterButton label="All NGOs" value="all" />
        <FilterButton label="Verified Only" value="verified" />
        <FilterButton label="Active" value="active" />
        <FilterButton label="Unverified" value="unverified" />
      </ScrollView>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f9f6",
    paddingHorizontal: 15,
    paddingTop: 0,
    marginTop: -20,
    marginBottom:60,
  },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "green",
    marginBottom: 10,
  },

  filterBtn: {
    backgroundColor: "green",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "green",
  },

  filterBtnActive: {
    backgroundColor: "#fff",
  },

  filterText: {
    color: "#fff",
    fontWeight: "500",
  },

  filterTextActive: {
    color: "green",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    elevation: 4,
       
  },

  image: {
    width: "100%",
    height: 160,
    borderRadius: 15,
  },

  initialAvatar: {
    width: "100%",
    height: 160,
    borderRadius:20,
    backgroundColor: "#c47317",
    justifyContent: "center",
    alignItems: "center",
  },

  initialText: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },

  statusBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },

  stat: {
    fontSize: 12,
    color: "#555",
  },

  moreLink: {
    marginTop: 10,
    color: "green",
    fontWeight: "600",
    textAlign: "center",
  },
});
