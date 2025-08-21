import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { Restaurant } from "@/types/types";

type Props = {
  restaurant: Restaurant;
  onPress?: () => void;
};

export default function RestaurantCard({ restaurant, onPress }: Props) {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Cover source={{ uri: restaurant.image || "https://picsum.photos/700" }} style={styles.cardImage} />
      <Card.Title title={restaurant.name} subtitle={restaurant.category} />
      <Card.Content>
        <Text style={styles.address}>
          <FontAwesome name="map-marker" size={16} color="#FF5722" /> {restaurant.address}{" "}
          {restaurant.distance !== undefined && (
            <Text style={styles.distance}> | {restaurant.distance.toFixed(2)} km</Text>
          )}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
  },
  cardImage: { height: 140 },
  address: { marginTop: 4, color: "#333" },
  distance: { color: "gray" },
});
