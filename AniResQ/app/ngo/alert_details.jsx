// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";

// export default function AlertDetails() {
//   const router = useRouter();

//   return (
//     <ScrollView style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Alert Details</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* IMAGE */}
//      <Image
//   source={require("../../assets/tiger.jpeg")}
//   style={styles.detectImage}
//   resizeMode="cover"
// />
//       {/* ACTION BUTTONS */}
//       <View style={styles.buttonRow}>
//         <TouchableOpacity style={styles.smallBtn}>
//           <Text style={styles.smallBtnText}>Download</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.smallBtn}>
//           <Text style={styles.smallBtnText}>Zoom</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.smallBtn}>
//           <Text style={styles.smallBtnText}>Report</Text>
//         </TouchableOpacity>
//       </View>

//       {/* MAIN CARD */}
//       <View style={styles.card}>
//         <View style={styles.titleRow}>
//           <Text style={styles.animalName}>Bengal Tiger</Text>
//           <View style={styles.alertBadge}>
//             <Text style={styles.alertText}>Critical Alert</Text>
//           </View>
//         </View>

//         <Text style={styles.subText}>
//           Detected on Dec 28, 2024 at 3:45 PM
//         </Text>

//         {/* INFO BOXES */}
//         <View style={styles.infoBox}>
//           <Text style={styles.label}>Confidence Level</Text>
//           <Text style={styles.value}>99.2%</Text>
//         </View>

//         <View style={styles.infoBox}>
//           <Text style={styles.label}>Animal Behavior</Text>
//           <Text style={styles.value}>Moving Towards Village</Text>
//         </View>

//         <View style={styles.infoBox}>
//           <Text style={styles.label}>Distance from Settlement</Text>
//           <Text style={styles.value}>2.3 km</Text>
//         </View>

//         <View style={styles.infoBox}>
//           <Text style={styles.label}>Camera ID</Text>
//           <Text style={styles.value}>CAM-A3-045</Text>
//         </View>

//         {/* LOCATION */}
//         <Text style={styles.sectionTitle}>Location Details</Text>

//         <View style={styles.mapBox}>
//           <Text style={{ color: "#666" }}>Map Preview Here</Text>
//         </View>

//         <Text style={styles.locationText}>
//           Sundarbans National Park, Zone A3
//         </Text>
//         <Text style={styles.coordText}>
//           Coordinates: 21.9497° N, 89.1833° E
//         </Text>

//         {/* TIMELINE */}
//         <Text style={styles.sectionTitle}>Detection Timeline</Text>

//         <View style={styles.timelineItem}>
//           <View style={styles.dot} />
//           <View>
//             <Text style={styles.timelineTitle}>Animal Detected</Text>
//             <Text style={styles.timelineDesc}>
//               AI system identified Bengal Tiger with 99% confidence
//             </Text>
//           </View>
//         </View>

//         <View style={styles.timelineItem}>
//           <View style={styles.dot} />
//           <View>
//             <Text style={styles.timelineTitle}>Alert Sent</Text>
//             <Text style={styles.timelineDesc}>
//               Notification sent to forest rangers
//             </Text>
//           </View>
//         </View>

//         <View style={styles.timelineItem}>
//           <View style={styles.dot} />
//           <View>
//             <Text style={styles.timelineTitle}>
//               Response Team Dispatched
//             </Text>
//             <Text style={styles.timelineDesc}>
//               Wildlife team en route to location
//             </Text>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#f2f7f4",
//     flex: 1,
//   },

//   header: {
//     backgroundColor: "#0f9d58",
//     padding: 20,
//     paddingTop: 50,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },

//   headerTitle: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "bold",
//   },

//   image: {
//     width: "100%",
//     height: 230,
//   },

//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginVertical: 15,
//   },

//   smallBtn: {
//     backgroundColor: "#e6f4ea",
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//     borderRadius: 20,
//   },

//   smallBtnText: {
//     color: "#0f9d58",
//     fontWeight: "600",
//   },

//   card: {
//     backgroundColor: "#fff",
//     margin: 15,
//     padding: 20,
//     borderRadius: 20,
//     elevation: 5,
//   },

//   titleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   animalName: {
//     fontSize: 22,
//     fontWeight: "bold",
//   },

//   alertBadge: {
//     backgroundColor: "#ffdddd",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },

//   alertText: {
//     color: "red",
//     fontWeight: "600",
//   },

//   subText: {
//     marginVertical: 10,
//     color: "#666",
//   },

//   infoBox: {
//     backgroundColor: "#f1f5f2",
//     padding: 15,
//     borderRadius: 15,
//     marginTop: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },

//   label: {
//     color: "#444",
//   },

//   value: {
//     fontWeight: "bold",
//   },

//   sectionTitle: {
//     marginTop: 20,
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#0f9d58",
//   },

//   mapBox: {
//     height: 150,
//     backgroundColor: "#e0e0e0",
//     borderRadius: 15,
//     marginVertical: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   locationText: {
//     fontWeight: "600",
//   },

//   coordText: {
//     color: "#666",
//     marginBottom: 10,
//   },

//   timelineItem: {
//     flexDirection: "row",
//     marginTop: 15,
//   },

//   dot: {
//     width: 10,
//     height: 10,
//     backgroundColor: "#0f9d58",
//     borderRadius: 5,
//     marginRight: 10,
//     marginTop: 5,
//   },

//   timelineTitle: {
//     fontWeight: "bold",
//   },

//   timelineDesc: {
//     color: "#666",
//     fontSize: 13,
//   },
// });


import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import alert from "./tab/alert";

export default function AlertDetails() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() =>  router.push("/ngo/tab/alert")}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Alert Details</Text>

        {/* Empty view for perfect center alignment */}
        <View style={{ width: 24 }} />
      </View>

      {/* IMAGE */}
      <Image
        source={require("../../assets/tiger.jpeg")}
        style={styles.image}
        resizeMode="cover"
      />

      {/* ACTION BUTTONS */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.smallBtn}>
          <Text style={styles.smallBtnText}>Download</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallBtn}>
          <Text style={styles.smallBtnText}>Zoom</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallBtn}>
          <Text style={styles.smallBtnText}>Report</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN CARD */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <Text style={styles.animalName}>Bengal Tiger</Text>
          <View style={styles.alertBadge}>
            <Text style={styles.alertText}>Critical Alert</Text>
          </View>
        </View>

        <Text style={styles.subText}>
          Detected on Dec 28, 2024 at 3:45 PM
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Confidence Level</Text>
          <Text style={styles.value}>99.2%</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Animal Behavior</Text>
          <Text style={styles.value}>Moving Towards Village</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Distance from Settlement</Text>
          <Text style={styles.value}>2.3 km</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Camera ID</Text>
          <Text style={styles.value}>CAM-A3-045</Text>
        </View>

        <Text style={styles.sectionTitle}>Location Details</Text>

        <View style={styles.mapBox}>
          <Text style={{ color: "#666" }}>Map Preview Here</Text>
        </View>

        <Text style={styles.locationText}>
          Sundarbans National Park, Zone A3
        </Text>
        <Text style={styles.coordText}>
          Coordinates: 21.9497° N, 89.1833° E
        </Text>

        <Text style={styles.sectionTitle}>Detection Timeline</Text>

        <View style={styles.timelineItem}>
          <View style={styles.dot} />
          <View>
            <Text style={styles.timelineTitle}>Animal Detected</Text>
            <Text style={styles.timelineDesc}>
              AI system identified Bengal Tiger with 99% confidence
            </Text>
          </View>
        </View>

        <View style={styles.timelineItem}>
          <View style={styles.dot} />
          <View>
            <Text style={styles.timelineTitle}>Alert Sent</Text>
            <Text style={styles.timelineDesc}>
              Notification sent to forest rangers
            </Text>
          </View>
        </View>

        <View style={styles.timelineItem}>
          <View style={styles.dot} />
          <View>
            <Text style={styles.timelineTitle}>
              Response Team Dispatched
            </Text>
            <Text style={styles.timelineDesc}>
              Wildlife team en route to location
            </Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f7f4",
    flex: 1,
  },

  header: {
    backgroundColor: "#0f9d58",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  image: {
    width: "92%",
    height: 240,
    alignSelf: "center",
    borderRadius: 20,
    marginTop: 20, // ❌ overlap removed
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },

  smallBtn: {
    backgroundColor: "#e6f4ea",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 25,
    elevation: 3,
  },

  smallBtnText: {
    color: "#0f9d58",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 22,
    borderRadius: 25,
    elevation: 8,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  animalName: {
    fontSize: 22,
    fontWeight: "bold",
  },

  alertBadge: {
    backgroundColor: "#ffdddd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  alertText: {
    color: "red",
    fontWeight: "600",
  },

  subText: {
    marginVertical: 10,
    color: "#666",
  },

  infoBox: {
    backgroundColor: "#f1f5f2",
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    color: "#444",
  },

  value: {
    fontWeight: "bold",
  },

  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f9d58",
  },

  mapBox: {
    height: 150,
    backgroundColor: "#e0e0e0",
    borderRadius: 15,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  locationText: {
    fontWeight: "600",
  },

  coordText: {
    color: "#666",
    marginBottom: 10,
  },

  timelineItem: {
    flexDirection: "row",
    marginTop: 18,
  },

  dot: {
    width: 12,
    height: 12,
    backgroundColor: "#0f9d58",
    borderRadius: 6,
    marginRight: 12,
    marginTop: 6,
  },

  timelineTitle: {
    fontWeight: "bold",
  },

  timelineDesc: {
    color: "#666",
    fontSize: 13,
  },
});