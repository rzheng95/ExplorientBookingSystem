import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BookingsService } from '../../../services/bookings/bookings.service';
import { Booking } from '../../../models/booking.model';
import { AddPassengerComponent } from '../../passengers/add-passenger/add-passenger.component';
import { PassengersService } from '../../../services/passengers/passengers.service';
import { Passenger } from '../../../models/passenger.model';

@Component({
  selector: 'app-search-booking',
  templateUrl: './search-booking.component.html',
  styleUrls: ['./search-booking.component.css']
})
export class SearchBookingComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  bookings: Booking[] = [];
  storedBookings: Booking[] = [];
  passengers: Passenger[] = [];

  constructor(
    private bookingsService: BookingsService,
    private passengersService: PassengersService,
    private addPassDialog: MatDialog
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      contactName: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  filterBookings() {
    this.isLoading = true;
    if (this.storedBookings && this.storedBookings.length > 0) {
      this.bookings = this.performFilter(this.form.value.contactName);
    } else {
      this.bookingsService
        .getBookingsOrderBy('contactName')
        .subscribe((bkgs: Booking[]) => {
          this.storedBookings = bkgs;
          this.bookings = this.performFilter(this.form.value.contactName);
        });
    }
    this.isLoading = false;
  }

  performFilter(input: string) {
    return this.storedBookings.filter(data => {
      return data.contactName
        .toLowerCase()
        .includes(input.trim().toLowerCase());
    });
  }

  onRefreshBookings() {
    this.bookingsService
      .getBookingsOrderBy('contactName')
      .subscribe((bkgs: Booking[]) => {
        this.storedBookings = bkgs;
        this.bookings = this.storedBookings;
      });
  }

  onClearForm() {
    this.form.reset();
  }

  onAddPassenger(bookingId: string) {
    const dialogRef = this.addPassDialog.open(AddPassengerComponent, {
      width: '400px',
      data: {
        bid: bookingId,
        passengerName: ''
      }
    });
  }

  onClickPanel(bookingId: string) {
    this.passengersService.getPassengersByBid(bookingId).subscribe((passengers: Passenger[]) => {
      this.passengers = passengers;
      this.passengers.sort((a, b) => a.passengerName.localeCompare(b.passengerName));
    });
  }

  onClickPassenger(passenger: Passenger) {
    const dialogRef = this.addPassDialog.open(AddPassengerComponent, {
      width: '400px',
      data: {
        id: passenger.id,
        bid: passenger.bid,
        passengerName: passenger.passengerName
      }
    });
  }
}
