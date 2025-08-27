import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES, RouteString } from "@/constants";

interface UseProtectedRouteOptions {
  allowedRoles?: string[]; // nếu không truyền → chỉ check đăng nhập
  redirectTo?: RouteString; // nếu không hợp lệ → redirect đến đây
}


// TODO: https://docs.expo.dev/router/advanced/authentication/
export const useProtectedRoute = ({ allowedRoles, redirectTo }: UseProtectedRouteOptions = {}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(redirectTo ?? ROUTES.AUTH.LOGIN);
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(redirectTo ?? ROUTES.TABS.ROOT);
    }
  }, [loading, user, allowedRoles, redirectTo, router]);

  return { loading };
};
