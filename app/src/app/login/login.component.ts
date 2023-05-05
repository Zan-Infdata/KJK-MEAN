import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../shared/classes/user";
import { AuthenticationService } from "../shared/services/authentication.service";
import { HistoryService } from "../shared/services/history.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private historyService: HistoryService
  ) { }

  protected formError!: string;
  protected credentials: User = {
    name: "",
    email: "",
    password: "",
  };

  ngOnInit(): void {

  }

  public loginUser(): void {
    this.formError = "";
    if (!this.credentials.name || !this.credentials.password) this.formError = "Najprej izpolni VSA polja!";
    else if (this.credentials.password.length < 5)
      this.formError = "Geslo je dolgo vsaj 5 znakov!";
    else this.doLogin();
  }
  
  private doLogin(): void {
    this.authenticationService
      .login(this.credentials)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.formError = error.toString();
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.router.navigateByUrl(this.historyService.getLastNonLoginUrl());
      });
  }
}
