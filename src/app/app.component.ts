import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

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

  @HostListener('window:mousemove') refreshUserState() {
    if (this.isAuthenticated) {
      console.log('here');
      this.authService.clearTimeout();
      this.authService.setTimeout();
    }
  }
}
