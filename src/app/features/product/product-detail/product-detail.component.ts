import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { Product, ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loading = true;
      this.error = null;
      this.productService.getProduct(productId).subscribe(
        (product) => {
          this.product = product;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching product details', error);
          this.error =
            'Failed to load product details. Please try again later.';
          this.loading = false;
        }
      );
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product.id, 1).subscribe(
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
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
