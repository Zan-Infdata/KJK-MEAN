import { Component, OnInit } from '@angular/core';
import { Router,RoutesRecognized } from '@angular/router';
import { User } from "../shared/classes/user";
import { AuthenticationService } from "../shared/services/authentication.service";

@Component({
  selector: 'app-framework',
  templateUrl: './framework.component.html'
})
export class FrameworkComponent implements OnInit {

  currentRouteData = { title: '', subtitle: '' };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  public logout(): void {
    this.authenticationService.logout();
    this.router.navigateByUrl('/login');
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public getCurrentUser(): string {
    const user: User | null = this.authenticationService.getCurrentUser();
    return user ? user.name : "Guest";
  }

  ngOnInit(): void {
    this.router.events.subscribe((data) => {
      if (data instanceof RoutesRecognized) {
        this.currentRouteData.title = data?.state?.root?.firstChild?.data['title'] || '';
        this.currentRouteData.subtitle = data?.state?.root?.firstChild?.data['subtitle'] || '';
      }
    });
  }

  

}
