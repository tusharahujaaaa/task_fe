import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {
      if(this.hasToken()) {
          this.loadUser();
      }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((res: any) => this.setSession(res.token, res.user))
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => this.setSession(res.token, res.user))
    );
  }

  private loadUser() {
      // In a real app we might fetch user details, for now we just trust token presence
      // or fetch from /me if we want to ensure token is valid
      this.http.get(`${this.apiUrl}/me`).subscribe({
          next: (user) => this.currentUserSubject.next(user),
          error: () => this.logout() // invalid token
      });
  }

  private setSession(token: string, user: any) {
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(user);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
