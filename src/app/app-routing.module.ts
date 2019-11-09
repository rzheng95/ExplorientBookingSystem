import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingsComponent } from './components/bookings/bookings.component';
import { AuthGuard } from './services/auth.guard';


const routes: Routes = [
  { path: 'booking', component: BookingsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
