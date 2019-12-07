import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VendorsService } from '../../services/vendors/vendors.service';
import { Vendor } from '../../models/vendor.model';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {
  isLoading = false;
  mode = 'create';
  form: FormGroup;
  constructor(private vendorsService: VendorsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      vendorName: new FormControl(null, {
        validators: [Validators.required]
      }),
      contactPerson: new FormControl(null),
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

  onSaveVendor() {
    this.isLoading = true;
    if (this.form.invalid) {
      this.vendorsService.showDialogMessage('Invalid Form', 'All * fields are required.');
      this.isLoading = false;
      return;
    }

    const newVendor: Vendor = {
      vendorName: this.form.value.vendorName.trim(),
      contactPerson: this.form.value.contactPerson,
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
      this.vendorsService.createVendor(newVendor);
      this.vendorsService.showDialogMessage('Success!', `Vendor created for ${this.form.value.vendorName}`);
      this.form.reset();
    } else { // EDIT mode
      // this.vendorsService.updateHotel(this.bookingId, newBooking)
      // .catch(error => console.log(error));
      // this.vendorsService.showDialogMessage('Success!', `Booking updated for ${this.form.value.contactName}`);
    }
    this.isLoading = false;
  }

  onClearForm() {
    this.form.reset();
  }
}
