import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BookingsService } from '../../../services/bookings/bookings.service';
import { Booking } from '../../../models/booking.model';


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

  constructor(private bookingsService: BookingsService) {}

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
    return this.storedBookings.filter((data) => {
      return data.contactName.toLowerCase().includes(input.trim().toLowerCase());
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
}
