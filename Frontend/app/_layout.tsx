import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { PaperProvider } from "react-native-paper";

function InnerLayout() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) {
      router.replace("/(auth)/login");
    } else {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, loading, router]);

  if (loading) return null;

  return <Slot />;
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
