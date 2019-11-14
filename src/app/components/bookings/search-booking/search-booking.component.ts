import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BookingsService } from 'src/app/services/bookings/bookings.service';

@Component({
  selector: 'app-search-booking',
  templateUrl: './search-booking.component.html',
  styleUrls: ['./search-booking.component.css']
})
export class SearchBookingComponent implements OnInit {
  form: FormGroup;
  isLoading = false;

  constructor(private bookingsService: BookingsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      contactName: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onSearchBooking() {
    this.isLoading = true;
    if (this.form.invalid) {
      this.isLoading = false;
      this.bookingsService.showDialogMessage('Invalid Form', 'All * fields are required.');
      return;
    }

    this.bookingsService.getBookingByContactName(this.form.value.contactName).subscribe(booking => {
      console.log(booking);
    })

    this.isLoading = false;
  }

  onClearForm() {
    this.form.reset();
  }

}
