export interface Product {
  id: string;
  name: string;
  price: number;
  collection: 'giragon' | 'ksp' | 'museum';
  image: string;
  description: string;
  color: string;
  edition: string;
  materials: string[];
  shipping: string;
  isSealed?: boolean;
  releaseDate?: string;
  badge?: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Message {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  timestamp: string;
  suggestions?: string[];
}
