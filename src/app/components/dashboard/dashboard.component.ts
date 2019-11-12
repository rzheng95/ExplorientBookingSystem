import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getUserData();
  }

  onLogout() {
    this.authService.SignOut();
  }

}
