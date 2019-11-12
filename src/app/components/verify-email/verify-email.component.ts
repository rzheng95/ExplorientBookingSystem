import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  form: FormGroup;
  error: null;
  email: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.email = this.authService.getUserData().email;
  }

  onResend() {
    this.authService.SendVerificationMail();
  }
}
