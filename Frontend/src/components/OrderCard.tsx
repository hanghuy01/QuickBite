import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { ORDER_STEPS } from "@/constants";
import { Order } from "@/types/order";

type OrderCardProps = {
  order: Order;
  steps: typeof ORDER_STEPS;
  onUpdateStatus?: (orderId: string, currentStatus: string) => void;
  loading?: boolean;
  showActions?: boolean;
};

export default function OrderCard({ order, steps, onUpdateStatus, loading, showActions = false }: OrderCardProps) {
  const currentIndex = steps.findIndex((s) => s.key === order.status);
  // format giờ tạo
  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
      })
    : "-";
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">Order #{order.id}</Text>

        <Text variant="bodySmall" style={styles.customer}>
          Customer: {order.user?.name}
        </Text>

        <Text variant="bodySmall">Created: {createdAt}</Text>
        <Text variant="bodySmall" style={{ marginBottom: 12 }}>
          Total: ${order.totalAmount?.toLocaleString()}
        </Text>
        <Text variant="bodySmall" style={{ marginBottom: 12 }}>
          Status: {order.status}
        </Text>

        {/* Timeline stepper */}
        <View style={styles.timelineContainer}>
          {steps.map((step, index) => {
            const active = index <= currentIndex;
            return (
              <View key={step.key} style={styles.stepWrapper}>
                {/* Circle */}
                <View style={[styles.circle, active && styles.activeCircle]} />
                <Text style={[styles.stepLabel, active && styles.activeStepText]}>{step.label}</Text>

                {/* Line */}
                {index < steps.length - 1 && <View style={[styles.line, active && styles.activeLine]} />}
              </View>
            );
          })}
        </View>
      </Card.Content>

      {showActions && (
        <Card.Actions>
          {currentIndex < steps.length - 1 ? (
            <Button
              mode="contained"
              loading={loading}
              onPress={() => onUpdateStatus?.(order.id, order.status)}
              disabled={loading}
            >
              Next: {steps[currentIndex + 1].label}
            </Button>
          ) : (
            <Text style={styles.deliveredText}>Delivered ✅</Text>
          )}
        </Card.Actions>
      )}
    </Card>
  );
}

const CIRCLE_SIZE = 16;

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  customer: {
    marginBottom: 4,
    color: "#555",
  },
  timelineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    justifyContent: "space-between",
  },
  stepWrapper: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#ccc",
    marginBottom: 4,
  },
  activeCircle: {
    backgroundColor: "#007AFF",
  },
  stepLabel: {
    fontSize: 10,
    color: "#aaa",
    textAlign: "center",
  },
  activeStepText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  line: {
    position: "absolute",
    top: CIRCLE_SIZE / 2 - 1,
    left: "50%",
    width: "100%",
    height: 2,
    backgroundColor: "#ccc",
    zIndex: -1,
  },
  activeLine: {
    backgroundColor: "#007AFF",
  },
  deliveredText: {
    color: "green",
    fontWeight: "600",
    marginLeft: 8,
  },
});
