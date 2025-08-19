import React from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchOrder } from "@/api/orders";
import { Appbar } from "react-native-paper";
import { ORDER_STEPS, RouteString } from "@/constants";
import OrderCard from "@/components/OrderCard";

export default function OrderTracking() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: RouteString }>();
  const { data } = useQuery({ queryKey: ["order", id], queryFn: () => fetchOrder(id), refetchInterval: 5000 });

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
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
