import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { Restaurant } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { fetchDistance } from "@/api/restaurant";

type Props = {
  restaurant: Restaurant;
  onPress?: () => void;
  coordUser?: { lat: number; lon: number };
};

export default function RestaurantCard({ restaurant, onPress, coordUser }: Props) {
  const { data: distanceData } = useQuery({
    queryKey: ["restaurant-distance", restaurant.id, coordUser],
    queryFn: () => {
      if (!coordUser?.lat || !coordUser?.lon) return undefined;
      return fetchDistance(restaurant.id, coordUser.lat, coordUser.lon);
    },
    enabled: !!coordUser?.lat && !!coordUser?.lon, // chỉ chạy khi có coordUser
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Cover source={{ uri: restaurant.image || "https://picsum.photos/700" }} style={styles.cardImage} />
      <View style={styles.row}>
        <Text style={styles.title}>{restaurant.name}</Text>
        {distanceData && distanceData.distance && (
          <Text style={styles.distance}>
            {distanceData.distance.distanceKm} km | {distanceData.distance.durationMin} phút
          </Text>
        )}
      </View>
      <Card.Content>
        <Text>{restaurant.category}</Text>
        <Text style={styles.address}>
          <FontAwesome name="map-marker" size={16} color="#FF5722" /> {restaurant.address}{" "}
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  distance: {
    fontSize: 14,
    color: "#666",
  },
});
