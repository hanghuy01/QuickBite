import React from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchOrder } from "@/api/orders";
import { Appbar, Card, ProgressBar, Text } from "react-native-paper";

const mapProgress = (status: string) => {
  switch (status) {
    case "confirmed":
      return 0.25;
    case "preparing":
      return 0.5;
    case "on_the_way":
      return 0.75;
    case "delivered":
      return 1;
    default:
      return 0.1;
  }
};

export default function OrderTracking() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const { data } = useQuery({ queryKey: ["order", id], queryFn: () => fetchOrder(Number(id)), refetchInterval: 5000 });

  const progress = mapProgress(data?.status ?? "pending");

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            if (from) {
              router.replace(from as any); // Quay lại đúng RestaurantDetail
            } else {
              router.back();
            }
          }}
        />
        <Appbar.Content title="Your Cart" />
      </Appbar.Header>
      <Card>
        <Card.Title title={`Order #${id}`} subtitle={`Status: ${data?.status ?? "pending"}`} />
        <Card.Content>
          <Text>Tracking your order…</Text>
          <ProgressBar progress={progress} style={{ marginTop: 12 }} />
        </Card.Content>
      </Card>
    </View>
  );
}
