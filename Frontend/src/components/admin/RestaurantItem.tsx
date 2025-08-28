import React from "react";
import { View, Image } from "react-native";
import { Button, List } from "react-native-paper";
import { Restaurant } from "@/types/restaurant";

type Props = {
  restaurant: Restaurant;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: number) => void;
  onPress: (id: number) => void;
};

export function RestaurantItem({ restaurant, onEdit, onDelete, onPress }: Props) {
  return (
    <List.Item
      title={restaurant.name}
      description="View & manage menu"
      onPress={() => onPress(restaurant.id)}
      left={() => <Image source={{ uri: restaurant.image }} style={{ width: 40, height: 40, borderRadius: 8 }} />}
      right={() => (
        <View style={{ flexDirection: "row" }}>
          <Button onPress={() => onEdit(restaurant)}>Edit</Button>
          <Button compact onPress={() => onDelete(restaurant.id)} textColor="red">
            Delete
          </Button>
        </View>
      )}
    />
  );
}
