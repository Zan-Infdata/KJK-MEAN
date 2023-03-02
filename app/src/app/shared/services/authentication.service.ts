import { Inject, Injectable } from "@angular/core";
import { BROWSER_STORAGE } from "../classes/storage";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "../classes/user";
import { AuthResponse } from "../classes/auth-response";
import { KjkDataService } from "./kjk-data.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private dataService: KjkDataService
  ) {}
  public login(user: User): Observable<AuthResponse> {
    return this.dataService.login(user).pipe(
      tap((authResponse: AuthResponse) => {
        this.saveToken(authResponse.token);
      })
    );
  }
  public register(user: User): Observable<AuthResponse> {
    return this.dataService.register(user).pipe(
      tap((authResponse: AuthResponse) => {
        this.saveToken(authResponse.token);
      })
    );
  }
  public logout(): void {
    this.storage.removeItem("user-token");
  }
  public getToken(): string | null {
    return this.storage.getItem("user-token");
  }
  public saveToken(token: string): void {
    this.storage.setItem("user-token", token);
  }

  public isLoggedIn(): boolean {
    const token: string | null = this.getToken();
    if (token) {
      const payload = JSON.parse(window.atob(token.split(".")[1]));
      return payload.exp > Date.now() / 1000;
    } else return false;
  }

  public getCurrentUser(): User | null {
    let user!: User;
    if (this.isLoggedIn()) {
      let token: string | null = this.getToken();
      if (token) {
        let { _id, email, name } = JSON.parse(window.atob(token.split(".")[1]));
        user = { _id, email, name };
      }
    }
    return user;
  }
}