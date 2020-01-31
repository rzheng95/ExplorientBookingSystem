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
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Vendor } from 'src/app/models/vendor.model';

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

  hotelId: string;
  hotelSub: Subscription;
  hotel: Hotel;
  hotelVendorName = '';

  constructor(
    private hotelsService: HotelsService,
    private vendorsService: VendorsService,
    public route: ActivatedRoute
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

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('hotelId')) {
        this.mode = 'edit';
        this.hotelId = paramMap.get('hotelId');

        // get hotel
        this.hotelSub = this.hotelsService
          .getHotelById(this.hotelId)
          .subscribe(hotel => {
            this.hotel = hotel as Hotel;

            // populate UI
            this.form.setValue({
              hotelName: this.hotel.hotelName,
              vendor: this.hotelVendorName,
              addressLine1: this.hotel.addressLine1,
              addressLine2: this.hotel.addressLine2,
              city: this.hotel.city,
              state: this.hotel.state,
              country: this.hotel.country,
              zipcode: this.hotel.zipcode,
              phone1: this.hotel.phone1,
              phone2: this.hotel.phone2,
              fax: this.hotel.fax,
              email1: this.hotel.email1,
              email2: this.hotel.email2,
              notes: this.hotel.notes
            });

            // get vendor name
            this.vendorsService
              .getVendorNameById(this.hotel.vid)
              .then(doc => {
                const vendor = doc.data() as Vendor;
                this.hotelVendorName = vendor.vendorName;
                this.form.patchValue({
                  vendor: this.hotelVendorName
                });
              })
              .catch(err => console.log(err));
          });
      } else {
        this.mode = 'create';
        this.hotelId = null;
      }
    });
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
      vid: this.getVendorIdByName(this.form.value.vendor.trim()),
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
      this.onClearForm();
    } else {
      // EDIT mode
      this.hotelsService.updateHotel(this.hotelId, newHotel)
      .catch(error => console.log(error));
      this.hotelsService.showDialogMessage('Success!', `Hotel updated for ${this.form.value.hotelName}`);
    }
    this.isLoading = false;
  }

  private getVendorIdByName(vendorName: string) {
    if (vendorName) {
      for (const v of this.vendors) {
        if (v.vendorName === vendorName) {
          return v.id;
        }
      }
    }
    return vendorName;
  }

  onClearForm() {
    this.form.setValue({
      hotelName: '',
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
