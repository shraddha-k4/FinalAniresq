import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Auth_update_profile } from "../../Apiendpoint.jsx";

export default function EditProfile() {
  const params = useLocalSearchParams();
  const user = JSON.parse(params.user);

  const [name, setName] = useState(user?.name || "");
  const [mobileno, setMobileno] = useState(
    user?.mobileno ? String(user.mobileno) : ""
  );
  const [aboutus, setAboutus] = useState(user?.aboutus || "");
  const [regiid,setRegiid]= useState(user?.regiid||"");
  const [mission,setMission]=useState(user?.mission||"");

  const [location, setLocation] = useState({
    latitude: user?.address?.latitude || null,
    longitude: user?.address?.longitude || null,
  });

  const [pickedImage, setPickedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- IMAGE PICK ---------------- */
  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission required");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setPickedImage(result.assets[0]); // ⭐ IMPORTANT
      }
    } catch (err) {
      console.log("ImagePicker error:", err);
    }
  };

  /* ---------------- LOCATION ---------------- */
  const getCurrentLocation = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Location permission denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      Alert.alert("Location captured successfully");
    } catch (err) {
      console.log(err);
      Alert.alert("Location error");
    }
  };

  /* ---------------- UPDATE PROFILE ---------------- */
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login required");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("mobileno", mobileno);
      formData.append("aboutus", aboutus);
      formData.append("regiid",regiid);
      formData.append("mission",mission);

      if (location.latitude && location.longitude) {
        formData.append("address[latitude]", location.latitude);
        formData.append("address[longitude]", location.longitude);
      }

      // ⭐ IMAGE UPLOAD SAME AS OLD CODE
      if (pickedImage) {
        formData.append("image", {
          uri:
            Platform.OS === "android"
              ? pickedImage.uri
              : pickedImage.uri.replace("file://", ""),
          name: "profile.jpg",
          type: "image/jpeg",
        });
      }

      const res = await fetch(Auth_update_profile, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "Update failed");
        return;
      }

      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (err) {
      console.log(err);
      Alert.alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={26}
          color="black"
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView 
       style={{ margin: 20 }}
       contentContainerStyle={[styles.container, { paddingBottom: 40 }]}>
        {/* IMAGE */}
        <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
          <Image
            source={
              pickedImage?.uri
                ? { uri: pickedImage.uri }
                : user?.image
                ? { uri: user.image }
                : require("../../assets/image/profile.png")
            }
            style={styles.profileImg}
          />
          <Text style={styles.changeText}>Change Photo</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
        />

        <TextInput
          style={styles.input}
          value={mobileno}
          onChangeText={setMobileno}
          placeholder="Mobile Number"
          keyboardType="number-pad"
        />
          <TextInput
          style={styles.input}
          value={regiid}
          onChangeText={setRegiid}
          placeholder="Registration ID"
        />

        <TextInput
          style={[styles.input, styles.aboutInput]}
          value={aboutus}
          onChangeText={setAboutus}
          placeholder="About Us"
          multiline
        />

        <TextInput
          style={[styles.input, styles.aboutInput]}
          value={mission}
          onChangeText={setMission}
          placeholder="Our Mission"
          multiline
        />

        <TouchableOpacity style={styles.locationBtn} onPress={getCurrentLocation}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Use Current Location
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
          <Text style={styles.saveText}>
            {loading ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 25,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  // container: {
  //   flex:1,
  //   backgroundColor: "rgba(15,43,143,0.09)",
  //   borderRadius: 28,
  //   padding: 20,
  //   margin:20,
    
  // },
  container: {
  backgroundColor: "rgba(15,43,143,0.09)",
  borderRadius: 28,
  padding: 20,
},

  imageWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImg: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changeText: {
    marginTop: 10,
    color: "#2E7D32",
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  aboutInput: {
    height: 100,
    textAlignVertical: "top",
  },
  locationBtn: {
    backgroundColor: "#444",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: "#2E7D32",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 70,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
