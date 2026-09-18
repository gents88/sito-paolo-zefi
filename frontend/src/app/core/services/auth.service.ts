import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

interface ProfileResponse {
  id: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  private userKey = 'user';

  // Signals for modern reactive state
  private token = signal<string | null>(null);
  private user = signal<any>(null);
  public isAuthenticatedSignal = computed(() => !!this.token());

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    try {
      const token = localStorage.getItem(this.tokenKey);
      const userStr = localStorage.getItem(this.userKey);
      if (token) this.token.set(token);
      if (userStr) this.user.set(JSON.parse(userStr));
    } catch (e) {
      // ignore
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.setToken(response.access_token);
        this.setUser(response.user);
      })
    );
  }

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/profile`);
  }

  logout(): void {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    } catch (e) {}
    this.token.set(null);
    this.user.set(null);
  }

  getToken(): string | null {
    return this.token();
  }

  setToken(token: string): void {
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch (e) {}
    this.token.set(token);
  }

  getUser(): any {
    return this.user();
  }

  setUser(user: any): void {
    try {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } catch (e) {}
    this.user.set(user);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const u = this.getUser();
    if (!u || !u.role) return false;
    return String(u.role).toLowerCase() === String(role).toLowerCase();
  }
}
