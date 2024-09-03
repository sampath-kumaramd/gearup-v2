import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  Cart,
  CartItem,
  CartService,
} from 'src/app/core/services/cart.service';
import { Product, ProductService } from 'src/app/core/services/product.service';

interface CartItemWithDetails extends CartItem {
  product: Product | null;
  isProductLoading: boolean;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartItems: CartItemWithDetails[] = [];
  isCartLoading = false;

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isCartLoading = true;
    this.cartService
      .getCurrentCart()
      .pipe(finalize(() => (this.isCartLoading = false)))
      .subscribe((cart) => {
        if (cart && cart.data) {
          this.cartItems = cart.data.map((item) => ({
            ...item,
            product: null,
            isProductLoading: true,
          }));
          this.loadProductDetails();
        }
      });
  }

  loadProductDetails(): void {
    this.cartItems.forEach((item, index) => {
      this.productService
        .getProduct(item.productId)
        .pipe(finalize(() => (this.cartItems[index].isProductLoading = false)))
        .subscribe(
          (product) => {
            this.cartItems[index].product = product;
          },
          (error) => {
            console.error(`Error loading product ${item.productId}:`, error);
            // You might want to set some error state here
          }
        );
    });
  }

  incrementQuantity(item: CartItemWithDetails): void {
    this.updateQuantity(item, item.quantity + 1);
  }

  decrementQuantity(item: CartItemWithDetails): void {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    } else {
      this.removeItem(item.id);
    }
  }

  updateQuantity(item: CartItemWithDetails, newQuantity: number): void {
    item.isProductLoading = true;
    this.cartService
      .updateQuantity(item.id, newQuantity)
      .pipe(finalize(() => (item.isProductLoading = false)))
      .subscribe(
        () => {
          item.quantity = newQuantity;
          console.log('Quantity updated successfully');
        },
        (error) => {
          console.error('Error updating quantity', error);
        }
      );
  }

  removeItem(cartId: string): void {
    const itemIndex = this.cartItems.findIndex((item) => item.id === cartId);
    if (itemIndex !== -1) {
      this.cartItems[itemIndex].isProductLoading = true;
    }
    this.cartService
      .removeFromCart(cartId)
      .pipe(
        finalize(() => {
          if (itemIndex !== -1) {
            this.cartItems[itemIndex].isProductLoading = false;
          }
        })
      )
      .subscribe(
        () => {
          this.cartItems = this.cartItems.filter((item) => item.id !== cartId);
          console.log('Item removed successfully');
        },
        (error) => {
          console.error('Error removing item', error);
        }
      );
  }

  clearCart(): void {
    this.isCartLoading = true;
    this.cartService
      .clearCart()
      .pipe(finalize(() => (this.isCartLoading = false)))
      .subscribe(
        () => {
          this.cartItems = [];
          console.log('Cart cleared successfully');
        },
        (error) => {
          console.error('Error clearing cart', error);
        }
      );
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + (item.product?.amount || 0) * item.quantity,
      0
    );
  }
}
