import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Booking } from '../../../models/booking.model';
import { BookingsService } from 'src/app/services/bookings/bookings.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css']
})
export class CreateBookingComponent implements OnInit {
  form: FormGroup;
  isLoading = false;

  constructor(private bookingsService: BookingsService) {}

  ngOnInit() {
    this.form = new FormGroup({
      contactName: new FormControl(null, {
        validators: [Validators.required]
      }),
      package: new FormControl(null, {
        validators: [Validators.required]
      }),
      addressLine1: new FormControl(null),
      addressLine2: new FormControl(null),
      city: new FormControl(null),
      state: new FormControl(null),
      country: new FormControl(null),
      zipcode: new FormControl(null),
      phone1: new FormControl(null),
      phone2: new FormControl(null),
      fax: new FormControl(null),
      email1: new FormControl(null),
      email2: new FormControl(null),
      notes: new FormControl(null)
    });

  }

  onCreateBooking() {
    this.isLoading = true;
    if (this.form.invalid) {
      this.bookingsService.showDialogMessage('Invalid Form', 'All * fields are required.');
      this.isLoading = false;
      return;
    }

    const booking: Booking = {
      contactName: this.form.value.contactName,
      package: this.form.value.package,
      addressLine1: this.form.value.addressLine1,
      addressLine2: this.form.value.addressLine2,
      city: this.form.value.city,
      state: this.form.value.state,
      country: this.form.value.country,
      zipcode: this.form.value.zipcode,
      phone1: this.form.value.phone1,
      phone2: this.form.value.phone2,
      fax: this.form.value.fax,
      email1: this.form.value.email1,
      email2: this.form.value.email2,
      notes: this.form.value.notes
    };

    this.bookingsService.createBooking(booking);

    this.bookingsService.showDialogMessage('Success!', `Booking created for ${this.form.value.contactName}`);

    this.form.reset();
    this.isLoading = false;
  }

  onClearForm() {
    this.form.reset();
  }
}
