import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { GetIDAiWildDetection } from "../../Apiendpoint.jsx";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";

export default function AlertDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const response = await axios.get(GetIDAiWildDetection(id));
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0f9d58" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alert Details</Text>
        <View style={{ width: 24 }} />
      </View>
        {/* VIDEO */}
{data.videoUrl && (
  <Video
    source={{ uri: data.videoUrl }}
    style={styles.image}
    useNativeControls
    resizeMode="contain"
    isLooping
    shouldPlay={false}
  />
)}
      {/* VIDEO */}
   {/* {data.videoUrl && (
  <Video
    source={{ uri: data.videoUrl }}
    style={styles.image}
    useNativeControls
    resizeMode="contain"
    isLooping
    shouldPlay={false} // set true for auto-play
  />
)} */}

      {/* DETAILS CARD */}
      <View style={styles.card}>
        <Text style={styles.animalName}>{data.animal}</Text>
        <Text style={styles.subText}>
          {new Date(data.timestamp).toLocaleString()}
        </Text>

        <View style={styles.infoBox}>
          <Text>Confidence</Text>
          <Text>{data.confidence * 100}%</Text>
        </View>

        <View style={styles.infoBox}>
          <Text>Distance</Text>
          <Text>{data.distance} km</Text>
        </View>

        <View style={styles.infoBox}>
          <Text>Location</Text>
          <Text>{data.locationName}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text>Coordinates</Text>
          <Text>
            {data.latitude}, {data.longitude}
          </Text>
        </View>
      </View>

      {/* MAP */}
      {data.latitude && data.longitude && (
        <MapView
          style={{ height: 200, margin: 15, borderRadius: 20,overflow: 'hidden' }}
          initialRegion={{
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: Number(data.latitude),
              longitude: Number(data.longitude),
            }}
            title={data.locationName}
            description={data.animal}
          />
        </MapView>
      )}
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
    borderRadius: 25,
    marginTop: 20,
  },

  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 22,
    borderRadius: 25,
    elevation: 8,
  },
  animalName: {
    fontSize: 22,
    fontWeight: "bold",
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
});