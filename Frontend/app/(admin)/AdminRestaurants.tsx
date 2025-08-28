import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Card, Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Restaurant } from "@/types/restaurant";
import { ROUTES } from "@/routes";
import CreateOrEditRestaurantModal, { FormValuesRes } from "@/components/admin/CreateOrEditRestaurantModal";
import { RestaurantItem } from "@/components/admin/RestaurantItem";
import { useCreateRestaurant, useDeleteRestaurant, useRestaurants, useUpdateRestaurant } from "@/hooks/useRestaurants";

export default function AdminRestaurants() {
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant>();

  const { data: restaurants } = useRestaurants();
  const createMutation = useCreateRestaurant();
  const updateMutation = useUpdateRestaurant();
  const deleteMutation = useDeleteRestaurant();

  // handle modal
  const openAddModal = () => {
    setEditingRestaurant(undefined);
    setVisible(true);
  };

  const openEditModal = (item: Restaurant) => {
    setEditingRestaurant(item);
    setVisible(true);
  };

  // handle form tạo và sửa
  const handleSubmit = (data: FormValuesRes) => {
    if (editingRestaurant) {
      updateMutation.mutate({
        id: editingRestaurant.id,
        ...data,
        lat: +data.lat,
        lon: +data.lon,
      });
    } else {
      createMutation.mutate(data);
    }
    setVisible(false);
  };

  const handleDelete = (id: number) => {
    Alert.alert("Confirm delete", "Are you sure you want to delete this restaurant?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Restaurant Management</Text>

      <Button mode="contained" onPress={openAddModal} style={{ marginBottom: 12 }}>
        Add Restaurant
      </Button>

      <Card>
        <Card.Content>
          {restaurants?.map((r) => (
            <RestaurantItem
              key={r.id}
              restaurant={r}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onPress={(id) => router.push(ROUTES.ADMIN.RESTAURANT_MENU(id))}
            />
          ))}
        </Card.Content>
      </Card>

      {/* Modal thêm sửa*/}
      <CreateOrEditRestaurantModal
        visible={visible}
        onDismiss={() => setVisible(false)}
        initialValues={
          editingRestaurant && {
            ...editingRestaurant,
            description: editingRestaurant.description || "",
            image: editingRestaurant.image || "",
            lat: editingRestaurant.location?.latitude?.toString() || "0",
            lon: editingRestaurant.location?.longitude?.toString() || "0",
          }
        }
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  modal: { backgroundColor: "#fff", padding: 20, margin: 20, borderRadius: 8 },
});
