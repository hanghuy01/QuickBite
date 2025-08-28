import React, { useState } from "react";
import { View, Alert, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Card, List, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchRestaurant } from "@/api/restaurant";
import MenuItemModal, { FormValues } from "@/components/admin/MenuItemModal";
import { addMenuItem, deleteMenuItem, editMenuItem } from "@/api/menuItem.api";
import { MenuItem } from "@/types/menu";
import { Restaurant } from "@/types/restaurant";

export default function RestaurantMenu() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem>();

  const { data } = useQuery<Restaurant>({
    queryKey: ["restaurant", id],
    queryFn: () => fetchRestaurant(id),
    enabled: !!id,
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: addMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant", id] });
    },
  });

  const editMutation = useMutation({
    mutationFn: (data: MenuItem) => editMenuItem(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant", id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant", id] });
    },
  });

  const openAddModal = () => {
    setEditingItem(undefined);
    setVisible(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setVisible(true);
  };

  // handle form tạo và sửa
  const handleSubmit = (data: FormValues) => {
    const restaurantId = +id;
    if (editingItem) {
      editMutation.mutate({ ...data, id: editingItem.id });
    } else {
      addMutation.mutate({ ...data, restaurantId });
    }
    setVisible(false);
  };

  const handleDelete = (id: number) => {
    Alert.alert("Xoá món", `Bạn có chắc muốn xoá món này?`, [
      { text: "Hủy", style: "cancel" },
      { text: "Xoá", style: "destructive", onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Button onPress={() => router.back()}>← Back</Button>

      <Card style={{ marginVertical: 12 }}>
        <Card.Content>
          <List.Item
            title={`Menu ${data?.name}`}
            description="🧋 Thêm món mới"
            right={() => <Button onPress={openAddModal}>Thêm</Button>}
          />

          {data?.menuItems?.map((item) => (
            <List.Item
              key={item.id}
              title={item.name}
              description={`Giá: $${item.price}`}
              left={() =>
                item.image ? (
                  <Image source={{ uri: item.image }} style={{ width: 40, height: 40, borderRadius: 8 }} />
                ) : null
              }
              right={() => (
                <View style={{ flexDirection: "row" }}>
                  <Button style={{ padding: 0, margin: 0 }} onPress={() => openEditModal(item)}>
                    Sửa
                  </Button>
                  <Button
                    compact
                    style={{ margin: 0, padding: 0 }}
                    textColor="red"
                    onPress={() => handleDelete(item.id)}
                  >
                    Xoá
                  </Button>
                </View>
              )}
            />
          ))}
        </Card.Content>
      </Card>

      <MenuItemModal
        visible={visible}
        onDismiss={() => setVisible(false)}
        onSubmit={handleSubmit}
        defaultValues={
          editingItem && {
            name: editingItem.name,
            price: editingItem.price,
            image: editingItem.image ?? "",
            description: editingItem.description ?? "",
          }
        }
        submitLabel={editingItem ? "Cập nhật" : "Thêm món"}
      />
    </SafeAreaView>
  );
}
