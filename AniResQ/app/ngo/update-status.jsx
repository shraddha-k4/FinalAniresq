import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NGO_Accept_all_Report, NGO_updateAcceptedReport } from "../../Apiendpoint.jsx";

export default function UpdateStatus() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [report, setReport] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("In Treatment");
  const [description, setDescription] = useState("");
  const [vetNotes, setVetNotes] = useState("");
  const [media, setMedia] = useState([]);

  // ================= FETCH REPORT ==================
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "Please login again.");
          router.push("/login");
          return;
        }

        const res = await axios.get(NGO_Accept_all_Report, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const reports = res.data.reports || [];
        const data = reports.find((r) => r._id === id);

        if (!data) {
          Alert.alert("Error", "Report not found");
          return;
        }

        setReport(data);

        if (data.updates?.length > 0) {
          const lastUpdate = data.updates[data.updates.length - 1];
          setSelectedStatus(lastUpdate.status || "In Treatment");
          setDescription(lastUpdate.description || "");
          setVetNotes(lastUpdate.veterinaryNotes || "");
          setMedia(lastUpdate.media || []);
        }
      } catch (err) {
        console.log("Fetch error:", err.response?.data || err);
        Alert.alert("Error", "Failed to fetch report.");
      }
    };

    fetchReport();
  }, [id]);

  // ================= PICK MEDIA ==================
  const pickMedia = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required", "Allow media access.");
        return;
      }

   const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        // ✅ Only Images
        // mediaTypes: [ImagePicker.MediaType.Images],
      quality: 0.7,
      });

    if (!result.canceled) {
      const asset = result.assets[0];

      const selectedImage = {
        uri: asset.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      };

      setMedia((prev) => [...prev, selectedImage]);
    }
    
    } catch (err) {
      console.log("Picker error:", err);
    }
  };

  // ================= SAVE UPDATE ==================
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login again");
        return;
      }

      const validStatus = ["In Treatment", "Recovery", "Completed"];
      if (!validStatus.includes(selectedStatus)) {
        Alert.alert("Invalid Status");
        return;
      }

      const formData = new FormData();
      formData.append("status", selectedStatus);
      formData.append("description", description);
      formData.append("veterinaryNotes", vetNotes);

      media.forEach((file) => {
        if (typeof file === "string") {
          formData.append("existingMedia[]", file);
        } else {
          formData.append("media", {
            uri: file.uri,
            name: file.name,
            type: file.type,
          });
        }
      });

      // DEBUG LOG
      for (let pair of formData.entries()) {
        console.log("FD:", pair[0], pair[1]);
      }

      const response = await axios.put(
  NGO_updateAcceptedReport(id),
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    timeout: 30000,
  }
);
      Alert.alert(
        "Success",
        response.data?.message || "Report updated successfully"
      );

      router.push("/ngo/success-update");
    } catch (err) {
      console.log("AXIOS ERROR:", err);
      console.log("Response:", err.response?.data);

      Alert.alert(
        "Update Failed",
        err.response?.data?.message || err.message || "Something went wrong"
      );
    }
  };


  if (!report) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading report...</Text>
      </View>
    );
  }

  // ================= UI (UNCHANGED) ==================
  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6FB" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#1B5E20", "#2E7D32", "#43A047"]} style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.replace("/ngo/tab/cases")}>
              <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Update Case Treatment</Text>
          </View>
        </LinearGradient>

        <View style={styles.card}>
          <Image source={{ uri: report.image }} style={styles.cardImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>
              {report.animalType === "wild" ? "Wild Animal" : "Domestic Animal"} - {report.user?.name}
            </Text>
            <Text style={styles.cardSub}>{report.address}</Text>
          </View>
          <View style={styles.caseIdBox}>
            <Text style={{ color: "#2e9651", fontWeight: "600" }}>
              #{report._id.slice(0, 6)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Update Case Status</Text>
        <View style={styles.statusRow}>
          {["In Treatment", "Recovery", "Completed"].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setSelectedStatus(item)}
              style={[styles.statusBtn, selectedStatus === item && styles.activeStatus]}
            >
              <Text style={[styles.statusText, selectedStatus === item && { color: "#fff" }]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Treatment Description</Text>
        <TextInput
          placeholder="Describe the treatment provided..."
          multiline
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.sectionTitle}>Upload Photos & Videos</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={pickMedia}>
          <Ionicons name="image-outline" size={50} color="#6A7FDB" />
          <Text style={styles.uploadTitle}>Tap to Upload Media</Text>
          <Text style={styles.uploadSub}>Photos, videos up to 50MB each</Text>
        </TouchableOpacity>

        <View style={styles.imageRow}>
          {media.map((img, index) => {
            const uri = typeof img === "string" ? img : img.uri;
            return <Image key={index} source={{ uri }} style={styles.previewImg} />;
          })}
        </View>

        {report.updates?.length > 0 && (
          <View style={styles.previousBox}>
            <Text style={styles.previousTitle}>Previous Updates</Text>
            {report.updates.map((u, i) => (
              <Text key={i} style={styles.previousText}>{u.description}</Text>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Veterinary Notes</Text>
        <TextInput
          placeholder="Add veterinary notes..."
          multiline
          style={styles.textArea}
          value={vetNotes}
          onChangeText={setVetNotes}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save Update & Notify Reporter</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ===== SAME UI STYLES (UNCHANGED) =====
const styles = StyleSheet.create({
  header: { paddingTop: 55, paddingBottom: 25, paddingHorizontal: 20, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", marginLeft: 15 },
  card: { flexDirection: "row", backgroundColor: "#fff", margin: 20, padding: 15, borderRadius: 16, alignItems: "center", elevation: 4 },
  cardImage: { width: 70, height: 70, borderRadius: 15, marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardSub: { color: "#64748B", marginTop: 3 },
  caseIdBox: { backgroundColor: "#EEF2FF", padding: 8, borderRadius: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginHorizontal: 20, marginTop: 10 },
  statusRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 15 },
  statusBtn: { backgroundColor: "#E2E8F0", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  activeStatus: { backgroundColor: "#16A34A" },
  statusText: { color: "#475569", fontWeight: "500" },
  textArea: { backgroundColor: "#fff", margin: 20, padding: 15, borderRadius: 15, height: 100, textAlignVertical: "top" },
  uploadBox: { borderWidth: 2, borderColor: "#6A7FDB", margin: 20, borderRadius: 20, padding: 30, alignItems: "center", backgroundColor: "#EEF2FF" },
  uploadTitle: { color: "#6A7FDB", fontSize: 16, fontWeight: "600", marginTop: 10 },
  uploadSub: { color: "#64748B", marginTop: 5 },
  imageRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  previewImg: { width: 90, height: 90, borderRadius: 15 },
  previousBox: { backgroundColor: "#E6F9F0", margin: 20, padding: 15, borderRadius: 15 },
  previousTitle: { color: "#16A34A", fontWeight: "600", marginBottom: 5 },
  previousText: { color: "#334155" },
  saveBtn: { backgroundColor: "#16A34A", margin: 20, padding: 16, borderRadius: 20, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancel: { textAlign: "center", color: "#EF4444", marginBottom: 30, fontSize: 16 },
});


