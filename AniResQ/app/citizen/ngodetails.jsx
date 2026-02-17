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
import { Auth_Get_NGO } from "../../Apiendpoint.jsx";

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
          onPress: () =>
            Alert.alert("Success", "Application Submitted Successfully!"),
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



// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Linking,
//   ActivityIndicator,
// } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import { Auth_Get_NGO } from "../../Apiendpoint.jsx";

// export default function NGODetails() {
//   const router = useRouter();
//   const { id } = useLocalSearchParams();

//   const [ngo, setNgo] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNgo = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token");

//         if (!token) {
//           Alert.alert("Token missing");
//           setLoading(false);
//           return;
//         }

//         const res = await axios.get(Auth_Get_NGO, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         console.log("ID:", id);
//         console.log("API NGOs:", res.data.ngos);

//         const ngoData = res.data.ngos.find(
//           n => String(n._id) === String(id)
//         );

//         if (ngoData) {
//           setNgo({
//             name: ngoData.name,
//             email: ngoData.email,
//             phone: ngoData.mobileno,
//             about: ngoData.aboutus,
//             mission: ngoData.mission,
//             image: ngoData.image,
//             latitude: ngoData.address?.latitude,
//             longitude: ngoData.address?.longitude,
//           });
//         } else {
//           Alert.alert("NGO not found");
//         }
//       } catch (error) {
//         console.log("Fetch NGO Error:", error.message);
//         Alert.alert("Error fetching NGO");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNgo();
//   }, []);

//   // 👉 Google Maps Open
//   const openMap = () => {
//     if (!ngo?.latitude || !ngo?.longitude) {
//       Alert.alert("Location not available");
//       return;
//     }

//     const url = `https://www.google.com/maps/search/?api=1&query=${ngo.latitude},${ngo.longitude}`;
//     Linking.openURL(url);
//   };

//   // 👉 Volunteer Apply
//   const handleApply = () => {
//     Alert.alert(
//       "Apply as Volunteer",
//       `Apply for ${ngo?.name || "this NGO"}?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Apply",
//           onPress: () =>
//             Alert.alert("Success", "Application Submitted!"),
//         },
//       ]
//     );
//   };

//   // ✅ Loading UI
//   if (loading) {
//     return (
//       <View style={styles.loading}>
//         <ActivityIndicator size="large" color="green" />
//         <Text>Loading NGO...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//         <Ionicons name="arrow-back" size={28} />
//       </TouchableOpacity>

//       {ngo?.image ? (
//         <Image source={{ uri: ngo.image }} style={styles.profileCircle} />
//       ) : (
//         <View style={styles.profileCircle}>
//           <Text style={styles.profileText}>
//             {ngo?.name?.substring(0, 2).toUpperCase() || "NG"}
//           </Text>
//         </View>
//       )}

//       <Text style={styles.name}>{ngo?.name}</Text>

//       <View style={styles.card}>
//         <Text style={styles.sectionTitle}>About</Text>
//         <Text>{ngo?.about}</Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.sectionTitle}>Mission</Text>
//         <Text>{ngo?.mission}</Text>
//       </View>

//       <View style={styles.card}>
//         <TouchableOpacity style={styles.directionBtn} onPress={openMap}>
//           <Ionicons name="map-outline" size={18} color="#fff" />
//           <Text style={{ color: "#fff", marginLeft: 5 }}>
//             Directions
//           </Text>
//         </TouchableOpacity>

//         <Text>Email: {ngo?.email}</Text>
//         <Text>Phone: {ngo?.phone}</Text>
//       </View>

//       <TouchableOpacity style={styles.volunteerBtn} onPress={handleApply}>
//         <Text style={{ color: "#fff" }}>Apply Volunteer</Text>
//       </TouchableOpacity>

//       <View style={{ height: 40 }} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F7F7F7" },

//   loading: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   profileCircle: {
//     width: 90,
//     height: 90,
//     borderRadius: 50,
//     backgroundColor: "#2E8B8B",
//     alignSelf: "center",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//   },

//   profileText: {
//     color: "#fff",
//     fontSize: 26,
//     fontWeight: "bold",
//   },

//   name: {
//     textAlign: "center",
//     fontSize: 22,
//     fontWeight: "bold",
//     marginVertical: 10,
//     color: "green",
//   },

//   card: {
//     backgroundColor: "#fff",
//     margin: 15,
//     padding: 18,
//     borderRadius: 15,
//     elevation: 3,
//   },

//   backBtn: {
//     marginTop: 20,
//     marginLeft: 15,
//   },

//   sectionTitle: {
//     fontWeight: "bold",
//     marginBottom: 5,
//     color: "green",
//   },

//   directionBtn: {
//     flexDirection: "row",
//     backgroundColor: "green",
//     padding: 10,
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   volunteerBtn: {
//     backgroundColor: "green",
//     marginHorizontal: 20,
//     padding: 15,
//     borderRadius: 30,
//     alignItems: "center",
//   },
// });

