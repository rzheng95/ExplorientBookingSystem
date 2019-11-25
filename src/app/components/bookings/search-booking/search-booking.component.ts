import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BookingsService } from '../../../services/bookings/bookings.service';
import { Booking } from '../../../models/booking.model';
import { AddPassengerComponent } from '../../passengers/add-passenger/add-passenger.component';
import { PassengersService } from '../../../services/passengers/passengers.service';
import { Passenger } from '../../../models/passenger.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-booking',
  templateUrl: './search-booking.component.html',
  styleUrls: ['./search-booking.component.css']
})
export class SearchBookingComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading = false;

  bookings: Booking[] = [];
  bookingsSub: Subscription;
  storedBookings: Booking[] = [];

  passengers: Passenger[] = [];
  passengersSub: Subscription;

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

  ngOnDestroy() {
    if (this.bookingsSub) {
      this.bookingsSub.unsubscribe();
    }
    if (this.passengersSub) {
      this.passengersSub.unsubscribe();
    }
  }

  filterBookings() {
    this.isLoading = true;
    if (this.storedBookings && this.storedBookings.length > 0) {
      this.bookings = this.performFilter(this.form.value.contactName);
    } else {
      this.bookingsSub = this.bookingsService
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
    this.passengersSub = this.passengersService.getPassengersByBid(bookingId).subscribe((passengers: Passenger[]) => {
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
