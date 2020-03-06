import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { BookingsComponent } from '../bookings/bookings.component';
import { CreateBookingComponent } from '../bookings/create-booking/create-booking.component';
import { SearchBookingComponent } from '../bookings/search-booking/search-booking.component';
import { SearchPassengerComponent } from '../passengers/search-passenger/search-passenger.component';
import { AddPassengerComponent } from '../passengers/add-passenger/add-passenger.component';
import { EditItineraryComponent } from '../itinerary/edit-itinerary/edit-itinerary.component';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { HotelsComponent } from '../hotels/hotels.component';
import { VendorsComponent } from '../vendors/vendors.component';
import { SearchHotelComponent } from '../hotels/search-hotel/search-hotel.component';
import { SearchVendorComponent } from '../vendors/search-vendor/search-vendor.component';
import { ParentComponent } from '../test/parent/parent.component';
import { ChildComponent } from '../test/child/child.component';



@NgModule({
  declarations: [
    CreateBookingComponent,
    MainNavComponent,
    DashboardComponent,
    BookingsComponent,
    SearchBookingComponent,
    SearchPassengerComponent,
    AddPassengerComponent,
    EditItineraryComponent,
    HotelsComponent,
    SearchHotelComponent,
    VendorsComponent,
    SearchVendorComponent,
    ParentComponent,
    ChildComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {}
