import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {
  isLoading = false;
  mode = 'create';
  form: FormGroup;
  constructor() { }

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

  onSaveVendor() {

  }

  onClearForm() {
    this.form.reset();
  }
}
