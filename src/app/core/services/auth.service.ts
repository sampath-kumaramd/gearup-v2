import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';

interface ApiResponse {
  status: boolean;
  message: string;
  data: any;
  token: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/api/User/loggin-user`, {
        email,
        password,
      })
      .pipe(
        map((response) => {
          if (response.status && response.token) {
            const user = { email, token: response.token };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
          return response;
        })
      );
  }

  register(user: {
    name: string;
    email: string;
    password: string;
  }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/api/User/register-user`,
      user
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue && !!this.currentUserValue.token;
  }

  getAuthorizationHeader(): HttpHeaders {
    const currentUser = this.currentUserValue;
    if (currentUser && currentUser.token) {
      return new HttpHeaders().set(
        'Authorization',
        `Bearer ${currentUser.token}`
      );
    }
    return new HttpHeaders();
  }
}
