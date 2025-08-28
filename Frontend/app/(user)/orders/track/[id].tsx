import React from "react";
import { View } from "react-native";
import { Route, router, Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchOrder } from "@/api/orders";
import { Appbar } from "react-native-paper";
import { ORDER_STEPS } from "@/constants";
import OrderCard from "@/components/OrderCard";

export default function OrderTracking() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: Route }>();
  const { data } = useQuery({ queryKey: ["order", id], queryFn: () => fetchOrder(id), refetchInterval: 5000 });

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Stack.Screen
        options={{
          headerShown: false, // Ẩn header mặc định của tab
        }}
      />

      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            if (from) {
              router.replace(from);
            } else {
              router.back();
            }
          }}
        />
        <Appbar.Content title="Your Order" />
      </Appbar.Header>
      {data && <OrderCard order={data} steps={ORDER_STEPS} />}
    </View>
  );
}
