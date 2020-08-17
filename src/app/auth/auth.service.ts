import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}

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
}
