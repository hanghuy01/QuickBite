import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Searchbar, Chip, Text, ActivityIndicator } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { fetchRestaurants } from "@/api/restaurant";
import { Restaurant } from "@/types/types";
import { getUserLocation } from "@/utils/location";
import RestaurantCard from "@/components/RestaurantCard";
import { ROUTES } from "@/routes";
import { router } from "expo-router";

const CATEGORIES = ["All", "Pizza", "Sushi", "Drinks"];

export default function HomeScreen() {
  const [q, setQ] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(q);
  const [cat, setCat] = useState("All");

  const [coords, setCoords] = useState<{ lat: number; lon: number }>();
  const [address, setAddress] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["restaurants", debouncedSearch, cat, coords],
    queryFn: () => fetchRestaurants(debouncedSearch, cat === "All" ? undefined : cat, coords?.lat, coords?.lon),
  });

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(q), 300);
    return () => clearTimeout(handler);
  }, [q]);

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
    <View style={styles.container}>
      {/* Hiện vị trí user */}
      <Text style={styles.locationText}>📍 {address ? `Your location: ${address}` : "Getting your location..."}</Text>

      <Searchbar
        placeholder="Search restaurants"
        value={q}
        onChangeText={setQ}
        style={styles.searchbar}
        inputStyle={{ color: "#333" }}
        iconColor="#FF5722"
      />

      <View style={styles.chipRow}>
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            selected={cat === c}
            onPress={() => setCat(c)}
            style={[styles.chip, cat === c && styles.chipSelected]}
            textStyle={cat === c ? styles.chipTextSelected : styles.chipText}
          >
            {c}
          </Chip>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Nearby Restaurants</Text>

      {isLoading ? (
        <ActivityIndicator color="#FF5722" />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item: Restaurant) => String(item.id)}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              coordUser={coords}
              onPress={() => router.push(ROUTES.USER.RESTAURANT.DETAILS(item.id))}
            />
          )}
          ListEmptyComponent={<Text>No restaurant found</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  locationText: { marginTop: 8, fontStyle: "italic", color: "#555" },
  searchbar: {
    marginVertical: 12,
    borderRadius: 8,
    borderColor: "#FF5722",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  chipRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: { borderColor: "#FF5722", borderWidth: 1, backgroundColor: "#fff" },
  chipSelected: { backgroundColor: "#FF5722" },
  chipText: { color: "#FF5722" },
  chipTextSelected: { color: "#fff" },
  sectionTitle: { marginTop: 16, marginBottom: 8, color: "#FF5722", fontWeight: "bold" },
});
