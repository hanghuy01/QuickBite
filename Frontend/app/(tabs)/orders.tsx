import React from "react";
import { View, FlatList } from "react-native";
import { Card, Text } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { fetchMyOrder } from "@/api/orders";
import { Link } from "expo-router";
import { ROUTES } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";

export default function OrdersScreen() {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["myOrders"],
    queryFn: async () => {
      const res = await fetchMyOrder("" + user?.id);
      return res;
    },
  });
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={data ?? []}
        keyExtractor={(o) => String(o.id)}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/orders/track/[id]",
              params: { id: String(item.id), from: ROUTES.TABS.ORDERS }, // thêm from
            }}
            asChild
          >
            <Card style={{ marginBottom: 12 }}>
              <Card.Title title={`Order #${item.id}`} subtitle={`Status: ${item.status}`} />
              <Card.Content>
                <Text>Total: ${item.totalAmount}</Text>
                <Text>{new Date(item.createdAt).toLocaleString()}</Text>
              </Card.Content>
            </Card>
          </Link>
        )}
        ListEmptyComponent={<Text>No orders yet</Text>}
      />
    </View>
  );
}
