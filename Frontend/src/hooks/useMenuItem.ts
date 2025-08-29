import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMenuItem, editMenuItem, deleteMenuItem } from "@/api/menuItem.api";
import { MenuItem } from "@/types/menu";

export function useMenuItemMutations(restaurantId: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["restaurant", restaurantId] });
  };

  const add = useMutation({
    mutationFn: addMenuItem,
    onSuccess: invalidate,
  });

  const edit = useMutation({
    mutationFn: (data: MenuItem) => editMenuItem(data.id, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteMenuItem(id),
    onSuccess: invalidate,
  });

  return { add, edit, remove };
}
