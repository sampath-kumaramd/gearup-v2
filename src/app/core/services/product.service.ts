import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';

export interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  amount: number;
  image_url: string; // Add this line
}

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  token: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ApiResponse<Product[]>>(
        `${this.apiUrl}/api/Product/get-all-products`
      )
      .pipe(map((response) => response.data));
  }

  getProduct(id: string): Observable<Product> {
    return this.http
      .get<ApiResponse<Product>>(
        `${this.apiUrl}/api/Product/get-product-by-id?productId=${id}`
      )
      .pipe(map((response) => response.data));
  }
}
