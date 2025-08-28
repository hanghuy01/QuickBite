import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { ROUTES } from "@/routes";
import { Card, List, Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.topRow}>
        <Text style={styles.hello}>Hello, {user?.name || "Admin"} 👋</Text>
        <Button mode="outlined" onPress={logout} icon="logout" compact>
          Logout
        </Button>
      </View>

      <Card style={styles.card} onPress={() => router.push(ROUTES.ADMIN.ORDER_TRACKING)}>
        <Card.Content>
          <List.Item
            title="Order Tracking"
            description="📦 Xem & quản lý đơn hàng"
            left={(props) => <List.Icon {...props} icon="truck" />}
          />
        </Card.Content>
      </Card>

      {/* Restaurants Management */}
      <Card style={styles.card} onPress={() => router.push(ROUTES.ADMIN.RESTAURANTS)}>
        <Card.Content>
          <List.Item
            title="Restaurants"
            description="🏠 Quản lý nhà hàng"
            left={(props) => <List.Icon {...props} icon="store" />}
          />
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  hello: { fontSize: 18, color: "#555" },
  card: { marginBottom: 12 },
});
