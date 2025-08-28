import { MenuItem } from "./menu";

export type Restaurant = {
  id: number;
  name: string;
  address: string;
  category: string;
  description?: string;
  image?: string;
  distance?: { distanceKm: number; durationMin: number };
  lat?: number;
  lon?: number;
  location?: { latitude?: number; longitude?: number };
  menuItems?: MenuItem[];
};
