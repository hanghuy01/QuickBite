import { View, StyleSheet, ImageBackground } from "react-native";
import { Text } from "react-native-paper";
import React from "react";

export default function AuthBackground({ children }: { children: React.ReactNode }) {
  return (
    <ImageBackground
      source={{ uri: "https://images.pexels.com/photos/845808/pexels-photo-845808.jpeg" }}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.brand}>🍔 QuickBite</Text>
          <Text style={styles.tagline}>Nhanh chóng • Ngon miệng • Tiện lợi</Text>
        </View>

        <View style={styles.formBox}>{children}</View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  brand: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF5722",
  },
  tagline: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  formBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
});
