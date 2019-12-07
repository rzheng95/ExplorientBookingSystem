import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { BookingsComponent } from '../bookings/bookings.component';
import { CreateBookingComponent } from '../bookings/create-booking/create-booking.component';
import { AuthGuard } from 'src/app/guards/auth/auth.guard';
import { SearchBookingComponent } from '../bookings/search-booking/search-booking.component';
import { SearchPassengerComponent } from '../passengers/search-passenger/search-passenger.component';
import { AddPassengerComponent } from '../passengers/add-passenger/add-passenger.component';
import { EditItineraryComponent } from '../itinerary/edit-itinerary/edit-itinerary.component';
import { HotelsComponent } from '../hotels/hotels.component';



const routes: Routes = [

  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'bookings', component: BookingsComponent, canActivate: [AuthGuard] },
  { path: 'search-booking', component: SearchBookingComponent, canActivate: [AuthGuard] },
  { path: 'create-booking', component: CreateBookingComponent, canActivate: [AuthGuard] },
  { path: 'edit-booking/:bookingId', component: CreateBookingComponent, canActivate: [AuthGuard] },
  { path: 'search-passenger', component: SearchPassengerComponent, canActivate: [AuthGuard] },
  { path: 'add-passenger/:bookingId', component: AddPassengerComponent, canActivate: [AuthGuard] },
  { path: 'edit-itinerary/:bookingId', component: EditItineraryComponent, canActivate: [AuthGuard] },
  { path: 'create-hotel', component: HotelsComponent, canActivate: [AuthGuard] }


];

@NgModule({
  imports: [
    // registering child routes which will be merged with the root router eventually
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
