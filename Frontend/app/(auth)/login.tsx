import React from "react";
import { StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm, loginSchema } from "@/schemas/auth";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/routes";
import AuthBackground from "@/components/AuthBackground";

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
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <AuthBackground>
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
      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        style={styles.loginBtn}
        contentStyle={{ paddingVertical: 6 }}
      >
        Đăng nhập
      </Button>

      <Button mode="text" onPress={() => router.push(ROUTES.AUTH.REGISTER)} textColor="#FF5722">
        Chưa có tài khoản? Đăng ký
      </Button>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 5,
  },
  loginBtn: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: "#FF5722",
  },
});
