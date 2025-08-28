import React from "react";
import { StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterForm, registerSchema } from "@/schemas/auth";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/routes";
import AuthBackground from "@/components/AuthBackground";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await register(data);
      router.push(ROUTES.AUTH.LOGIN);
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <AuthBackground>
      {/* Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Họ và tên"
            value={value}
            onChangeText={onChange}
            error={!!errors.name}
            style={styles.input}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

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
        style={styles.btn}
        contentStyle={{ paddingVertical: 6 }}
      >
        Đăng ký
      </Button>

      <Button mode="text" onPress={() => router.push(ROUTES.AUTH.LOGIN)} textColor="#FF5722">
        Đã có tài khoản? Đăng nhập
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
  btn: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: "#FF5722",
  },
});
