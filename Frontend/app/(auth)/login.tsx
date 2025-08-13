import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm, loginSchema } from "@/schemas/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);

      // Chuyển sang Home
      router.replace("/(tabs)");
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge">Đăng nhập</Text>

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!errors.email}
            style={styles.input}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Mật khẩu"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            error={!!errors.password}
            style={styles.input}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      {/* Submit */}
      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isSubmitting} style={{ marginTop: 20 }}>
        Đăng nhập
      </Button>

      <Button mode="text" onPress={() => router.push("/(auth)/register")}>
        Chưa có tài khoản? Đăng ký
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
  input: { marginBottom: 10 },
  error: { color: "red", marginBottom: 5 },
});
