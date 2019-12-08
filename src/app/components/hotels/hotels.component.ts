import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { HotelsService } from '../../services/hotels/hotels.service';
import { Hotel } from '../../models/hotel.model';
import { VendorsService } from 'src/app/services/vendors/vendors.service';
import {
  switchMap,
  debounceTime,
  distinct,
  filter,
  startWith,
  map
} from 'rxjs/operators';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit, OnDestroy {
  isLoading = false;
  mode = 'create';
  form: FormGroup;
  vendors: { id: string; vendorName: string }[];
  vendorsSub: Subscription;
  filteredVendors: Observable<{ id: string; vendorName: string }[]>;

  constructor(
    private hotelsService: HotelsService,
    private vendorsService: VendorsService
  ) {}

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

    this.vendorsSub = this.vendorsService
      .getVendorNames()
      .subscribe(vendors => {
        this.vendors = vendors;
      });

    this.filteredVendors = this.form.get('vendor').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string) {
    if (this.vendors) {
      return this.vendors.filter(option =>
        option.vendorName.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  ngOnDestroy() {
    this.vendorsSub.unsubscribe();
  }

  onSaveHotel() {
    this.isLoading = true;
    if (this.form.invalid) {
      this.hotelsService.showDialogMessage(
        'Invalid Form',
        'All * fields are required.'
      );
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

    if (this.mode === 'create') {
      // CREATE mode
      this.hotelsService.createHotel(newHotel);
      this.hotelsService.showDialogMessage(
        'Success!',
        `Hotel created for ${this.form.value.hotelName}`
      );
      this.form.reset();
    } else {
      // EDIT mode
      // this.hotelsService.updateHotel(this.bookingId, newBooking)
      // .catch(error => console.log(error));
      // this.hotelsService.showDialogMessage('Success!', `Booking updated for ${this.form.value.contactName}`);
    }
    this.isLoading = false;
  }

  onClearForm() {
    this.form.setValue({
      hotelName: null,
      vendor: '',
      addressLine1: null,
      addressLine2: null,
      city: null,
      state: null,
      country: null,
      zipcode: null,
      phone1: null,
      phone2: null,
      fax: null,
      email1: null,
      email2: null,
      notes: null
    });
  }
}
