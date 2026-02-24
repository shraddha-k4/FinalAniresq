// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Location from "expo-location";
// import { Auth_profile } from "../../Apiendpoint.jsx";

// /* ---------- DATE FORMAT ---------- */
// const formatDate = (dateString) => {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [addressText, setAddressText] = useState("");

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   /* ---------- FETCH PROFILE ---------- */
//   const fetchProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) return;

//       const res = await fetch(Auth_profile, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       setUser(data.user);

//       // Convert latitude/longitude to address
//       if (data.user?.address?.latitude && data.user?.address?.longitude) {
//         const addr = await Location.reverseGeocodeAsync({
//           latitude: data.user.address.latitude,
//           longitude: data.user.address.longitude,
//         });

//         if (addr.length > 0) {
//           const place = addr[0];
//           setAddressText(
//             `${place.city || ""}, ${place.region || ""}, ${
//               place.country || ""
//             }`
//           );
//         }
//       }
//     } catch (err) {
//       console.log("Profile error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- LOADING ---------- */
//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <Ionicons
//           name="arrow-back"
//           size={26}
//           color="black"
//           onPress={() => router.replace("/citizen/home")}
//         />
//         <Text style={styles.headerTitle}>Profile</Text>
//       </View>

//       {/* PROFILE CARD */}
//       <View style={styles.profileCard}>
//         <Image
//           source={
//             user?.image
//               ? { uri: user.image }
//               : require("../../assets/image/profile.png")
//           }
//           style={styles.profileImg}
//         />
//         <Text style={styles.name}>{user?.name}</Text>
//         <Text style={styles.role}>{user?.role}</Text>
//       </View>

//       {/* INFO CARD */}
//       <View style={styles.infoCard}>
//         <InfoRow icon="mail" text={user?.email} />
//         <InfoRow icon="call" text={String(user?.mobileno || "")} />
//         <InfoRow icon="location-on" text={addressText || "-"} />
//         <InfoRow
//           icon="calendar-today"
//           text={`Joined on ${formatDate(user?.createdAt)}`}
//         />
//       </View>

//       {/* ABOUT US */}
//       {user?.aboutus ? (
//         <>
//           <Text style={styles.sectionTitle}>About Us</Text>
//           <View style={styles.aboutCard}>
//             <Text style={styles.aboutText}>{user.aboutus}</Text>
//           </View>
//         </>
//       ) : null}

//       {/* EDIT PROFILE */}
//       <TouchableOpacity
//         style={styles.editBtn}
//         onPress={() =>
//           router.push({
//             pathname: "/citizen/EditProfile",
//             params: { user: JSON.stringify(user) },
//           })
//         }
//       >
//         <Text style={styles.editText}>Edit Profile</Text>
//       </TouchableOpacity>

//       {/* LOGOUT */}
//       <TouchableOpacity
//         style={styles.logoutBtn}
//         onPress={async () => {
//           await AsyncStorage.removeItem("token");
//           router.replace("/");
//         }}
//       >
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// /* ---------- INFO ROW ---------- */
// const InfoRow = ({ icon, text }) => (
//   <View style={styles.infoRow}>
//     <MaterialIcons name={icon} size={22} color="#6B7280" />
//     <Text style={styles.infoText}>{text || "-"}</Text>
//   </View>
// );

// /* ---------- STYLES ---------- */
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//     padding: 14,
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   headerTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginLeft: 10,
//     color: "#1B1B1B",
//   },

//   profileCard: {
//     backgroundColor: "#2E7D32",
//     borderRadius: 28,
//     padding: 24,
//     alignItems: "center",
//     marginBottom: 16,
//   },

//   profileImg: {
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     marginBottom: 12,
//   },

//   name: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "900",
//   },

//   role: {
//     color: "#EDE9FE",
//     fontSize: 14,
//   },

//   infoCard: {
//     backgroundColor: "#F9FAFB",
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 12,
//   },

//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 8,
//   },

//   infoText: {
//     marginLeft: 12,
//     fontSize: 15,
//     color: "#374151",
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     marginVertical: 12,
//     color: "#111827",
//   },

//   aboutCard: {
//     backgroundColor: "#F9FAFB",
//     borderRadius: 16,
//     padding: 16,
//   },

//   aboutText: {
//     fontSize: 15,
//     color: "#374151",
//     lineHeight: 22,
//   },

//   editBtn: {
//     backgroundColor: "#2E7D32",
//     padding: 16,
//     borderRadius: 14,
//     alignItems: "center",
//     marginTop: 20,
//   },

//   editText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//   },

//   logoutBtn: {
//     backgroundColor: "#E5E7EB",
//     padding: 16,
//     borderRadius: 14,
//     alignItems: "center",
//     marginTop: 12,
//     marginBottom: 40,
//   },

//   logoutText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#111827",
//   },
// });



import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { Auth_profile } from "../../Apiendpoint.jsx"; // path check kar

export default function SettingsScreen() {
  const router = useRouter();

  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [report, setReport] = useState(true);
  const [emergency, setEmergency] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH PROFILE =================
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(Auth_profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Universal handling (any backend structure)
      const userData =
        response.data?.user ||
        response.data?.data ||
        response.data;

      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.log("Profile Fetch Error:", error.message);
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          router.replace("/"); 
        },
      },
    ]);
  };

  // ================= SETTING ITEM =================
  const SettingItem = ({ icon, title, subtitle, value, onToggle }) => (
    <View style={styles.settingItem}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {icon}
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.itemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {typeof value === "boolean" ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "#ccc", true: "#A5D6A7" }}
          thumbColor={value ? "#1B8F4C" : "#f4f3f4"}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#999" />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.mainHeading}>Settings</Text>

      {/* USER INFO */}
      <View style={styles.userCard}>
        {loading ? (
          <ActivityIndicator size="small" color="#1B8F4C" />
        ) : (
          <View>
            <Text style={styles.userName}>
              {user?.name || "User"}
            </Text>
            <Text style={styles.userEmail}>
              {user?.email || ""}
            </Text>
          </View>
        )}

        <TouchableOpacity
  onPress={() =>
    router.push({
      pathname: "/citizen/EditProfile",
      params: { user: JSON.stringify(user) },
    })
  }
>
  <Text style={styles.editText}>Edit Profile</Text>
</TouchableOpacity>
      </View>

      {/* NOTIFICATIONS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <SettingItem
          icon={<Ionicons name="notifications-outline" size={22} color="#1B8F4C" />}
          title="Push Notifications"
          subtitle="Receive alerts for rescue cases"
          value={push}
          onToggle={() => setPush(!push)}
        />

        <SettingItem
          icon={<Ionicons name="mail-outline" size={22} color="#1B8F4C" />}
          title="Email Notifications"
          subtitle="Receive important updates via email"
          value={email}
          onToggle={() => setEmail(!email)}
        />

        <SettingItem
          icon={<Ionicons name="document-text-outline" size={22} color="#1B8F4C" />}
          title="Report Updates"
          subtitle="Get notified about report status changes"
          value={report}
          onToggle={() => setReport(!report)}
        />

        <SettingItem
          icon={<Ionicons name="alert-circle-outline" size={22} color="#E53935" />}
          title="Emergency Alerts"
          subtitle="Critical notifications for urgent cases"
          value={emergency}
          onToggle={() => setEmergency(!emergency)}
        />
      </View>

      {/* PERSONAL */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal</Text>

        <SettingItem
          icon={<Ionicons name="shield-checkmark-outline" size={22} color="#1B8F4C" />}
          title="Privacy Policy"
        />

        <SettingItem
          icon={<MaterialIcons name="delete-outline" size={22} color="#E53935" />}
          title="Delete Account"
        />
      </View>

      {/* APP SETTINGS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>App Settings</Text>

        <SettingItem
          icon={<Ionicons name="book-outline" size={22} color="#1B8F4C" />}
          title="Learn to Use the App"
        />

        <SettingItem
          icon={<Ionicons name="color-palette-outline" size={22} color="#1B8F4C" />}
          title="Theme"
          subtitle="Light Mode"
          value={darkMode}
          onToggle={() => setDarkMode(!darkMode)}
        />

        <SettingItem
          icon={<Ionicons name="settings-outline" size={22} color="#1B8F4C" />}
          title="App Permissions"
        />
      </View>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4FFF7",
    padding: 16,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0F5D2F",
  },
  userCard: {
    backgroundColor: "#E8F5E9",
    padding: 18,
    borderRadius: 18,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F5D2F",
  },
  userEmail: {
    fontSize: 14,
    color: "#4CAF50",
    marginTop: 4,
  },
  editText: {
    color: "#1B8F4C",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 18,
    marginBottom: 18,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1B8F4C",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  itemSubtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },
  logoutBtn: {
    backgroundColor: "#1B8F4C",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
    elevation: 4,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});