import { 
  View, Text, StyleSheet, Image, Pressable, ScrollView, TextInput, TouchableOpacity, Alert, Platform 
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";

export default function Index() {  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    console.log({ name, email, message });
    Alert.alert("Message Sent!", "This is a demo. Backend is not connected.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* ================= WHITE HEADER ================= */}
      <View style={styles.whiteHeader}>
        <View style={styles.logoRow}>
          <Image
            source={require("../assets/aniresq.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerLogoText}>AniResQ</Text>
        </View>

        <Pressable
          style={styles.getStarted}
          onPress={() => router.push("/auth/signup")}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </Pressable>
      </View>

      {/* ================= BLUE HERO SECTION ================= */}
      <View style={styles.blueContainer}>
        <Text style={styles.title}>
          Protecting Every Paw,{"\n"}Saving Every Life
        </Text>

        <Text style={styles.desc}>
          Join the movement to end animal abuse. Report, rescue, and restore hope
          for animals in need through our community-driven platform.
        </Text>

        <View style={styles.card}>
          <Image
            source={require("../assets/image/landing.jpg")}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.quote}>
            “Every animal deserves a voice. Be theirs.”
          </Text>
        </View>

        <Pressable
          style={styles.cta}
          onPress={() => router.push("/auth/signup")}
        >
          <Text style={styles.ctaText}>Start Saving Lives</Text>
        </Pressable>
      </View>

      {/* ================= WHY SECTION ================= */}
      <View style={styles.whySection}>
        <Text style={styles.whyTitle}>Why AniResQ?</Text>

        <View style={styles.whyCard}>
          <View style={[styles.iconBox, { backgroundColor: "#E0EAFF" }]}><Text style={styles.icon}>⚡</Text></View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Rapid Response</Text>
            <Text style={styles.cardDesc}>
              AI-powered detection ensures immediate alerts to nearby NGOs and rescue teams.
            </Text>
          </View>
        </View>

        <View style={styles.whyCard}>
          <View style={[styles.iconBox, { backgroundColor: "#E6F8F0" }]}><Text style={styles.icon}>👥</Text></View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Community Driven</Text>
            <Text style={styles.cardDesc}>
              Connect citizens with verified NGOs creating a strong rescue network.
            </Text>
          </View>
        </View>

        <View style={styles.whyCard}>
          <View style={[styles.iconBox, { backgroundColor: "#FFF3E0" }]}><Text style={styles.icon}>📊</Text></View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Track Impact</Text>
            <Text style={styles.cardDesc}>
              Real-time updates show the difference you're making.
            </Text>
          </View>
        </View>
      </View>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <View style={styles.howSection}>
        <Text style={styles.howTitle}>How It Works</Text>

        {[1, 2, 3, 4].map((step) => (
          <View key={step} style={styles.howCard}>
            <View style={styles.numberCircle}><Text style={styles.numberText}>{step}</Text></View>
            <View style={styles.howText}>
              <Text style={styles.cardTitle}>
                {step === 1 ? "Report" : step === 2 ? "Alert" : step === 3 ? "Rescue" : "Follow"}
              </Text>
              <Text style={styles.cardDesc}>
                {step === 1
                  ? "Snap a photo or video of animal abuse/distress"
                  : step === 2
                  ? "Alerts nearby verified NGOs instantly"
                  : step === 3
                  ? "Professional teams respond and provide necessary care"
                  : "Track recovery progress and celebrate success stories"}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* ================= RECENT RESCUES SECTION ================= */}
      <View style={styles.rescueSection}>
        <Text style={styles.rescueTitle}>Recent Rescues</Text>

        <View style={styles.rescueCard}>
          <Image
            source={require("../assets/image/dog-before-after.jpg")}
            style={styles.rescueImage}
            resizeMode="cover"
          />
          <View style={styles.rescueText}>
            <Text style={styles.rescueCardTitle}>Bella's Second Chance</Text>
            <Text style={styles.rescueDesc}>
              Rescued from neglect, now thriving with loving family
            </Text>
            <View style={styles.rescueFooter}>
              <Text style={styles.reportedBy}>Reported by: Sarah M.</Text>
              <Text style={styles.timeAgo}>2 days ago</Text>
            </View>
          </View>
        </View>

        <View style={styles.rescueCard}>
          <Image
            source={require("../assets/image/sparrow-rescue.jpg")}
            style={styles.rescueImage}
            resizeMode="contain"
          />
          <View style={styles.rescueText}>
            <Text style={styles.rescueCardTitle}>Phoenix Takes Flight</Text>
            <Text style={styles.rescueDesc}>
              Injured sparrow fully recovered and released
            </Text>
            <View style={styles.rescueFooter}>
              <Text style={styles.reportedBy}>Reported by: Mike R.</Text>
              <Text style={styles.timeAgo}>1 week ago</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ================= TESTIMONIAL SECTION ================= */}
      <View style={styles.testimonialSection}>
        <Text style={styles.testimonialTitle}>What Our Heroes Say</Text>

        <View style={styles.testimonialCard}>
          <Image
            source={require("../assets/image/doc1.jpg")}
            style={styles.testimonialAvatar}
            resizeMode="contain"
          />
          <View style={styles.testimonialText}>
            <Text style={styles.testimonialName}>Dr. Emily Chen</Text>
            <Text style={styles.testimonialRole}>Animal Welfare NGO</Text>
            <Text style={styles.testimonialQuote}>
              "SentinalSense has revolutionized our response time. We've saved 40% more animals since joining the platform."
            </Text>
          </View>
        </View>

        <View style={styles.testimonialCard}>
          <Image
            source={require("../assets/image/doc2.jpg")}
            style={styles.testimonialAvatar}
            resizeMode="contain"
          />
          <View style={styles.testimonialText}>
            <Text style={styles.testimonialName}>James Wilson</Text>
            <Text style={styles.testimonialRole}>Concerned Citizen</Text>
            <Text style={styles.testimonialQuote}>
              "Finally, a way to make a real difference. I've helped rescue 3 animals in my neighborhood."
            </Text>
          </View>
        </View>
      </View>

      {/* ================= GET IN TOUCH SECTION ================= */}
      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Get In Touch</Text>

        <View style={styles.contactInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#1a1a1a" />
            <Text style={styles.infoText}>support@sentinalsense.com</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#1a1a1a" />
            <Text style={styles.infoText}>+1 (555) 123-4567</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#1a1a1a" />
            <Text style={styles.infoText}>24/7 Emergency Hotline</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Your Message"
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.button} onPress={handleSend}>
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  /* ================= COMMON STYLES ================= */
  whiteHeader: { backgroundColor: "#fff", marginLeft:3,marginRight:15,marginTop:18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logoRow: { flexDirection: "row", alignItems: "center"},
  logo: { width:80, height:60},
  headerLogoText: { color: "#111827", fontSize: 18, fontWeight: "700" },
  getStarted: { backgroundColor: "#2563EB", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  getStartedText: { color: "#fff", fontWeight: "600" },
  blueContainer: { backgroundColor: "#2563EB", padding: 20 },
  title: { marginTop: 30, color: "#fff", fontSize: 28, fontWeight: "800", textAlign: "center" },
  desc: { marginTop: 16, color: "#E5E7EB", fontSize: 15, textAlign: "center", lineHeight: 22 },

  /* ================= CARD SHADOW FIX ================= */
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 6 },
      android: { elevation: 3 },
      web: { boxShadow: "0px 3px 6px rgba(0,0,0,0.08)" },
    }),
  },

  image: { width: "100%", height: 210, borderRadius: 14 },
  quote: { color: "#D1D5DB", marginTop: 12, fontStyle: "italic", textAlign: "center" },
  cta: { marginTop: 30, backgroundColor: "#F59E0B", paddingVertical: 14, borderRadius: 14 },
  ctaText: { textAlign: "center", fontWeight: "bold", fontSize: 16, color: "#000" },

  whySection: { backgroundColor: "#fff", padding: 20, paddingTop: 40 },
  whyTitle: { textAlign: "center", fontSize: 24, fontWeight: "800", marginBottom: 30 },
  whyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    marginBottom: 18,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
      android: { elevation: 2 },
      web: { boxShadow: "0px 2px 4px rgba(0,0,0,0.08)" },
    }),
  },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 14 },
  icon: { fontSize: 20 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  cardDesc: { fontSize: 14, color: "#6B7280", lineHeight: 20 },

  howSection: { backgroundColor: "#F9FAFB", padding: 20, paddingTop: 40 },
  howTitle: { textAlign: "center", fontSize: 24, fontWeight: "800", marginBottom: 30 },
  howCard: { flexDirection: "row", alignItems: "flex-start", marginBottom: 20 },
  numberCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#2563EB", justifyContent: "center", alignItems: "center", marginRight: 14 },
  numberText: { color: "#fff", fontWeight: "700" },
  howText: { flex: 1 },

  rescueSection: { padding: 20, backgroundColor: "#fff", paddingBottom: 40 },
  rescueTitle: { fontSize: 24, fontWeight: "800", textAlign: "center", marginBottom: 20 },
  rescueCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
      android: { elevation: 2 },
      web: { boxShadow: "0px 2px 4px rgba(0,0,0,0.08)" },
    }),
  },
  rescueImage: { width: "100%", height: 200 },
  rescueText: { padding: 12 },
  rescueCardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  rescueDesc: { fontSize: 14, color: "#6B7280", marginBottom: 8 },
  rescueFooter: { flexDirection: "row", justifyContent: "space-between" },
  reportedBy: { fontSize: 12, color: "#9CA3AF" },
  timeAgo: { fontSize: 12, color: "#9CA3AF" },

  testimonialSection: { padding: 20, backgroundColor: "#F5F8FC", paddingBottom: 40 },
  testimonialTitle: { fontSize: 24, fontWeight: "800", textAlign: "center", marginBottom: 20 },
  testimonialCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
      android: { elevation: 2 },
      web: { boxShadow: "0px 2px 4px rgba(0,0,0,0.08)" },
    }),
  },
  testimonialAvatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  testimonialText: { flex: 1 },
  testimonialName: { fontWeight: "700", fontSize: 16, color: "#111827" },
  testimonialRole: { fontSize: 14, color: "#6B7280", marginBottom: 8 },
  testimonialQuote: { fontSize: 14, color: "#374151" },

  contactSection: { padding: 20, backgroundColor: "#fff", paddingBottom: 40 },
  contactTitle: { fontSize: 24, fontWeight: "800", textAlign: "center", marginBottom: 20 },
  contactInfo: { marginBottom: 20 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  infoText: { marginLeft: 10, fontSize: 16, color: "#1a1a1a" },
  formContainer: {},
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 15, fontSize: 16, backgroundColor: "#f9f9f9" },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
