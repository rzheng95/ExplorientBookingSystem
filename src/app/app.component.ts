import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private isAuthenticated = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  // Logout user when mouse inactive (including going over to different browser tab)
  @HostListener('window:mousemove') refreshUserState() {
    if (this.isAuthenticated) {
      this.authService.clearTimeout();
      this.authService.setTimeout(environment.sessionExpiration); // seconds
    }
  }

  // Logout user when browser closed
  @HostListener('window:beforeunload') logoutOnBroswerClose() {
    this.authService.SignOut();
  }
}
