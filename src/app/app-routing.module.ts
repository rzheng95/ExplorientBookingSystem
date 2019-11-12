import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingsComponent } from './components/bookings/bookings.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { SecureInnerPagesGuard } from './guards/secureInnerPages/secure-inner-pages.guard';
import { AuthGuard } from './guards/auth/auth.guard';
import { CreateBookingComponent } from './components/bookings/create-booking/create-booking.component';


const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full'},
  { path: 'sign-in', component: SignInComponent, canActivate: [SecureInnerPagesGuard]},
  { path: 'register-user', component: SignUpComponent, canActivate: [SecureInnerPagesGuard]},
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'booking', component: BookingsComponent, canActivate: [AuthGuard]},
  { path: 'create-booking', component: CreateBookingComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
