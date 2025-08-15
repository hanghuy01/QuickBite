import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Searchbar, Chip, Card, Text, ActivityIndicator, Title } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { fetchRestaurants } from "@/api/restaurant";
import { Restaurant } from "@/types/types";

const CATEGORIES = ["All", "Pizza", "Sushi", "Drinks"];

export default function HomeScreen() {
  const [q, setQ] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(q);
  const [cat, setCat] = useState("All");

  const { data, isLoading } = useQuery({
    queryKey: ["restaurants", debouncedSearch, cat], // q dùng thêm debounce
    queryFn: () => fetchRestaurants(debouncedSearch, cat === "All" ? undefined : cat),
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(q);
    }, 300); // debounce 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [q]);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
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
            <Link href={`/restaurant/${item.id}` as any} asChild>
              <Card style={{ marginVertical: 8 }}>
                <Card.Cover source={{ uri: item.image || "https://picsum.photos/700" }} />
                <Card.Title title={item.name} subtitle={item.category} />
              </Card>
            </Link>
          )}
          ListEmptyComponent={<Text>No restaurant found</Text>}
        />
      )}
    </View>
  );
}
