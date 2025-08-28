import React from "react";
import { ScrollView, View } from "react-native";
import { Avatar, List, Button } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/auth.api";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMyOrder } from "@/api/orders";

export default function ProfileScreen() {
  const { logout } = useAuth();

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await profileApi();
      return res;
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["myOrders"],
    queryFn: async () => {
      const res = await fetchMyOrder(me.id);
      return res;
    },
    enabled: !!me,
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {me && (
          <View style={{ alignItems: "center", padding: 20 }}>
            <Avatar.Text size={80} label={me.name[0]} />
            <List.Item title={me.name} description={me.email} />
          </View>
        )}

        <List.Section title="Order History">
          {orders?.map((o: any) => (
            <List.Item
              key={o.id}
              title={`Order #${o.id}`}
              description={`Status: ${o.status}`}
              // onPress={() => router.push(`/order/${o.id}` as any)}
            />
          ))}
        </List.Section>

        <Button
          mode="outlined"
          onPress={logout}
          icon="logout"
          style={{ margin: 20, borderColor: "#FF5722" }}
          textColor="#FF5722"
          compact
        >
          Logout
        </Button>
      </ScrollView>
    </View>
  );
}
