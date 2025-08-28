import React, { useMemo, useState } from "react";
import { View, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { Appbar, Searchbar, Text } from "react-native-paper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Route, router, useLocalSearchParams } from "expo-router";
import { fetchOrders, updateOrderStatusApi } from "@/api/orders";
import OrderCard from "@/components/OrderCard";

import { Order } from "@/types/order";
import { ORDER_STEPS } from "@/constants";

export default function AdminOrderTracking() {
  const { from } = useLocalSearchParams<{ from?: Route }>();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch orders
  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  // Mutation để update status
  const mutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) => updateOrderStatusApi(orderId, status),

    onSuccess: (_, { orderId, status }) => {
      // Cập nhật lại dữ liệu trong cache
      queryClient.setQueryData(["orders"], (old: Order[]) =>
        old?.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["orders"] });
    // },
  });

  const handleUpdateStatus = (orderId: string, currentStatus: string) => {
    const currentIndex = ORDER_STEPS.findIndex((s) => s.key === currentStatus);
    if (currentIndex >= ORDER_STEPS.length - 1) return; // Đã delivered

    const nextStatus = ORDER_STEPS[currentIndex + 1].key;
    mutation.mutate({ orderId, status: nextStatus });
  };

  // Search
  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    return orders.filter((order) => String(order.id).toLowerCase().includes(searchQuery.toLowerCase()));
  }, [orders, searchQuery]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Lỗi khi tải đơn hàng</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            if (from) {
              router.replace(from);
            } else {
              router.back();
            }
          }}
        />
        <Appbar.Content title="Order Tracking" />
        <Appbar.Action icon="refresh" onPress={() => refetch()} />
      </Appbar.Header>

      {/* Thanh search */}
      <Searchbar
        placeholder="Tìm theo Order ID"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
      />

      {filteredOrders.length === 0 ? (
        <View style={styles.center}>
          <Text>Không tìm thấy đơn hàng</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              steps={ORDER_STEPS}
              onUpdateStatus={handleUpdateStatus}
              showActions={true}
              // Loading cho đúng orderId đang update
              loading={mutation.isPending && mutation.variables?.orderId === String(item.id)}
            />
          )}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchbar: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
});
