import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AngularMaterialModule } from './angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Fire
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

// Components
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ErrorComponent } from './error/error.component';

// Services
import { BookingsService } from './services/bookings/bookings.service';
import { AuthService } from './services/auth/auth.service';
import { PassengersService } from './services/passengers/passengers.service';
import { ServicesService } from './services/services/services.service';
import { MultiSelectDropdownComponent } from './components/test/multi-select-dropdown/multi-select-dropdown.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    ErrorComponent,
    MultiSelectDropdownComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(
      environment.firebase,
      'ExplorientBookingSystem'
    ),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    MultiSelectDropdownComponent,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    BookingsService,
    AuthService,
    PassengersService,
    ServicesService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}
