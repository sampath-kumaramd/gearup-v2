export interface CartItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface Cart {
  cartId: string;
  customerId: number;
  items: CartItem[];
  total: number;
}
