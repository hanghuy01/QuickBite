import { useEffect } from "react";
import { Href, useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/routes";

interface UseProtectedRouteOptions {
  allowedRoles?: string[]; // nếu không truyền → chỉ check đăng nhập
  redirectTo?: Href; // nếu không hợp lệ → redirect đến đây
}

export const useProtectedRoute = ({ allowedRoles, redirectTo }: UseProtectedRouteOptions = {}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(redirectTo ?? ROUTES.AUTH.LOGIN);
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(redirectTo ?? ROUTES.USER.ROOT);
    }
  }, [loading, user, allowedRoles, redirectTo, router]);

  return { loading };
};
