import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import * as Location from "expo-location";
import {
  Get_Report_By_Radius,
  NGO_Singleaccept_report,
  Auth_profile
} from "../../../Apiendpoint.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function ReportsList() {

  const mapRef = useRef(null);
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedRadius, setSelectedRadius] = useState(5000);
  const [reports, setReports] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

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
    } catch (err) {
      console.log("Home profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getLiveLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Enable location permission");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    setCurrentLocation({ latitude, longitude });

    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });

    fetchReports(latitude, longitude, selectedRadius);
  };

  const fetchReports = async (lat, lng, radiusValue) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(
        `${Get_Report_By_Radius}?latitude=${lat}&longitude=${lng}&radius=${radiusValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports(response.data.reports);
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", "Failed to fetch reports");
    }
  };

  const handleRadiusChange = (radiusKm) => {
    const radiusMeters = radiusKm * 1000;
    setSelectedRadius(radiusMeters);

    if (currentLocation) {
      const delta = radiusKm / 100;

      mapRef.current?.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: delta,
        longitudeDelta: delta,
      });

      fetchReports(
        currentLocation.latitude,
        currentLocation.longitude,
        radiusMeters
      );
    }
  };

  const handleAccept = async (reportId) => {
    try {
      setLoadingId(reportId);

      const token = await AsyncStorage.getItem("token");

      await axios.put(
        NGO_Singleaccept_report(reportId),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Report Accepted Successfully");

      setReports((prev) =>
        prev.filter((report) => report._id !== reportId)
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", "Failed to accept report");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    getLiveLocation();
  }, []);

  if (!currentLocation) return null;

  return (
    <View style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/aniresq.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>AniResQ</Text>
        </View>

        <TouchableOpacity>
          <Image
            source={
              user?.image
                ? { uri: user.image }
                : require("../../../assets/image/profile.png")
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* ===== SCROLLABLE CONTENT ===== */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.subText}>
          {reports.length} available reports
        </Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity style={styles.activeTab}>
            <Ionicons name="location-outline" size={18} color="#fff" />
            <Text style={styles.activeText}> Available Reports</Text>
          </TouchableOpacity>

         
        <TouchableOpacity 
          style={styles.inactiveTab}
          onPress={() => router.push("/ngo/VolunteerRequest")}
        >
          <MaterialIcons name="assignment" size={18} color="#2e7d32" />
          <Text style={styles.inactiveText}> Volunteer Request</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation
          >
            <Marker coordinate={currentLocation} />

            {reports.map((report) => (
              <Marker
                key={report._id}
                coordinate={{
                  latitude: report.location.latitude,
                  longitude: report.location.longitude,
                }}
                title={report.animalType}
                description={report.address}
              />
            ))}

            <Circle
              center={currentLocation}
              radius={selectedRadius}
              strokeColor="#2e7d32"
              fillColor="rgba(46,125,50,0.2)"
            />
          </MapView>
        </View>

        <View style={styles.radiusContainer}>
          <Text style={styles.radiusTitle}>Search Radius:</Text>
          <View style={styles.radiusBtns}>
            {[2, 5, 10, 25].map((km) => {
              const meters = km * 1000;
              return (
                <TouchableOpacity
                  key={km}
                  style={
                    selectedRadius === meters
                      ? styles.radiusActive
                      : styles.radiusBtn
                  }
                  onPress={() => handleRadiusChange(km)}
                >
                  <Text
                    style={
                      selectedRadius === meters
                        ? styles.radiusActiveText
                        : styles.radiusText
                    }
                  >
                    {km} km
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {reports.length === 0 ? (
          <View style={styles.bottomSection}>
            <Ionicons name="map-outline" size={40} color="#a5d6a7" />
            <Text style={styles.noReportsText}>
              Available Reports (0)
            </Text>
          </View>
        ) : (
          <FlatList
            data={reports}
            keyExtractor={(item) => item._id}
            scrollEnabled={false} // disable inner scroll so ScrollView handles it
            style={{ marginTop: 20 }}
            renderItem={({ item }) => (
              <View style={styles.reportCard}>
                <Text style={styles.reportTitle}>
                  {item.animalType.toUpperCase()}
                </Text>
                
                <Image
                  source={{ uri: item.image }}
                  style={styles.animalImage}
                />
                <Text>{item.address}</Text>
                <Text>Behavior: {item.behavior}</Text>
                <Text>Injured: {item.injured}</Text>

                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => handleAccept(item._id)}
                  disabled={loadingId === item._id}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    {loadingId === item._id ? "Accepting..." : "Accept"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f8f4",
  },
  header: {
    marginTop:4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingBottom:4,
    elevation: 4,
    backgroundColor: "#f1f8f4",
    zIndex: 100, // ensures header is above ScrollView
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1b5e20",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  subText: {
    marginTop: 10,
    color: "#4caf50",
    fontSize: 14,
    paddingHorizontal: 15,
  },
  toggleContainer: {
    flexDirection: "row",
    marginTop: 15,
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    padding: 5,
    marginHorizontal: 15,
  },
  activeTab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2e7d32",
    padding: 10,
    borderRadius: 10,
  },
  inactiveTab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
  inactiveText: {
    color: "#2e7d32",
    fontWeight: "600",
  },
  mapContainer: {
    marginTop: 15,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 15,
  },
  map: {
    width: "100%",
    height: 250,
  },
  radiusContainer: {
    marginTop: 15,
    marginHorizontal: 15,
  },
  radiusTitle: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#1b5e20",
  },
  radiusBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radiusBtn: {
    borderWidth: 1,
    borderColor: "#a5d6a7",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  radiusActive: {
    backgroundColor: "#66bb6a",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  radiusText: {
    color: "#2e7d32",
    fontWeight: "600",
  },
  radiusActiveText: {
    color: "#fff",
    fontWeight: "600",
  },
  bottomSection: {
    marginTop: 40,
    alignItems: "center",
  },
  noReportsText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#4caf50",
  },
  reportCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    marginHorizontal: 15,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 5,
  },
  animalImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: "cover",
  },
  acceptBtn: {
    marginTop: 10,
    backgroundColor: "#2e7d32",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
  },
});