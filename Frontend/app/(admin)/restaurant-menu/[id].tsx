import React, { useState } from "react";
import { View, Alert, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Card, List, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuItemModal, { FormValues } from "@/components/admin/MenuItemModal";
import { MenuItem } from "@/types/menu";
import { useRestaurant } from "@/hooks/useRestaurants";
import { useMenuItemMutations } from "@/hooks/useMenuItem";

export default function RestaurantMenu() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem>();

  const { data } = useRestaurant(id);
  const { add, edit, remove } = useMenuItemMutations(id!);

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
      edit.mutate({ ...data, id: editingItem.id });
    } else {
      add.mutate({ ...data, restaurantId });
    }
    setVisible(false);
  };

  const handleDelete = (id: number) => {
    Alert.alert("Xoá món", `Bạn có chắc muốn xoá món này?`, [
      { text: "Hủy", style: "cancel" },
      { text: "Xoá", style: "destructive", onPress: () => remove.mutate(id) },
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
