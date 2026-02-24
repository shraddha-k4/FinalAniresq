// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Auth_signup } from '../../Apiendpoint.jsx';

// export default function Signup() {
//   const router = useRouter();

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [mobileno, setMobileno] = useState('');
//   const [role, setRole] = useState('citizen');
//   const [open, setOpen] = useState(false);
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSignup = async () => {
//     // 🔐 VALIDATIONS
//     if (!name || !email || !mobileno || !password || !confirmPassword) {
//       Alert.alert('Error', 'All fields are required');
//       return;
//     }

//     if (!/^\d{10}$/.test(mobileno)) {
//       Alert.alert('Error', 'Mobile number must be exactly 10 digits');
//       return;
//     }

//     if (password.length < 8) {
//       Alert.alert('Error', 'Password must be at least 8 characters');
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return;
//     }

//     setLoading(true);

//     try {
//       // ✅ EXACT BACKEND MATCH PAYLOAD
//       const signupData = {
//         name: name.trim(),
//         email: email.trim().toLowerCase(),
//         mobileno,
//         password,
//         role: role.toLowerCase(),
//       };

//       console.log('Signup Payload:', signupData);

//       const response = await fetch(Auth_signup, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(signupData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         Alert.alert('Signup Failed', data.message || 'Something went wrong');
//         return;
//       }

//       // ✅ Save token & user info to AsyncStorage
//       await AsyncStorage.setItem('token', data.token);
//       await AsyncStorage.setItem('user', JSON.stringify(data.user));

//       Alert.alert('Success', 'Account created successfully');

//       // ✅ ROLE BASED ROUTING
//       setTimeout(() => {
//         if (data.user.role === 'citizen') {
//           router.replace('/citizen/home');
//         } else if (data.user.role === 'ngo') {
//           router.replace('/ngo/tab/home');
//         }
//       }, 300);

//     } catch (error) {
//       Alert.alert(
//         'Network Error',
//         'Server not reachable. Check IP & WiFi'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LinearGradient colors={['#b3d1ff', '#e6f0ff']} style={styles.container}>
//       <Text style={styles.back} onPress={() => router.push('/')}>
//         ← Back to Home
//       </Text>

//       <Text style={styles.title}>Join Our Mission</Text>
//       <Text style={styles.subtitle}>
//         Choose your role in protecting animals
//       </Text>

//       <View style={styles.card}>
//         <TextInput
//           style={styles.input}
//           placeholder="Full Name"
//           value={name}
//           onChangeText={setName}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Email Address"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Mobile Number"
//           value={mobileno}
//           onChangeText={setMobileno}
//           keyboardType="phone-pad"
//           maxLength={10}
//         />

//         <Text style={styles.label}>Select Role</Text>

//         <TouchableOpacity
//           style={styles.dropdown}
//           onPress={() => setOpen(!open)}
//         >
//           <Text style={styles.dropdownText}>{role}</Text>
//         </TouchableOpacity>

//         {open && (
//           <View style={styles.dropdownMenu}>
//             {['citizen', 'ngo'].map((item) => (
//               <TouchableOpacity
//                 key={item}
//                 style={styles.dropdownItem}
//                 onPress={() => {
//                   setRole(item);
//                   setOpen(false);
//                 }}
//               >
//                 <Text style={styles.dropdownItemText}>{item}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Confirm Password"
//           secureTextEntry
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//         />

//         <TouchableOpacity
//           style={[styles.button, loading && { opacity: 0.7 }]}
//           onPress={handleSignup}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>
//             {loading ? 'Creating account...' : `Sign Up as ${role}`}
//           </Text>
//         </TouchableOpacity>

//         <Text style={styles.signInText}>
//           Already have an account?{' '}
//           <Text
//             style={styles.signInLink}
//             onPress={() => router.push('/auth/signin')}
//           >
//             Sign In
//           </Text>
//         </Text>
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
//   back: { color: '#2563eb', fontSize: 14, marginBottom: 10 },
//   title: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
//   subtitle: { textAlign: 'center', color: '#555', marginBottom: 20 },
//   card: { backgroundColor: '#fff', borderRadius: 16, padding: 20 },
//   input: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 10,
//     padding: 12,
//     marginTop: 10,
//   },
//   label: { marginTop: 15, fontWeight: '500' },
//   dropdown: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 10,
//     padding: 12,
//   },
//   dropdownMenu: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 10,
//     marginTop: 5,
//     backgroundColor: '#fff',
//   },
//   dropdownItem: {
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   button: {
//     backgroundColor: '#2563eb',
//     padding: 14,
//     borderRadius: 12,
//     marginTop: 20,
//   },
//   buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
//   signInText: { textAlign: 'center', marginTop: 15 },
//   signInLink: { color: '#2563eb', fontWeight: '600' },
// });



import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Auth_signup } from "../../Apiendpoint.jsx";
import { Ionicons } from "@expo/vector-icons";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileno, setMobileno] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("citizen"); // ✅ Added Role
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !mobileno || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (!/^\d{10}$/.test(mobileno)) {
      Alert.alert("Error", "Mobile number must be exactly 10 digits");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const signupData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        mobileno,
        password,
        role: role, // ✅ Dynamic Role
      };

      const response = await fetch(Auth_signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Signup Failed", data.message || "Something went wrong");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      Alert.alert("Success", "Account created successfully");

      // Role based navigation (optional but useful)
      if (role === "ngo") {
        router.replace("/ngo/tab/home");
      } else {
        router.replace("/citizen/home");
      }
    } catch (error) {
      Alert.alert("Network Error", "Server not reachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.back} onPress={() => router.push("/")}>
          ← Back to Home
        </Text>

        <View style={styles.card}>
          <Image
            source={require("../../assets/aniresq.png")}
            style={styles.logo}
          />

          <Text style={styles.title}>Join Our Mission</Text>
          <Text style={styles.subtitle}>
            Choose your role in protecting animals
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={mobileno}
            onChangeText={setMobileno}
            keyboardType="phone-pad"
            maxLength={10}
          />

          {/* ✅ Role Selection */}
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "citizen" && styles.activeRole,
              ]}
              onPress={() => setRole("citizen")}
            >
              <Text
                style={[
                  styles.roleText,
                  role === "citizen" && styles.activeRoleText,
                ]}
              >
                Citizen
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "ngo" && styles.activeRole,
              ]}
              onPress={() => setRole("ngo")}
            >
              <Text
                style={[
                  styles.roleText,
                  role === "ngo" && styles.activeRoleText,
                ]}
              >
                NGO
              </Text>
            </TouchableOpacity>
          </View>

          {/* Password */}
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={22}
                color="#667eea"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              <Ionicons
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={22}
                color="#667eea"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/signin")}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.terms}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  back: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 25,
    minHeight: 650,
    elevation: 8,
  },

  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 10,
    resizeMode: "contain",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    backgroundColor: "#f9fafb",
  },

  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginHorizontal: 5,
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },

  activeRole: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },

  roleText: {
    fontWeight: "600",
    color: "#6b7280",
  },

  activeRoleText: {
    color: "#fff",
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    marginTop: 12,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 14,
    height: 55,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
  },

  button: {
    backgroundColor: "#667eea",
    padding: 16,
    borderRadius: 16,
    marginTop: 25,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },

  loginText: {
    color: "#6b7280",
    fontSize: 14,
  },

  loginLink: {
    color: "#667eea",
    fontWeight: "700",
    fontSize: 14,
  },

  terms: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 15,
    fontSize: 12,
  },
});