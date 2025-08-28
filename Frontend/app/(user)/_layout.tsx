import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  const commonScreenOptions = {
    headerShown: true,
    tabBarActiveTintColor: "#FF5722",
    tabBarInactiveTintColor: "#777",
    tabBarStyle: {
      backgroundColor: "#fff",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      height: 60,
      paddingBottom: 6,
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    headerStyle: {
      backgroundColor: "#fff",
    },
    headerTintColor: "#FF5722",
    headerTitleStyle: {
      fontWeight: "bold" as const,
    },
  };

  return (
    <Tabs screenOptions={commonScreenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "🍔 QuickBite",
          tabBarLabel: "QuickBite",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="cart" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="clipboard-list" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="orders/track/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="restaurant/[id]"
        options={{
          href: null, // Ẩn khỏi tab bar
        }}
      />
    </Tabs>
  );
}
