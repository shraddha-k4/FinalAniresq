// import React from "react";
// import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";

// export default function AllReportedCasesScreen() {
//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backBtn}>
//           <Text style={styles.backText}>←</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>All Reported Cases</Text>
//         <Image
//           source={{ uri: "https://i.imgur.com/8KZQZ6G.png" }}
//           style={styles.logo}
//         />
//       </View>

//       {/* Search */}
//       <View style={styles.searchBox}>
//         <TextInput
//           placeholder="Search by case ID, location..."
//           placeholderTextColor="#8A8A8A"
//           style={styles.searchInput}
//         />
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabs}>
//         <View style={[styles.tab, styles.activeTab]}>
//           <Text style={styles.activeTabText}>All Cases</Text>
//         </View>
//         <View style={styles.tab}>
//           <Text style={styles.tabText}>In Progress</Text>
//         </View>
//         <View style={styles.tab}>
//           <Text style={styles.tabText}>Resolved</Text>
//         </View>
//       </View>

//       {/* Stats */}
//       <View style={styles.statsRow}>
//         <View style={styles.statCard}>
//           <Text style={styles.statNumber}>247</Text>
//           <Text style={styles.statLabel}>Total Cases</Text>
//           <Text style={styles.statUp}>↑ 12% this month</Text>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statNumber}>43</Text>
//           <Text style={styles.statLabel}>Active Cases</Text>
//           <Text style={styles.statDown}>↓ 8% this week</Text>
//         </View>
//       </View>

//       {/* Case Card */}
//       <View style={styles.caseCard}>
//         <View style={styles.caseHeader}>
//           <Text style={styles.caseId}>Case #AC-2847</Text>
//           <View style={styles.statusBadge}>
//             <Text style={styles.statusText}>Pending Review</Text>
//           </View>
//         </View>

//         <Text style={styles.caseInfo}>■ Reported by: Sarah Johnson</Text>
//         <Text style={styles.caseInfo}>■ Downtown Park, 5th Avenue</Text>

//         <View style={styles.caseInner}>
//           <Image
//             source={{ uri: "https://images.unsplash.com/photo-1558788353-f76d92427f16" }}
//             style={styles.caseImage}
//           />
//           <View>
//             <Text style={styles.caseTitle}>Injured Dog</Text>
//             <Text style={styles.caseDesc}>Severe leg injury, needs immediate care</Text>
//           </View>
//         </View>

//         <View style={styles.caseFooter}>
//           <Text style={styles.timeText}>Reported 2 hours ago</Text>
//           <TouchableOpacity style={styles.detailsBtn}>
//             <Text style={styles.detailsText}>View Details</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F4F6FA" },

//   header: {
//     backgroundColor: "#2E7D32",
//     paddingTop:14,
//     paddingBottom: 20,
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   backBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 8,
//     backgroundColor: "rgba(255,255,255,0.3)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   backText: { fontSize: 18, color: "#fff" },
//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#fff",
//   },
//   logo: { width: 36, height: 36, borderRadius: 6 },

//   searchBox: { padding: 16 },
//   searchInput: {
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     paddingHorizontal: 16,
//     height: 48,
//   },

//   tabs: { flexDirection: "row", paddingHorizontal: 16, gap: 10 },
//   tab: {
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//     borderRadius: 20,
//     backgroundColor: "#2E7D32",
//   },
//   activeTab: { backgroundColor: "#fff" },
//   tabText: { color: "#fff", fontWeight: "600" },
//   activeTabText: { color: "#2E7D32", fontWeight: "700" },

//   statsRow: { flexDirection: "row", padding: 16, gap: 16 },
//   statCard: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 16,
//   },
//   statNumber: { fontSize: 28, fontWeight: "800", color: "#1F2937" },
//   statLabel: { color: "#6B7280", marginTop: 4 },
//   statUp: { color: "#16A34A", marginTop: 8, fontWeight: "600" },
//   statDown: { color: "#16A34A", marginTop: 8, fontWeight: "600" },

//   caseCard: {
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     margin: 16,
//     padding: 16,
//   },
//   caseHeader: { flexDirection: "row", alignItems: "center" },
//   caseId: { fontSize: 16, fontWeight: "700", flex: 1 },
//   statusBadge: {
//     backgroundColor: "#FFE8B3",
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   statusText: { color: "#F59E0B", fontWeight: "700" },

//   caseInfo: { color: "#4B5563", marginTop: 10 },

//   caseInner: {
//     backgroundColor: "#F8FAFF",
//     borderRadius: 14,
//     padding: 12,
//     flexDirection: "row",
//     gap: 12,
//     marginTop: 14,
//     alignItems: "center",
//   },
//   caseImage: { width: 56, height: 56, borderRadius: 12 },
//   caseTitle: { fontSize: 16, fontWeight: "700" },
//   caseDesc: { color: "#6B7280", marginTop: 4 },

//   caseFooter: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 14,
//   },
//   timeText: { flex: 1, color: "#9CA3AF" },
//   detailsBtn: {
//     backgroundColor: "#6F83E6",
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     borderRadius: 12,
//   },
//   detailsText: { color: "#fff", fontWeight: "700" },
// });

import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Get_all_report } from "../../Apiendpoint.jsx";

export default function AllReportedCasesScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 1. Fetch Data Function (Axios n vaparta Fetch vaprun)
  const fetchReports = async () => {
    try {
      // Storage madhun token kadhne (Authentication sathi)
      const token = await AsyncStorage.getItem('userToken'); 

      const response = await fetch(Get_all_report, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Backend la token pathvane
        }
      });

      const result = await response.json();

      if (response.status === 200) {
        // Jar backend array pathvat asel tar logic
        setReports(Array.isArray(result) ? result : result.reports || []);
      } else if (response.status === 401) {
        Alert.alert("Error", "Tumcha session sampala aahe, parat login kara.");
      } else {
        console.error("Backend error:", result);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Network Error", "Backend connect hou shakat nahi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Reported Cases</Text>
        <Image
          source={{ uri: "https://i.imgur.com/8KZQZ6G.png" }}
          style={styles.logo}
        />
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search by case ID, location..."
          placeholderTextColor="#8A8A8A"
          style={styles.searchInput}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <View style={[styles.tab, styles.activeTab]}>
          <Text style={styles.activeTabText}>All Cases</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>In Progress</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>Resolved</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{reports.length}</Text>
          <Text style={styles.statLabel}>Total Cases</Text>
          <Text style={styles.statUp}>↑ Updated</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {reports.filter(r => r.status === 'Pending').length}
          </Text>
          <Text style={styles.statLabel}>Active Cases</Text>
          <Text style={styles.statDown}>Pending</Text>
        </View>
      </View>

      {/* Dynamic Case Cards */}
      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />
      ) : (
        reports.map((item, index) => (
          <View key={item._id || index} style={styles.caseCard}>
            <View style={styles.caseHeader}>
              <Text style={styles.caseId}>Case #{item.caseId || "N/A"}</Text>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: item.status === 'Resolved' ? '#DCFCE7' : '#FFE8B3' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: item.status === 'Resolved' ? '#16A34A' : '#F59E0B' }
                ]}>
                  {item.status || "Pending Review"}
                </Text>
              </View>
            </View>

            <Text style={styles.caseInfo}>■ Reported by: {item.reporterName || "Anonymous"}</Text>
            <Text style={styles.caseInfo}>■ {item.location || "Location missing"}</Text>

            <View style={styles.caseInner}>
              <Image
                source={{ uri: item.imageUrl || "https://images.unsplash.com/photo-1558788353-f76d92427f16" }}
                style={styles.caseImage}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.caseTitle}>{item.title || "No Title"}</Text>
                <Text style={styles.caseDesc} numberOfLines={2}>
                  {item.description || "No description provided."}
                </Text>
              </View>
            </View>

            <View style={styles.caseFooter}>
              <Text style={styles.timeText}>
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Just now"}
              </Text>
              <TouchableOpacity style={styles.detailsBtn}>
                <Text style={styles.detailsText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
      
      {!loading && reports.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 30, color: '#8A8A8A' }}>No reports found.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6FA" },
  header: { backgroundColor: "#2E7D32", paddingTop:14, paddingBottom: 20, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" },
  backBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center" },
  backText: { fontSize: 18, color: "#fff" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 20, fontWeight: "700", color: "#fff" },
  logo: { width: 36, height: 36, borderRadius: 6 },
  searchBox: { padding: 16 },
  searchInput: { backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 16, height: 48 },
  tabs: { flexDirection: "row", paddingHorizontal: 16, gap: 10 },
  tab: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, backgroundColor: "#2E7D32" },
  activeTab: { backgroundColor: "#fff" },
  tabText: { color: "#fff", fontWeight: "600" },
  activeTabText: { color: "#2E7D32", fontWeight: "700" },
  statsRow: { flexDirection: "row", padding: 16, gap: 16 },
  statCard: { flex: 1, backgroundColor: "#fff", borderRadius: 16, padding: 16 },
  statNumber: { fontSize: 28, fontWeight: "800", color: "#1F2937" },
  statLabel: { color: "#6B7280", marginTop: 4 },
  statUp: { color: "#16A34A", marginTop: 8, fontWeight: "600" },
  statDown: { color: "#16A34A", marginTop: 8, fontWeight: "600" },
  caseCard: { backgroundColor: "#fff", borderRadius: 20, margin: 16, padding: 16 },
  caseHeader: { flexDirection: "row", alignItems: "center" },
  caseId: { fontSize: 16, fontWeight: "700", flex: 1 },
  statusBadge: { backgroundColor: "#FFE8B3", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  statusText: { color: "#F59E0B", fontWeight: "700" },
  caseInfo: { color: "#4B5563", marginTop: 10 },
  caseInner: { backgroundColor: "#F8FAFF", borderRadius: 14, padding: 12, flexDirection: "row", gap: 12, marginTop: 14, alignItems: "center" },
  caseImage: { width: 56, height: 56, borderRadius: 12 },
  caseTitle: { fontSize: 16, fontWeight: "700" },
  caseDesc: { color: "#6B7280", marginTop: 4 },
  caseFooter: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  timeText: { flex: 1, color: "#9CA3AF" },
  detailsBtn: { backgroundColor: "#6F83E6", paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  detailsText: { color: "#fff", fontWeight: "700" },
});