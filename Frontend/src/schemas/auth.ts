import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
