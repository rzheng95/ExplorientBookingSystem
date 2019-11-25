import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Booking } from '../../../models/booking.model';
import { BookingsService } from '../../../services/bookings/bookings.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css']
})
export class CreateBookingComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading = false;
  booking: Booking;
  bookingSub: Subscription;
  mode = 'create';
  private bookingId: string;

  constructor(private bookingsService: BookingsService, public route: ActivatedRoute) {}

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

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('bookingId')) {
        this.mode = 'edit';
        this.bookingId = paramMap.get('bookingId');
        // get booking
        this.bookingSub = this.bookingsService.getBookingById(this.bookingId).subscribe(booking  => {
          this.booking = booking as Booking;
          // populate UI
          this.form.setValue({
            contactName: this.booking.contactName,
            package: this.booking.package,
            addressLine1: this.booking.addressLine1,
            addressLine2: this.booking.addressLine2,
            city: this.booking.city,
            state: this.booking.state,
            country: this.booking.country,
            zipcode: this.booking.zipcode,
            phone1: this.booking.phone1,
            phone2: this.booking.phone2,
            fax: this.booking.fax,
            email1: this.booking.email1,
            email2: this.booking.email2,
            notes: this.booking.notes,
          });
        });
      } else {
        this.mode = 'create';
        this.bookingId = null;
      }
    });
  }

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }

  onSaveBooking() {
    this.isLoading = true;
    if (this.form.invalid) {
      this.bookingsService.showDialogMessage('Invalid Form', 'All * fields are required.');
      this.isLoading = false;
      return;
    }

    const newBooking: Booking = {
      contactName: this.form.value.contactName.trim(),
      package: this.form.value.package.trim(),
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

    if (this.mode === 'create') { // CREATE mode
      this.bookingsService.createBooking(newBooking);
      this.bookingsService.showDialogMessage('Success!', `Booking created for ${this.form.value.contactName}`);
      this.form.reset();
    } else { // EDIT mode
      this.bookingsService.updateBooking(this.bookingId, newBooking)
      .catch(error => console.log(error));
      this.bookingsService.showDialogMessage('Success!', `Booking updated for ${this.form.value.contactName}`);
    }
    this.isLoading = false;
  }

  onClearForm() {
    this.form.reset();
  }
}
