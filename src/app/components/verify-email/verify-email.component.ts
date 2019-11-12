import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  email: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.email = this.authService.getUserData().email;
  }

  onResend() {
    this.authService.SendVerificationMail();
  }
}
