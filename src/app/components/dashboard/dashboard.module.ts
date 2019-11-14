import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { MainNavComponent } from '../main-nav/main-nav.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { BookingsComponent } from '../bookings/bookings.component';
import { CreateBookingComponent } from '../bookings/create-booking/create-booking.component';
import { SearchBookingComponent } from '../bookings/search-booking/search-booking.component';



@NgModule({
  declarations: [
    CreateBookingComponent,
    MainNavComponent,
    DashboardComponent,
    BookingsComponent,
    SearchBookingComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {}