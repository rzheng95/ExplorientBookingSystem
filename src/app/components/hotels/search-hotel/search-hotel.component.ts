import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { HotelsService } from '../../../services/hotels/hotels.service';
import { Hotel } from '../../../models/hotel.model';
import { VendorsService } from '../../../services/vendors/vendors.service';
import { Vendor } from '../../../models/vendor.model';

@Component({
  selector: 'app-search-hotel',
  templateUrl: './search-hotel.component.html',
  styleUrls: ['./search-hotel.component.css']
})
export class SearchHotelComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;

  hotels: Hotel[];
  filteredHotels: Hotel[];
  hotelsSub: Subscription;

  constructor(
    private hotelsService: HotelsService,
    private vendorsService: VendorsService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      hotelName: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.hotelsSub = this.hotelsService.getHotels().subscribe(hotels => {
      this.hotels = hotels;

      this.hotels.forEach((hotel, index) => {
        this.vendorsService.getVendorById(hotel.vid).subscribe(vendor => {
          if (vendor) {
            const v = vendor as Vendor;
            hotel.vid = v.vendorName;
          }
        });

      });
    });
  }

  filterHotels() {
    this.isLoading = true;

    this.filteredHotels = this.hotels.filter(option =>
      option.hotelName
        .toLowerCase()
        .includes(this.form.value.hotelName.trim().toLowerCase())
    );

    this.isLoading = false;
  }

  onClearForm() {
    this.form.reset();
  }

  ngOnDestroy() {
    this.hotelsSub.unsubscribe();
  }
}
