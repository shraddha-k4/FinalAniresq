import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  Modal,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Create_Report } from "../../../Apiendpoint.jsx";

export default function ReportForm() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [incidentDate, setIncidentDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [image, setImage] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");

  const [animalType, setAnimalType] = useState("");
  const [behavior, setBehavior] = useState("");
  const [injured, setInjured] = useState("");
  const [humanHarm, setHumanHarm] = useState("");

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  /* IMAGE */
  const pickFromGallery = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  const openCamera = async () => {
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  /* MAP */
  const openMap = async () => {
    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    setMapVisible(true);
  };

  const confirmLocation = async () => {
    const geo = await Location.reverseGeocodeAsync(location);
    if (geo.length > 0) {
      setAddress(`${geo[0].city || ""}, ${geo[0].region || ""}`);
    }
    setMapVisible(false);
  };

  /* OPTION */
  const Option = ({ label, selected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.option,
        selected && { backgroundColor: "#2E7D32" },
      ]}
      onPress={onPress}
    >
      <Text style={{ color: selected ? "#fff" : "#333" }}>{label}</Text>
    </TouchableOpacity>
  );

  /* ✅ SUBMIT */
  const handleSubmit = async () => {
    if (!incidentDate || !location || !animalType) {
      Alert.alert("Error", "Required fields missing");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Session Expired", "Please login again");
      router.replace("/login");
      return;
    }

    const formData = new FormData();
    formData.append("incidentDate", incidentDate.toISOString());
    formData.append("address", address);

    // 🔑 backend expects location object
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);

    formData.append("animalType", animalType);

    if (behavior) formData.append("behavior", behavior);
    if (injured) formData.append("injured", injured);
    if (humanHarm) formData.append("humanHarm", humanHarm);

    if (image) {
      formData.append("image", {
  uri: image,
  name: "photo.jpg",
  type: "image/jpeg",
});

    }

    // try {
    //   const response = await fetch(Create_Report, {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       },
    //      body: formData,
    //   });

    //   const data = await response.json();
    //   // console.log("API RESPONSE:", data);

    //   if (!response.ok) {
    //     throw new Error(data.message);
    //   }

    //   router.push("/citizen/report/success");
    // } catch (err) {
    //   console.log("SUBMIT ERROR:", err.message);
    //   Alert.alert("Error", err.message);
    // }

    try {
  const response = await fetch(Create_Report, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const text = await response.text();
  console.log("RAW RESPONSE:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Server JSON error");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed");
  }

  router.push("/citizen/report/success");

} catch (err) {
  console.log("SUBMIT ERROR:", err.message);
  Alert.alert("Error", err.message);
}

  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={26} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Report Animal Abuse</Text>
      </View>

      {/* LOCATION */}
      <TouchableOpacity style={styles.inputBox} onPress={openMap}>
        <MaterialIcons name="location-on" size={22} color="#2E7D32" />
        <Text style={styles.input}>{address || "Pick Location"}</Text>
      </TouchableOpacity>

      {/* DATE */}
      <TouchableOpacity style={styles.inputBox} onPress={() => setShowDatePicker(true)}>
        <Ionicons name="calendar" size={22} color="#2E7D32" />
        <Text style={styles.input}>
          {incidentDate ? incidentDate.toISOString().split("T")[0] : "Date of Incident"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={incidentDate || new Date()}
          mode="date"
          maximumDate={new Date()}
          onChange={(e, d) => {
            setShowDatePicker(false);
            if (d) setIncidentDate(d);
          }}
        />
      )}

      {/* QUESTIONS */}
      <Text style={styles.question}>What type of animal is it?</Text>
      <View style={styles.optionsRow}>
        <Option label="Pet" selected={animalType === "pet"} onPress={() => setAnimalType("pet")} />
        <Option label="Wild" selected={animalType === "wild"} onPress={() => setAnimalType("wild")} />
        <Option label="Stray" selected={animalType === "stray"} onPress={() => setAnimalType("stray")} />
      </View>

      <Text style={styles.question}>Is the animal aggressive or behaving abnormally?</Text>
      <View style={styles.optionsRow}>
        <Option label="Aggressive" selected={behavior === "aggressive"} onPress={() => setBehavior("aggressive")} />
        <Option label="Normal" selected={behavior === "normal"} onPress={() => setBehavior("normal")} />
        <Option label="Unknown" selected={behavior === "unknown"} onPress={() => setBehavior("unknown")} />
      </View>

      <Text style={styles.question}>Is the Animal Injured?</Text>
      <View style={styles.optionsRow}>
        <Option label="Yes" selected={injured === "yes"} onPress={() => setInjured("yes")} />
        <Option label="No" selected={injured === "no"} onPress={() => setInjured("no")} />
        <Option label="Unknown" selected={injured === "unknown"} onPress={() => setInjured("unknown")} />
      </View>

      <Text style={styles.question}>Was any person harmed?</Text>
      <View style={styles.optionsRow}>
        <Option label="Yes,injured" selected={humanHarm === "injured"} onPress={() => setHumanHarm("injured")} />
        <Option label="No,injured" selected={humanHarm === "no"} onPress={() => setHumanHarm("no")} />
        <Option label="Death occured" selected={humanHarm === "death"} onPress={() => setHumanHarm("death")} />
      </View>

      {/* IMAGE */}
      <View style={styles.imageActions}>
        <TouchableOpacity style={styles.imageBtn} onPress={openCamera}>
        <Ionicons name="camera" size={22} />
          <Text>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageBtn} onPress={pickFromGallery}>
        <Ionicons name="image" size={22} />
          <Text>Gallery</Text>
        </TouchableOpacity>
      </View>

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      {/* SUBMIT */}
      <Animated.View>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Report</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* MAP */}
      <Modal visible={mapVisible}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location?.latitude || 18.52,
            longitude: location?.longitude || 73.85,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={(e) => setLocation(e.nativeEvent.coordinate)}
        >
          {location && <Marker coordinate={location} />}
        </MapView>

        <TouchableOpacity style={styles.confirmBtn} onPress={confirmLocation}>
          <Text style={{ color: "#fff" }}>Confirm Location</Text>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f876",
    padding: 16,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 10,
    color: "#1B1B1B",
    marginTop:9,
  },

  /* INPUT BOX */
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 2,
  },
  input: {
    marginLeft: 12,
    fontSize: 15,
    color: "#333",
    flex: 1,
  },

  /* QUESTIONS */
  question: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2E2E2E",
    marginTop: 18,
    marginBottom: 8,
  },

  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },

  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2E7D32",
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },

  /* IMAGE */
  imageActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  imageBtn: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    elevation: 2,
  },
  preview: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginTop: 14,
  },

  /* SUBMIT */
  submitBtn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 24,
    elevation: 3,
    marginBottom:36,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  /* MAP */
  confirmBtn: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 3,
  },
});



