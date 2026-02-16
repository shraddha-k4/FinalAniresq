import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { My_Report } from "../../Apiendpoint.jsx";

export default function ReportHistory() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(My_Report, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setReports(data.reports || []);
    } catch (err) {
      console.log("Report fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report History</Text>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>No reports found</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push(`/citizen/reportDetails?id=${item._id}`)
            }
          >
            {/* IMAGE */}
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.reportImage}
              />
            ) : (
              <Text>No image available</Text>
            )}

            {/* DATE */}
            <Text style={styles.label}>
              Date: {new Date(item.incidentDate).toLocaleDateString()}
            </Text>

            {/* STATUS */}
            <Text style={styles.status}>
              Status: {item.status}
            </Text>

            {/* NGO ACCEPTED */}
            <Text style={styles.ngo}>
              Accepted By:{" "}
              {item.acceptedBy?.name
                ? item.acceptedBy.name
                : "Not accepted yet"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 15,
    backgroundColor: "white",
    elevation: 4,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 3,
  },

  label: {
    fontSize: 15,
    marginBottom: 5,
  },

  reportImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginVertical: 10,
  },

  status: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  ngo: {
    fontSize: 14,
    marginTop: 5,
    color: "#444",
  },
});




// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { My_Report } from "../Apiendpoints.jsx";

// export default function ReportHistory() {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");

//       const res = await fetch(My_Report, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       setReports(data.reports || []);
//     } catch (err) {
//       console.log("Report fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* 🔹 HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={26} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Report History</Text>
//       </View>

//       {/* 🔹 REPORT LIST */}
//       <FlatList
//         data={reports}
//         keyExtractor={(item) => item._id}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons name="document-text-outline" size={60} color="#999" />
//             <Text style={styles.emptyTitle}>No Reports Yet</Text>
//             <Text style={styles.emptyText}>
//               You haven’t submitted any reports yet.
//             </Text>
//           </View>
//         }
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.card}
//             onPress={() =>
//               router.push(`/citizen/reportDetails?id=${item._id}`)
//             }
//           >
//             <Text style={styles.label}>
//               Date: {new Date(item.incidentDate).toLocaleDateString()}
//             </Text>

//             <Text style={styles.label}>
//               Location: {item.location?.latitude},{" "}
//               {item.location?.longitude}
//             </Text>

//             <Text style={styles.status}>
//               Status: {item.status}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F5F5",
//   },

//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     backgroundColor: "white",
//     elevation: 4,
//   },

//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginLeft: 10,
//   },

//   card: {
//     backgroundColor: "white",
//     padding: 15,
//     margin: 10,
//     borderRadius: 10,
//     elevation: 3,
//   },

//   label: {
//     fontSize: 15,
//     marginBottom: 5,
//   },

//   status: {
//     fontSize: 15,
//     fontWeight: "bold",
//     color: "#2E7D32",
//   },

//   // 🔹 Empty State Styles
//   emptyContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 100,
//   },

//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 10,
//   },

//   emptyText: {
//     fontSize: 14,
//     color: "#666",
//     marginTop: 5,
//   },
// });
