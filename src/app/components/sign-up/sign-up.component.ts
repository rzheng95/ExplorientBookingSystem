import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  form: FormGroup;
  error: null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
      displayName: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      })
    });
  }

  onSignup() {
    this.authService.SignUp(this.form.value.email, this.form.value.password);
  }

}
