// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Auth_login } from "../../Apiendpoint.jsx";

// export default function Signin() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert("Error", "Please enter email and password");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(Auth_login, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         Alert.alert("Login Failed", data.message || "Invalid credentials");
//         return;
//       }

//       // ✅ Save token and user info
//       await AsyncStorage.setItem("token", data.token);
//       await AsyncStorage.setItem("user", JSON.stringify(data.user));

//       Alert.alert("Success", "Login successful");

//       // Navigate based on role
//       if (data.user.role === "citizen") {
//         router.replace("/citizen/home");
//       } else if (data.user.role === "ngo") {
//         router.replace("/ngo/tab/home");
//       }else if (data.user.role === "admin") {
//         router.replace("/admin/AdminDashboard");
//       } 
//     }catch (error) {
//       Alert.alert("Error", "Server not reachable");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LinearGradient colors={["#b3d1ff", "#e6f0ff"]} style={styles.container}>
//       <Text style={styles.back} onPress={() => router.push("/")}>
//         ← Back to Home
//       </Text>

//       <View style={styles.card}>
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           autoCapitalize="none"
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />

//         <Text
//           style={styles.forgot}
//           onPress={() => router.push("/auth/forgotpassword")}
//         >
//           Forgot Password?
//         </Text>

//         <TouchableOpacity style={styles.button} onPress={handleLogin}>
//           <Text style={styles.buttonText}>
//             {loading ? "Logging in..." : "Login"}
//           </Text>
//         </TouchableOpacity>

//         <Text style={styles.signUpText}>
//           Don’t have an account?{" "}
//           <Text
//             style={styles.signUpLink}
//             onPress={() => router.push("/auth/signup")}
//           >
//             Sign Up
//           </Text>
//         </Text>
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
//   back: { color: "#2563eb", fontSize: 14, marginBottom: 10 },
//   card: { backgroundColor: "#fff", borderRadius: 16, padding: 20, elevation: 5 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     borderRadius: 10,
//     padding: 12,
//     marginTop: 10,
//   },
//   forgot: {
//     textAlign: "right",
//     color: "#2563eb",
//     marginTop: 6,
//     marginBottom: 10,
//     fontWeight: "500",
//   },
//   button: {
//     backgroundColor: "#2563eb",
//     padding: 14,
//     borderRadius: 12,
//     marginTop: 10,
//   },
//   buttonText: { color: "#fff", textAlign: "center", fontWeight: "600", fontSize: 16 },
//   signUpText: { textAlign: "center", marginTop: 15, color: "#555" },
//   signUpLink: { color: "#2563eb", fontWeight: "600" },
// });


import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Auth_login } from "../../Apiendpoint.jsx";
import { Ionicons } from "@expo/vector-icons";

export default function Signin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(Auth_login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "citizen") {
        router.replace("/citizen/home");
      } else if (data.user.role === "ngo") {
        router.replace("/ngo/tab/home");
      } else if (data.user.role === "admin") {
        router.replace("/admin/AdminDashboard");
      }
    } catch (error) {
      Alert.alert("Error", "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <View style={styles.card}>

        {/* 🔥 Your Image Here */}
        <Image
          source={require("../../assets/aniresq.png")} 
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to report and track animal cases
        </Text>

        {/* Email */}
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={18} color="#555" />
          <TextInput
            style={styles.input}
            placeholder="your.email@example.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={18} color="#555" />
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? "eye-off-outline" : "eye-outline"}
              size={18}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        <Text
          style={styles.forgot}
          onPress={() => router.push("/auth/forgotpassword")}
        >
          Forgot Password?
        </Text>

        {/* Button */}
        <TouchableOpacity onPress={handleLogin} disabled={loading}>
          <LinearGradient
            colors={["#667eea", "#5a67d8"]}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don't have an account?{" "}
          <Text
            style={styles.signupLink}
            onPress={() => router.push("/auth/signup")}
          >
            Sign Up
          </Text>
        </Text>

        <Text style={styles.termsText}>
          By continuing, you agree to our{" "}
          <Text style={styles.linkText}>Terms</Text> &{" "}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "88%",
    minHeight: 600,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 22,
    elevation: 12,
  },
  logo: {
  width: 100,        // आधी 90 होता
  height: 90,
  alignSelf: "center",
  marginBottom: 0,  // आधी 15 होता → spacing kami
},

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 22,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 12,   // 🔥 padding kami keli
    paddingHorizontal: 8,
  },
  forgot: {
    textAlign: "right",
    color: "#667eea",
    marginBottom: 18,
  },
  button: {
    paddingVertical: 14,   // 🔥 button padding kami keli
    borderRadius: 14,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupText: {
    textAlign: "center",
    color: "#555",
    marginTop: 18,
  },
  signupLink: {
    color: "#667eea",
    fontWeight: "bold",
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: "#888",
    marginTop: 50,
  
  },
  linkText: {
    color: "#667eea",
    fontWeight: "600",
  },
});