import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotelsService } from '../../services/hotels/hotels.service';
import { Hotel } from '../../models/hotel.model';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  isLoading = false;
  mode = 'create';
  form: FormGroup;
  constructor(private hotelsService: HotelsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      hotelName: new FormControl(null, {
        validators: [Validators.required]
      }),
      vendor: new FormControl(null, {
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

  onSaveHotel() {
    this.isLoading = true;
    if (this.form.invalid) {
      this.hotelsService.showDialogMessage('Invalid Form', 'All * fields are required.');
      this.isLoading = false;
      return;
    }

    const newHotel: Hotel = {
      hotelName: this.form.value.hotelName.trim(),
      vendor: this.form.value.vendor.trim(),
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
      this.hotelsService.createHotel(newHotel);
      this.hotelsService.showDialogMessage('Success!', `Hotel created for ${this.form.value.hotelName}`);
      this.form.reset();
    } else { // EDIT mode
      // this.hotelsService.updateHotel(this.bookingId, newBooking)
      // .catch(error => console.log(error));
      // this.hotelsService.showDialogMessage('Success!', `Booking updated for ${this.form.value.contactName}`);
    }
    this.isLoading = false;
  }

  onClearForm() {
    this.form.reset();
  }
}
