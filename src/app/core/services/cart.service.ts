import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
}

export interface Cart {
  status: boolean;
  message: string;
  data: CartItem[];
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = environment.apiUrl;
  private cartSubject = new BehaviorSubject<Cart | null>(null);

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  getCurrentCart(): Observable<Cart | null> {
    return this.http
      .get<Cart>(`${this.apiUrl}/api/Cart/get-all-from-cart`)
      .pipe(tap((cart) => this.cartSubject.next(cart)));
  }

  addToCart(productId: string, quantity: number): Observable<Cart> {
    return this.http
      .post<Cart>(`${this.apiUrl}/api/Cart/add-to-cart`, {
        productId,
        quantity,
      })
      .pipe(
        tap((updatedCart) => {
          this.cartSubject.next(updatedCart);
          this.showSnackbar();
        })
      );
  }

  updateQuantity(CartId: string, quantity: number): Observable<Cart> {
    return this.http
      .put<Cart>(`${this.apiUrl}/api/Cart/update-cart`, { CartId, quantity })
      .pipe(
        tap((updatedCart) => {
          this.cartSubject.next(updatedCart);
          this.showSnackbar();
        })
      );
  }

  removeFromCart(CartId: string): Observable<Cart> {
    return this.http
      .delete<Cart>(`${this.apiUrl}/api/Cart/remove-from-cart?id=${CartId}`)
      .pipe(tap((updatedCart) => this.cartSubject.next(updatedCart)));
  }

  clearCart(): Observable<Cart> {
    return this.http
      .post<Cart>(`${this.apiUrl}/api/Cart/clear`, {})
      .pipe(tap((emptyCart) => this.cartSubject.next(emptyCart)));
  }

  showSnackbar(): void {
    const snackBarRef = this.snackBar.open('Cart updated', 'View Cart', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });

    snackBarRef.onAction().subscribe(() => {
      this.router.navigate(['/cart']);
    });
  }
}
