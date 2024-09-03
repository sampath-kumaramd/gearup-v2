import { Component, OnInit } from '@angular/core';
import {
  ProductService,
  Product,
} from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    this.productService.getProducts().subscribe(
      (products) => {
        this.products = products;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching products', error);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    );
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product.id, 1).subscribe(
      (updatedCart) => {
        console.log('Product added to cart', updatedCart);
        // Show success message or update cart count
        // You might want to use a toast notification service here
      },
      (error) => {
        console.error('Error adding product to cart', error);
        // Handle error (e.g., show error message to user)
        // You might want to use a toast notification service here
      }
    );
  }

  viewProductDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }
}
