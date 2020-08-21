import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private token: string;
  private userId: string;
  private authStatusSubject$ = new BehaviorSubject(undefined);
  private tokenTimer: any;

  isLoggedIn$: Observable<boolean> = this.authStatusSubject$.pipe(
    map((token) => !!token)
  );
  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.pipe(
    map((isLoggedIn) => !isLoggedIn)
  );

  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };

    this.http
      .post<{ message: string; authdata: AuthData }>(
        "/api/users/signup",
        authData
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };

    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        "/api/users/login",
        authData
      )
      .subscribe((response) => {
        const expiresInDuration = response.expiresIn;
        const token = response.token;
        const userId = response.userId;

        this.setAuthTimer(expiresInDuration);

        this.token = token;
        this.userId = userId;

        this.authStatusSubject$.next(token);

        const now = new Date();
        const expirationDate = new Date(
          now.getTime() + expiresInDuration * 1000
        );
        this.saveAuthData(token, expirationDate, userId);

        this.router.navigate(["/"]);
      });
  }

  logout() {
    this.authStatusSubject$.next(undefined);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  getToken() {
    return this.token;
  }

  getUserid() {
    return this.userId;
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();

    if (!authInfo) {
      return;
    }

    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusSubject$.next(this.token);
    }
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const expirationDate = localStorage.getItem("expiration");

    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      userId: userId,
      expirationDate: new Date(expirationDate),
    };
  }
}
