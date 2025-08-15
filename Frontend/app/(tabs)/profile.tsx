import React from "react";
import { ScrollView, View } from "react-native";
import { Avatar, List, Button } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { profileApi } from "@/api/auth.api";
import { api } from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";

export default function ProfileScreen() {
  const router = useRouter();
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
      const res = await api.get(`${ROUTES.ORDER.ROOT}?userId=${me.id}`);
      return res.data;
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
              onPress={() => router.push(`/order/${o.id}` as any)}
            />
          ))}
        </List.Section>

        <Button
          mode="outlined"
          onPress={() => {
            // Xử lý logout
            logout();
          }}
          style={{ margin: 20 }}
        >
          Logout
        </Button>
      </ScrollView>
    </View>
  );
}
