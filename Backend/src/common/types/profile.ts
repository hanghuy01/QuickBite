export interface ProfileOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ProfileOrder {
  id: number;
  restaurant: string;
  status: string;
  createdAt: Date;
  items: ProfileOrderItem[];
}

export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  role: string;
}
