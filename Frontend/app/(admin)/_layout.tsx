import { Stack } from "expo-router";
import { ROUTES } from "@/constants";
import { ActivityIndicator, View } from "react-native";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export default function AdminLayout() {
  const { loading } = useProtectedRoute({
    allowedRoles: ["ADMIN"],
    redirectTo: ROUTES.TABS.ROOT,
  });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
