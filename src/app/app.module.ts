import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AngularMaterialModule } from './angular-material.module';


// Angular Fire
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

// Components
import { BookingsComponent } from './components/bookings/bookings.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { CreateBookingComponent } from './components/bookings/create-booking/create-booking.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';

// Services
import { BookingsService } from './services/bookings/bookings.service';
import { AuthService } from './services/auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    BookingsComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    MainNavComponent,
    CreateBookingComponent
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
    ReactiveFormsModule
  ],
  providers: [BookingsService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
