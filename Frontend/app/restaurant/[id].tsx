import React from "react";
import { View, StyleSheet, FlatList, Image, ActivityIndicator } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { fetchRestaurant } from "@/api/restaurant";
import { Restaurant } from "@/types/types";
import { ROUTES } from "@/constants";

export default function RestaurantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, addItem, decreaseItem } = useCart();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery<Restaurant>({
    queryKey: ["restaurant", id],
    queryFn: () => fetchRestaurant(id),
    enabled: !!id,
  });

  // Get quantity menu item
  const getQuantity = (menuItemId: number) => state.items.find((i) => i.menuItemId === menuItemId)?.quantity ?? 0;

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // TODO: The user can refresh?
  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Text>Error loading restaurant</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Banner */}
      <Image source={{ uri: data.image }} style={styles.banner} />

      {/* Restaurant Info */}
      <Text variant="headlineMedium" style={styles.title}>
        {data.name}
      </Text>
      <Text style={styles.subtitle}>{data.category}</Text>

      {/* Menu */}
      <FlatList
        data={data.menuItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const qty = getQuantity(item.id);
          return (
            <Card style={styles.card}>
              <Card.Cover source={{ uri: item.image }} />
              <Card.Title title={item.name} subtitle={`${item.price.toLocaleString()}₫`} />
              <Card.Actions style={{ justifyContent: "flex-end" }}>
                <View style={styles.qtyContainer}>
                  <Button
                    mode="contained-tonal"
                    compact
                    style={styles.circleButton}
                    contentStyle={{ height: 36 }}
                    onPress={() => decreaseItem(item.id)}
                    disabled={qty === 0}
                  >
                    -
                  </Button>
                  <Text style={styles.qtyText}>{qty}</Text>
                  <Button
                    mode="contained"
                    compact
                    style={styles.circleButton}
                    contentStyle={{ height: 36 }}
                    onPress={() =>
                      addItem({
                        menuItemId: item.id,
                        nameRestaurant: data.name,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                        restaurantId: Number(id),
                      })
                    }
                  >
                    +
                  </Button>
                </View>
              </Card.Actions>
            </Card>
          );
        }}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Floating Cart Button */}
      <Button
        mode="contained"
        style={styles.cartButton}
        onPress={() =>
          router.push({
            pathname: ROUTES.TABS.CART,
            params: { from: ROUTES.RESTAURANT.DETAILS(+id) },
          })
        }
      >
        View Cart ({state.items.length})
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: { width: "100%", height: 200 },
  title: { marginTop: 12, marginHorizontal: 16 },
  subtitle: { marginHorizontal: 16, color: "gray", marginBottom: 12 },
  card: { marginHorizontal: 16, marginBottom: 12 },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 8,
  },
  cartButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    borderRadius: 24,
  },
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    padding: 0,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
