import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../shared/classes/user";
import { AuthenticationService } from "../shared/services/authentication.service";
import { HistoryService } from "../shared/services/history.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

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

  public registerUser(): void {
    this.formError = "";
    if (
      !this.credentials.name ||
      !this.credentials.email ||
      !this.credentials.password
    ) this.formError = "Najprej izpolni VSA polja!";
    else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.credentials.email)
    ) this.formError = "Vnesi veljaven email!";
    else if (this.credentials.password.length < 5)
      this.formError = "Geslo mora biti dolgo vsaj 5 znakov!";
    else {
      this.doRegister();
    }
  }
  
  private doRegister(): void {
    this.authenticationService
      .register(this.credentials)
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
