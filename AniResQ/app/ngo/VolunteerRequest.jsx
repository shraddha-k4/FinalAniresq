// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   updateRequestStatus,
//   getNgoRequests,
//   GetAllUserinfo
// } from "../../Apiendpoint.jsx";
// import defaultUser from "../../assets/image/profile.png";

// export default function VolunteerRequest() {
//   const [requests, setRequests] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");

//       // Fetch NGO Requests
//       const requestRes = await axios.get(getNgoRequests, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Fetch All Users
//       const usersRes = await axios.get(GetAllUserinfo, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setRequests(requestRes.data.requests);
//       setAllUsers(usersRes.data.users);

//     } catch (error) {
//       console.log(
//         "Error fetching data:",
//         error.response?.data || error.message
//       );
//       setRequests([]);
//       setAllUsers([]);
//     }
//   };

//   const handleUpdateStatus = async (id, status) => {
//     try {
//       const token = await AsyncStorage.getItem("token");

//       await axios.put(
//         updateRequestStatus(id),
//         { status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       Alert.alert("Success", `Request ${status} successfully`);
//       fetchData();

//     } catch (error) {
//       console.log(
//         "Error updating status:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Volunteer Requests</Text>
//       </View>

//       {requests.map((item) => {
//         const matchedUser = allUsers.find(
//           (user) => user._id === item.citizen?._id
//         );

//         // ✅ Image Logic
//         const userImage = matchedUser?.image
//           ? { uri: matchedUser.image } // backend image
//           : defaultUser;               // local default image

//         // ✅ Address Logic
//         const userAddress =
//           matchedUser?.address?.country
//             ? matchedUser.address.country
//             : matchedUser?.address?.latitude && matchedUser?.address?.longitude
//             ? `Lat: ${matchedUser.address.latitude}, Lng: ${matchedUser.address.longitude}`
//             : "Address not available";

//         return (
//           <View style={styles.card} key={item._id}>
//             <View style={styles.userRow}>
//               <Image source={userImage} style={styles.avatar} />

//               <View style={{ marginLeft: 15 }}>
//                 <Text style={styles.name}>
//                   {matchedUser?.name || item.citizen?.name}
//                 </Text>
//                 <Text style={styles.address}>{userAddress}</Text>
//               </View>
//             </View>

//             <View style={styles.buttonRow}>
//               {item.status === "accepted" ? (
//                 <View style={[styles.confirmBtn, { backgroundColor: "#0f9d58" }]}>
//                   <Ionicons name="checkmark-circle" size={18} color="#fff" />
//                   <Text style={styles.btnText}>Accepted</Text>
//                 </View>
//               ) : item.status === "rejected" ? (
//                 <View style={[styles.deleteBtn, { backgroundColor: "#e53935" }]}>
//                   <Ionicons name="trash" size={18} color="#fff" />
//                   <Text style={styles.btnText}>Rejected</Text>
//                 </View>
//               ) : (
//                 <>
//                   <TouchableOpacity
//                     style={styles.confirmBtn}
//                     onPress={() => handleUpdateStatus(item._id, "accepted")}
//                   >
//                     <Ionicons name="checkmark-circle" size={18} color="#fff" />
//                     <Text style={styles.btnText}>Confirm</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={styles.deleteBtn}
//                     onPress={() => handleUpdateStatus(item._id, "rejected")}
//                   >
//                     <Ionicons name="trash" size={18} color="#fff" />
//                     <Text style={styles.btnText}>Delete</Text>
//                   </TouchableOpacity>
//                 </>
//               )}
//             </View>
//           </View>
//         );
//       })}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f4f9f6" },
//   header: {
//     backgroundColor: "#0f9d58",
//     paddingTop: 60,
//     paddingBottom: 30,
//     alignItems: "center",
//     borderBottomLeftRadius: 35,
//     borderBottomRightRadius: 35,
//     elevation: 10,
//   },
//   headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff", letterSpacing: 1 },
//   card: { backgroundColor: "#fff", margin: 20, padding: 20, borderRadius: 25, elevation: 8 },
//   userRow: { flexDirection: "row", alignItems: "center" },
//   avatar: { width: 80, height: 80, borderRadius: 40 },
//   name: { fontSize: 18, fontWeight: "bold", color: "#333" },
//   address: { marginTop: 5, fontSize: 14, color: "#666", width: 200 },
//   buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 25 },
//   confirmBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#0f9d58", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, elevation: 4 },
//   deleteBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#e53935", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, elevation: 4 },
//   btnText: { color: "#fff", fontWeight: "600", marginLeft: 8 },
// });


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  updateRequestStatus,
  getNgoRequests,
  GetAllUserinfo
} from "../../Apiendpoint.jsx";
import defaultUser from "../../assets/image/profile.png";
import { useRouter } from "expo-router";

export default function VolunteerRequest() { // navigation add

  const [requests, setRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      // Fetch NGO Requests
      const requestRes = await axios.get(getNgoRequests, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch All Users
      const usersRes = await axios.get(GetAllUserinfo, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests(requestRes.data.requests);
      setAllUsers(usersRes.data.users);

    } catch (error) {
      console.log("Error fetching data:", error.response?.data || error.message);
      setRequests([]);
      setAllUsers([]);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await axios.put(
        updateRequestStatus(id),
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", `Request ${status} successfully`);
      fetchData();

    } catch (error) {
      console.log("Error updating status:", error.response?.data || error.message);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header with Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/ngo/tab/home")}// go back
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Volunteer Requests</Text>
      </View>

      {requests.map((item) => {
        const matchedUser = allUsers.find(
          (user) => user._id === item.citizen?._id
        );

        // ✅ Image Logic
        const userImage = matchedUser?.image
          ? { uri: matchedUser.image } // backend image
          : defaultUser;               // local default image

        // ✅ Show EMAIL instead of address
        const userEmail = matchedUser?.email || item.citizen?.email || "No Email";

        return (
          <View style={styles.card} key={item._id}>
            <View style={styles.userRow}>
              <Image source={userImage} style={styles.avatar} />

              <View style={{ marginLeft: 15 }}>
                <Text style={styles.name}>
                  {matchedUser?.name || item.citizen?.name}
                </Text>
                <Text style={styles.address}>{userEmail}</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              {item.status === "accepted" ? (
                <View style={[styles.confirmBtn, { backgroundColor: "#0f9d58" }]}>
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <Text style={styles.btnText}>Accepted</Text>
                </View>
              ) : item.status === "rejected" ? (
                <View style={[styles.deleteBtn, { backgroundColor: "#e53935" }]}>
                  <Ionicons name="trash" size={18} color="#fff" />
                  <Text style={styles.btnText}>Rejected</Text>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={() => handleUpdateStatus(item._id, "accepted")}
                  >
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                    <Text style={styles.btnText}>Confirm</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleUpdateStatus(item._id, "rejected")}
                  >
                    <Ionicons name="trash" size={18} color="#fff" />
                    <Text style={styles.btnText}>Delete</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f9f6" },

  header: {
    backgroundColor: "#0f9d58",
    paddingTop: 60,
    paddingBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
    paddingHorizontal: 15,
  },

  backButton: {
    marginRight: 15,
  },

  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff", letterSpacing: 1 },

  card: { backgroundColor: "#fff", margin: 20, padding: 20, borderRadius: 25, elevation: 8 },

  userRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  address: { marginTop: 5, fontSize: 14, color: "#666", width: 200 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 25 },
  confirmBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#0f9d58", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, elevation: 4 },
  deleteBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#e53935", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, elevation: 4 },
  btnText: { color: "#fff", fontWeight: "600", marginLeft: 8 },
});