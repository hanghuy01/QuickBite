import React from "react";
import { View, FlatList } from "react-native";
import { Card, Text } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/api/orders";
import { Link } from "expo-router";
import { ROUTES } from "@/constants/routes";

export default function OrdersScreen() {
  const { data } = useQuery({ queryKey: ["orders"], queryFn: fetchOrders });

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={data ?? []}
        keyExtractor={(o) => String(o.id)}
        renderItem={({ item }) => (
          <Link href={`${ROUTES.ORDER.TRACK}/${item.id}` as any} asChild>
            <Card style={{ marginBottom: 12 }}>
              <Card.Title title={`Order #${item.id}`} subtitle={`Status: ${item.status}`} />
              <Card.Content>
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
