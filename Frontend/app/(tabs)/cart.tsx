import React from "react";
import { View, FlatList } from "react-native";
import { Appbar, Button, Card, Text } from "react-native-paper";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import { createOrder } from "@/api/orders";
import { ROUTES, RouteString } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";

export default function CartScreen() {
  const { user } = useAuth();
  const { state, removeItem, clearCart } = useCart();
  const qc = useQueryClient();
  const { from } = useLocalSearchParams<{ from?: RouteString }>();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      clearCart();
      qc.invalidateQueries({ queryKey: ["orders"] }); // Cập nhật danh sách đơn hàng đã cũ
      router.push(ROUTES.ORDER.TRACK(order.id));
    },
  });

  const checkout = async () => {
    if (!state.restaurantId || state.items.length === 0 || !user || !state.total) return;

    await mutateAsync({
      userId: user.id,
      totalAmount: +state.total.toFixed(2),
      restaurantId: state.restaurantId,
      items: state.items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: false, // Ẩn header mặc định của tab
        }}
      />

      {/* Header có nút quay lại */}
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            if (from) {
              router.replace(from); // Quay lại đúng RestaurantDetail
            } else {
              router.back();
            }
          }}
        />
        <Appbar.Content title="Your Cart" />
      </Appbar.Header>

      <View style={{ flex: 1, padding: 16 }}>
        <FlatList
          data={state.items}
          keyExtractor={(i) => String(i.menuItemId)}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 12 }}>
              <Card.Title title={item.nameRestaurant} titleStyle={{ fontWeight: "bold" }} subtitle={item.name} />
              <Card.Content>
                <Text variant="bodyMedium">{`x${item.quantity} • $${item.price}`}</Text>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => removeItem(item.menuItemId)}>Remove</Button>
              </Card.Actions>
            </Card>
          )}
          ListEmptyComponent={<Text>Your cart is empty</Text>}
        />
        <Card style={{ padding: 16 }}>
          <Text variant="titleMedium">Total: ${state.total.toFixed(2)}</Text>
          <Button mode="contained" onPress={checkout} loading={isPending} disabled={!state.items.length}>
            Checkout
          </Button>
        </Card>
      </View>
    </View>
  );
}
