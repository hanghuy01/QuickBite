import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Searchbar, Chip, Card, Text, ActivityIndicator, Title } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { fetchRestaurants } from "@/api/restaurant";
import { Restaurant } from "@/types/types";
import { getUserLocation } from "@/utils/location";
import { ROUTES } from "@/constants";

const CATEGORIES = ["All", "Pizza", "Sushi", "Drinks"];

export default function HomeScreen() {
  const [q, setQ] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(q);
  const [cat, setCat] = useState("All");

  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [address, setAddress] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["restaurants", debouncedSearch, cat, coords], // q dùng thêm debounce
    queryFn: () => fetchRestaurants(debouncedSearch, cat === "All" ? undefined : cat, coords?.lat, coords?.lon),
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(q);
    }, 300); // debounce 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [q]);

  // lấy vị trí hiện tại
  useEffect(() => {
    (async () => {
      try {
        const coords = await getUserLocation();
        setCoords({ lat: coords.lat, lon: coords.lon });
        setAddress(coords.address);
      } catch (err) {
        console.log((err as Error).message);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      {/* Hiện vị trí user */}
      {address ? (
        <Text style={{ marginTop: 8, fontStyle: "italic" }}>📍 Your location: {address}</Text>
      ) : (
        <Text style={{ marginTop: 8, fontStyle: "italic" }}>📍 Getting your location...</Text>
      )}
      <Searchbar placeholder="Search restaurants" value={q} onChangeText={setQ} />
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {CATEGORIES.map((c) => (
          <Chip key={c} selected={cat === c} onPress={() => setCat(c)}>
            {c}
          </Chip>
        ))}
      </View>

      <Title style={{ marginTop: 12, marginBottom: 4 }}>Nearby Restaurants</Title>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item: Restaurant) => String(item.id)}
          renderItem={({ item }) => (
            <Link href={ROUTES.RESTAURANT.DETAILS(item.id)} asChild>
              <Card style={{ marginVertical: 8 }}>
                <Card.Cover source={{ uri: item.image || "https://picsum.photos/700" }} />
                <Card.Title title={item.name} subtitle={item.category} />
                <Card.Content>
                  <Text>
                    <FontAwesome name="map-marker" size={16} color="black" /> {item.address}{" "}
                    {item.distance !== undefined && (
                      <Text style={{ color: "gray" }}> | {item.distance.toFixed(2)} km</Text>
                    )}
                  </Text>
                </Card.Content>
              </Card>
            </Link>
          )}
          ListEmptyComponent={<Text>No restaurant found</Text>}
        />
      )}
    </View>
  );
}
