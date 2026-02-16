// // Blacklisted.jsx

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import { BlurView } from "expo-blur";

// export default function BlacklistedAccounts() {
//   const [accounts, setAccounts] = useState([
//     {
//       id: "1",
//       name: "Rahul Patil",
//       type: "User",
//       reason: "Submitted 3 fake rescue reports",
//       blacklistedDate: "2026-02-01",
//     },
//     {
//       id: "2",
//       name: "WildCare NGO",
//       type: "NGO",
//       reason: "No rescue activity for 20+ days",
//       blacklistedDate: "2026-01-25",
//     },
//   ]);

//   const calculateDays = (date) => {
//     const today = new Date();
//     const blacklisted = new Date(date);
//     const diffTime = Math.abs(today - blacklisted);
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   };

//   const unblacklistAccount = (id) => {
//     Alert.alert(
//       "Confirm Action",
//       "Are you sure you want to unblacklist this account?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Unblacklist",
//           onPress: () =>
//             setAccounts((prev) => prev.filter((item) => item.id !== id)),
//         },
//       ]
//     );
//   };

//   const renderItem = ({ item }) => (
//     <BlurView intensity={80} tint="light" style={styles.glassCard}>
//       <View style={styles.headerRow}>
//         <Text style={styles.name}>{item.name}</Text>

//         <View
//           style={[
//             styles.badge,
//             item.type === "NGO" ? styles.ngoBadge : styles.userBadge,
//           ]}
//         >
//           <Text style={styles.badgeText}>{item.type}</Text>
//         </View>
//       </View>

//       <Text style={styles.reason}>Reason: {item.reason}</Text>
//       <Text style={styles.date}>
//         Blacklisted On: {item.blacklistedDate}
//       </Text>
//       <Text style={styles.days}>
//         Blacklisted Since: {calculateDays(item.blacklistedDate)} days
//       </Text>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => unblacklistAccount(item.id)}
//       >
//         <Text style={styles.buttonText}>Unblacklist</Text>
//       </TouchableOpacity>
//     </BlurView>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Blacklisted Accounts</Text>

//       {accounts.length === 0 ? (
//         <Text style={styles.emptyText}>No blacklisted accounts 🎉</Text>
//       ) : (
//         <FlatList
//           data={accounts}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#0F2027",
//   },
//   heading: {
//     fontSize: 26,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "white",
//   },

//   glassCard: {
//     padding: 20,
//     borderRadius: 20,
//     marginBottom: 20,
//     backgroundColor: "rgba(255,255,255,0.15)",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.3)",
//     overflow: "hidden",
//   },

//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },

//   name: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//   },

//   badge: {
//     paddingVertical: 5,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//   },

//   ngoBadge: {
//     backgroundColor: "rgba(255,152,0,0.8)",
//   },

//   userBadge: {
//     backgroundColor: "rgba(33,150,243,0.8)",
//   },

//   badgeText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 12,
//   },

//   reason: {
//     marginTop: 5,
//     fontSize: 14,
//     color: "#f1f1f1",
//   },

//   date: {
//     marginTop: 5,
//     fontSize: 13,
//     color: "#ddd",
//   },

//   days: {
//     marginTop: 3,
//     fontSize: 13,
//     color: "#FF5252",
//     fontWeight: "600",
//   },

//   button: {
//     marginTop: 15,
//     backgroundColor: "rgba(76,175,80,0.8)",
//     paddingVertical: 10,
//     borderRadius: 12,
//     alignItems: "center",
//   },

//   buttonText: {
//     color: "white",
//     fontWeight: "bold",
//   },

//   emptyText: {
//     textAlign: "center",
//     marginTop: 40,
//     fontSize: 16,
//     color: "white",
//   },
// });



import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Admin_Get_Blacklisted,
  Admin_Unblacklist_User,
} from "../../Apiendpoint.jsx"; // adjust path

export default function BlacklistedAccounts() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchBlacklisted();
  }, []);

  const fetchBlacklisted = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(Admin_Get_Blacklisted, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        const formatted = data.users.map((u) => ({
          id: u._id,
          name: u.name,
          type: u.role === "ngo" ? "NGO" : "User",
          reason: u.blacklistReason || "No reason",
          blacklistedDate: u.updatedAt?.slice(0, 10),
        }));

        setAccounts(formatted);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateDays = (date) => {
    const today = new Date();
    const blacklisted = new Date(date);
    const diffTime = Math.abs(today - blacklisted);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const unblacklistAccount = (id) => {
    Alert.alert(
      "Confirm Action",
      "Are you sure you want to unblacklist this account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unblacklist",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");

              await fetch(Admin_Unblacklist_User(id), {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              fetchBlacklisted(); // refresh list
            } catch (err) {
              console.log(err);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <BlurView intensity={80} tint="light" style={styles.glassCard}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{item.name}</Text>

        <View
          style={[
            styles.badge,
            item.type === "NGO"
              ? styles.ngoBadge
              : styles.userBadge,
          ]}
        >
          <Text style={styles.badgeText}>{item.type}</Text>
        </View>
      </View>

      <Text style={styles.reason}>Reason: {item.reason}</Text>
      <Text style={styles.date}>
        Blacklisted On: {item.blacklistedDate}
      </Text>
      <Text style={styles.days}>
        Blacklisted Since: {calculateDays(item.blacklistedDate)} days
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => unblacklistAccount(item.id)}
      >
        <Text style={styles.buttonText}>Unblacklist</Text>
      </TouchableOpacity>
    </BlurView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Blacklisted Accounts</Text>

      {accounts.length === 0 ? (
        <Text style={styles.emptyText}>
          No blacklisted accounts 🎉
        </Text>
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0F2027",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  glassCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  ngoBadge: {
    backgroundColor: "rgba(255,152,0,0.8)",
  },
  userBadge: {
    backgroundColor: "rgba(33,150,243,0.8)",
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  reason: {
    marginTop: 5,
    fontSize: 14,
    color: "#f1f1f1",
  },
  date: {
    marginTop: 5,
    fontSize: 13,
    color: "#ddd",
  },
  days: {
    marginTop: 3,
    fontSize: 13,
    color: "#FF5252",
    fontWeight: "600",
  },
  button: {
    marginTop: 15,
    backgroundColor: "rgba(76,175,80,0.8)",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "white",
  },
});
