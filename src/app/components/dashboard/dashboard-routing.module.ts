import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { BookingsComponent } from '../bookings/bookings.component';
import { CreateBookingComponent } from '../bookings/create-booking/create-booking.component';
import { AuthGuard } from 'src/app/guards/auth/auth.guard';
import { SearchBookingComponent } from '../bookings/search-booking/search-booking.component';



const routes: Routes = [

  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'bookings', component: BookingsComponent, canActivate: [AuthGuard] },
  { path: 'search-booking', component: SearchBookingComponent, canActivate: [AuthGuard] },
  { path: 'create-booking', component: CreateBookingComponent, canActivate: [AuthGuard] },
  { path: 'edit-booking/:bookingId', component: CreateBookingComponent, canActivate: [AuthGuard] }



];

@NgModule({
  imports: [
    // registering child routes which will be merged with the root router eventually
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
