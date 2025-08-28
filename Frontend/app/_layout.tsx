import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

function InnerLayout() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  if (loading) return <></>;

  return (
    <Stack>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={isAdmin}>
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(user)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <CartProvider>
            <InnerLayout />
            {/* <Stack screenOptions={{ headerShown: false }} /> */}
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </PaperProvider>
  );
}
