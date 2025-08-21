import React, { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Title, Card, List, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRestaurant, deleteRestaurant, fetchRestaurants, updateRestaurant } from "@/api/restaurant";
import { Restaurant } from "@/types/types";
import { ROUTES } from "@/constants";
import CreateOrEditRestaurantModal, { FormValuesRes } from "@/components/admin/CreateOrEditRestaurantModal";

export default function AdminRestaurants() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [visible, setVisible] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant>();

  // Fetch restaurants
  const { data: restaurants } = useQuery<Restaurant[]>({
    queryKey: ["restaurants"],
    queryFn: () => fetchRestaurants(),
  });

  // Mutation
  const createMutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] }); // refresh list
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Restaurant) =>
      updateRestaurant(data.id, { ...data, location: { latitude: data.lat, longitude: data.lon } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteRestaurant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });

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
    Alert.alert("Xác nhận xoá", `Bạn có chắc chắn muốn xoá nhà hàng này không?`, [
      { text: "Hủy", style: "cancel" },
      { text: "Xoá", style: "destructive", onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>Quản lý Nhà hàng</Title>

      <Button mode="contained" onPress={openAddModal} style={{ marginBottom: 12 }}>
        Thêm nhà hàng
      </Button>

      <Card>
        <Card.Content>
          {restaurants?.map((r) => (
            <List.Item
              key={r.id}
              title={r.name}
              description="Xem & quản lý menu"
              onPress={() => router.push(ROUTES.ADMIN.RESTAURANT_MENU(r.id) as any)}
              left={() => <Image source={{ uri: r.image }} style={{ width: 40, height: 40, borderRadius: 8 }} />}
              right={() => (
                <View style={{ flexDirection: "row" }}>
                  <Button onPress={() => openEditModal(r)}>Sửa</Button>
                  <Button compact onPress={() => handleDelete(r.id)} textColor="red">
                    Xoá
                  </Button>
                </View>
              )}
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
