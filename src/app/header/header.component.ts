import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  isLoggedin$: Observable<boolean>;
  isLoggedout$: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedin$ = this.authService.isLoggedIn$;
    this.isLoggedout$ = this.authService.isLoggedOut$;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }
}
