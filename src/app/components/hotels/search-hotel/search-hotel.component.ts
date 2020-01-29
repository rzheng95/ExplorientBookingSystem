import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { HotelsService } from '../../../services/hotels/hotels.service';
import { debounceTime, distinct, filter, switchMap, tap } from 'rxjs/operators';
import { Hotel } from 'src/app/models/hotel.model';

@Component({
  selector: 'app-search-hotel',
  templateUrl: './search-hotel.component.html',
  styleUrls: ['./search-hotel.component.css']
})
export class SearchHotelComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;

  hotels: { id: string; hotelName: string }[];
  filteredHotels: { id: string; hotelName: string }[];
  hotelsSub: Subscription;

  constructor(private hotelsService: HotelsService) {}

  ngOnInit() {
    this.form = new FormGroup({
      hotelName: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.hotelsSub = this.hotelsService.getHotelNames().subscribe(hotels => {
      this.hotels = hotels;
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
