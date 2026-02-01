
export type Category = 'all' | 'burger' | 'pizza' | 'drinks' | 'shawarma' | 'kebab';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  rating: number;
  calories: number;
  spiciness: number; // 0-100
  sweetness: number; // 0-100
  protein: number; // g
  carbs: number; // g
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  status: 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  items: CartItem[] | string; // Updated to handle mock string data or real objects
  total: number;
  type: 'delivery' | 'pickup';
  timestamp?: Date;
  customer?: string;
  date?: string;
  payment?: string;
  confirmationCode?: string;
  deliveryInfo?: {
    phone: string;
    address?: string;
    mapLink?: string;
    location?: { lat: number, lng: number };
  };
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export type ViewState = 'home' | 'menu' | 'track' | 'about' | 'contact' | 'admin' | 'profile' | 'driver';