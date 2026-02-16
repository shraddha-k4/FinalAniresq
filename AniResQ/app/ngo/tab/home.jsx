// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";

// export default function Home() {
//   const router = useRouter();

//   // temporary user state (replace with API later)
//   const [user] = useState(null);

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#2434b1" }}>
//       {/* <ScrollView contentContainerStyle={styles.container}> */}

//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.logoContainer}>
//             <Image
//               source={require("../../../assets/aniresq.png")}
//               style={styles.logoImage}
//             />
//             <Text style={styles.logoText}>AniResQ</Text>
//           </View>

//           <TouchableOpacity onPress={() => router.push("/ngo/tab/profile")}>
//             <Image
//               source={
//                 user?.image
//                   ? { uri: user.image }
//                   : require("../../../assets/image/profile.png")
//               }
//               style={styles.profileImage}
//             />
//           </TouchableOpacity>
//         </View>
//       <ScrollView contentContainerStyle={styles.container}>
//         {/* Welcome Card */}
//         <View style={styles.headerCard}>
//           <Text style={styles.title}>Saahas For Animals</Text>
//           <Text style={styles.welcome}>Welcome Back!</Text>
//           <Text style={styles.subtitle}>
//             Together we're making a difference in our community
//           </Text>
//         </View>

//         {/* Stats */}
//         <View style={styles.statCard}>
//           <Text style={styles.statNo}>0</Text>
//           <Text style={styles.statText}>Total Cases Undertaken</Text>
//         </View>

//         <View style={styles.statCard}>
//           <Text style={styles.statNo}>0</Text>
//           <Text style={styles.statText}>Successfully Completed</Text>
//         </View>

//         <View style={styles.statCard}>
//           <Text style={styles.statNo}>0</Text>
//           <Text style={styles.statText}>Currently Ongoing</Text>
//         </View>

//         <Image
//           source={{
//             uri: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
//           }}
//           style={styles.bigImage}
//         />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 16 },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 8,
//     elevation: 1,
//     backgroundColor: "#2434b1",
//   },

//   logoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   logoImage: {
//     width: 70,
//     height:60,
//     marginRight: 8,
//   },

//   logoText: {
//     fontSize: 25,
//     fontWeight: "700",
//     color: "#f0f4f0",
//   },

//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },

//   headerCard: {
//     backgroundColor: "#8f9cf7",
//     borderRadius: 20,
//     padding: 20,
//     marginBottom: 16,
//   },

//   title: { color: "#fff", fontSize: 22, fontWeight: "700" },
//   welcome: {
//     color: "#fff",
//     fontSize: 26,
//     fontWeight: "800",
//     marginTop: 10,
//   },
//   subtitle: { color: "#eef", marginTop: 6 },

//   statCard: {
//     backgroundColor: "#9aa6f9",
//     borderRadius: 18,
//     padding: 20,
//     marginBottom: 12,
//   },

//   statNo: { fontSize: 36, fontWeight: "800", color: "#fff" },
//   statText: { color: "#eef" },

//   bigImage: {
//     width: "100%",
//     height: 200,
//     borderRadius: 20,
//     marginVertical: 16,
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  const [user] = useState(null);

  const [cases, setCases] = useState([
    {
      id: 1,
      title: "Injured Street Dog",
      location: "Shivajinagar",
      status: "Pending",
    },
    {
      id: 2,
      title: "Bird with Broken Wing",
      location: "Wagholi",
      status: "Pending",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    const updated = cases.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setCases(updated);
    Alert.alert(`Case ${newStatus}`, `Case has been ${newStatus}.`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F6FF" }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/aniresq.png")}
            style={styles.logoImage}
          />
          <Text style={styles.logoText}>AniResQ NGO</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/ngo/profile")}>
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

      <ScrollView contentContainerStyle={styles.container}>
        
        {/* DASHBOARD CARD */}
        <View style={styles.headerCard}>
          <Text style={styles.dashboardTitle}>NGO Dashboard</Text>
          <Text style={styles.dashboardSub}>
            Manage and respond to animal rescue reports
          </Text>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNo}>{cases.length}</Text>
            <Text style={styles.statText}>Total Reports</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNo}>
              {cases.filter((c) => c.status === "Accepted").length}
            </Text>
            <Text style={styles.statText}>Accepted</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNo}>
              {cases.filter((c) => c.status === "Rejected").length}
            </Text>
            <Text style={styles.statText}>Rejected</Text>
          </View>
        </View>

        {/* SECTION TITLE */}
        <Text style={styles.sectionTitle}>Recent Reported Cases</Text>

        {/* CASE LIST */}
        {cases.map((item) => (
          <View key={item.id} style={styles.caseCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.caseTitle}>{item.title}</Text>
              <Text style={styles.caseLocation}>📍 {item.location}</Text>

              <View
                style={[
                  styles.statusBadge,
                  item.status === "Accepted" && styles.accepted,
                  item.status === "Rejected" && styles.rejected,
                  item.status === "Pending" && styles.pending,
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            {item.status === "Pending" && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => updateStatus(item.id, "Accepted")}
                >
                  <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => updateStatus(item.id, "Rejected")}
                >
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
          }}
          style={styles.bigImage}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#4A55E2",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoImage: {
    width: 60,
    height: 50,
    marginRight: 8,
  },

  logoText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },

  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#fff",
  },

  headerCard: {
    backgroundColor: "#6C79FF",
    borderRadius: 25,
    padding: 22,
    marginTop: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  dashboardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },

  dashboardSub: {
    color: "#EEF1FF",
    marginTop: 6,
    fontSize: 14,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    width: "31%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  statNo: {
    fontSize: 20,
    fontWeight: "800",
    color: "#4A55E2",
  },

  statText: {
    color: "#777",
    marginTop: 4,
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 14,
  },

  caseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },

  caseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  caseLocation: {
    color: "#777",
    marginTop: 4,
    fontSize: 13,
  },

  statusBadge: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 30,
    alignSelf: "flex-start",
  },

  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  accepted: {
    backgroundColor: "#4CAF50",
  },

  rejected: {
    backgroundColor: "#E53935",
  },

  pending: {
    backgroundColor: "#FFA726",
  },

  buttonRow: {
    justifyContent: "center",
    marginLeft: 10,
  },

  acceptBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 25,
    marginBottom: 8,
  },

  rejectBtn: {
    backgroundColor: "#E53935",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 25,
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  bigImage: {
    width: "100%",
    height: 170,
    borderRadius: 20,
    marginTop: 20,
  },
});