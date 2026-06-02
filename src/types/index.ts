export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: { url: string };
}

export interface ProductImage {
  url: string;
  publicId?: string;
}

export interface Product {
  _id: string;
  name: string;
  sku?: string;
  description?: string;
  price: number;
  costPrice?: number;
  unit: string;
  stock: number;
  lowStockThreshold: number;
  images?: ProductImage[];
  category?: Category;
  tags?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive?: boolean;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  _id?: string;
}

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  _id: string;
  product: Product;
  quantity: number;
  type: 'in' | 'out' | 'adjustment';
  reason?: string;
  user?: User;
  createdAt: string;
}

export interface InventoryOverview {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
}
