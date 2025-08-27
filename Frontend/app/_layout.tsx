import { ROUTES } from "@/constants";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { PaperProvider } from "react-native-paper";

// TODO: Should group auth & none auth layouts & role layouts & general pages
function InnerLayout() {
  const { loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(ROUTES.AUTH.LOGIN);
    } else if (user?.role === "ADMIN") {
      router.replace(ROUTES.ADMIN.ROOT);
    } else {
      router.replace(ROUTES.TABS.ROOT);
    }
  }, [loading, router, user]);

  if (loading) return null;
  return <Slot />;
}

export default function RootLayout() {
  return (
    <PaperProvider>
      {/* TODO: Split QueryClient to instance */}
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
