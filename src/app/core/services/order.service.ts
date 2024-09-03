import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: number;
  customerId: number;
  items: OrderItem[];
  total: number;
  deliveryAddress: string;
  orderDate: string;
  status: string;
}

export interface CreateOrderRequest {
  cartIds: string[];
  amount: number;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createOrder(orderRequest: CreateOrderRequest): Observable<Order> {
    const url = `${this.apiUrl}/api/Order/create-order`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: '*/*',
    });

    return this.http.post<Order>(url, orderRequest, { headers });
  }

  getOrder(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/api/Order/${orderId}`);
  }

  getCustomerOrders(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.apiUrl}/api/Order/customer/${customerId}`
    );
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/api/Order/${orderId}`, {
      status,
    });
  }

  cancelOrder(orderId: number): Observable<Order> {
    return this.http.patch<Order>(
      `${this.apiUrl}/api/Order/${orderId}/cancel`,
      {}
    );
  }

  sendOrderConfirmation(orderId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/Order/${orderId}/send-confirmation`,
      {}
    );
  }
}
