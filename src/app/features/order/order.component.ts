import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CartService, Cart, CartItem } from '../../core/services/cart.service';
import {
  OrderService,
  CreateOrderRequest,
} from '../../core/services/order.service';
import { ProductService, Product } from '../../core/services/product.service';

interface CartItemWithProduct extends CartItem {
  product?: Product;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  cart: Cart | null = null;
  cartItemsWithProducts: CartItemWithProduct[] = [];
  orderForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.orderForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      region: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      phone: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCurrentCart().subscribe(
      (cart) => {
        this.cart = cart;
        if (!cart || cart.data.length === 0) {
          this.router.navigate(['/cart']);
        } else {
          this.fetchProductDetails(cart.data);
        }
      },
      (error) => {
        console.error('Error loading cart', error);
        this.error = 'Failed to load cart. Please try again.';
        this.loading = false;
      }
    );
  }

  fetchProductDetails(cartItems: CartItem[]): void {
    const productRequests = cartItems.map((item) =>
      this.productService.getProduct(item.productId)
    );

    forkJoin(productRequests).subscribe(
      (products) => {
        this.cartItemsWithProducts = cartItems.map((item, index) => ({
          ...item,
          product: products[index],
        }));
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching product details', error);
        this.error = 'Failed to load product details. Please try again.';
        this.loading = false;
      }
    );
  }

  placeOrder(): void {
    if (this.orderForm.valid && this.cart) {
      this.loading = true;
      this.error = null;

      const orderRequest: CreateOrderRequest = {
        cartIds: this.cart.data.map((item) => item.id),
        amount: this.calculateTotalAmount(),
        address: this.orderForm.value.address,
        city: this.orderForm.value.city,
        region: this.orderForm.value.region,
        postalCode: this.orderForm.value.postalCode,
        country: this.orderForm.value.country,
        phone: this.orderForm.value.phone,
      };

      this.orderService.createOrder(orderRequest).subscribe(
        (order) => {
          console.log('Order placed successfully', order);
          this.orderService.sendOrderConfirmation(order.orderId).subscribe(
            () => console.log('Order confirmation email sent'),
            (error) =>
              console.error('Error sending order confirmation email', error)
          );
          this.router.navigate(['/order-confirmation', order.orderId]);
        },
        (error) => {
          console.error('Error placing order', error);
          this.error = 'Failed to place order. Please try again.';
          this.loading = false;
        }
      );
    }
  }

  public calculateTotalAmount(): number {
    return this.cartItemsWithProducts.reduce(
      (total, item) => total + (item.product?.amount || 0) * item.quantity,
      0
    );
  }
}
