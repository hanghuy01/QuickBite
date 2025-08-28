import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // retry tối đa 1 lần khi lỗi
      refetchOnWindowFocus: false, // không auto refetch khi đổi tab (tránh flicker)
      staleTime: 1000 * 60 * 5, // dữ liệu "fresh" trong 5 phút
    },
    mutations: {
      retry: 0, // mutation thường không cần retry
    },
  },
});
