import { z } from "zod";

export const createRestaurantSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: z.string().url("Invalid image URL").optional(),
  address: z.string().optional(),
  category: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
});

export type CreateRestaurantForm = z.infer<typeof createRestaurantSchema>;
