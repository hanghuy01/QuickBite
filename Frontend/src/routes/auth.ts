import { route } from "@/routes/routes";

export const AUTH = {
  ROOT: route("/(auth)"),
  LOGIN: route("/(auth)/login"),
  REGISTER: route("/(auth)/register"),
} as const;
