import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        404 - Không tìm thấy trang
      </Text>
      <Text style={styles.subtitle}>Trang bạn đang tìm không tồn tại hoặc đã bị xóa.</Text>

      <Button mode="contained" onPress={() => router.replace("/(tabs)")} style={{ marginTop: 20 }}>
        Về trang chủ
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: "gray",
  },
});
