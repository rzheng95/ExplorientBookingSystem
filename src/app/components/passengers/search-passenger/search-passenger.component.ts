import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Passenger } from '../../../models/passenger.model';
import { Subscription } from 'rxjs';
import { PassengersService } from 'src/app/services/passengers/passengers.service';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { Booking } from 'src/app/models/booking.model';

@Component({
  selector: 'app-search-passenger',
  templateUrl: './search-passenger.component.html',
  styleUrls: ['./search-passenger.component.css']
})
export class SearchPassengerComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading = false;

  passengers: Passenger[];
  filteredPassengers: Passenger[];
  passengerssSub: Subscription;

  passBook: {passenger: Passenger, booking: Booking}[] = [];
  filteredPassBook: {passenger: Passenger, booking: Booking}[];
  passBookSub: Subscription;

  constructor(private passengersService: PassengersService, private bookingsService: BookingsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      passengerName: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.passengerssSub = this.passengersService.getPassengers().subscribe(passengers => {
      const pass: Passenger[] = passengers;

      pass.forEach((passenger, index) => {
        let temp: {passenger: Passenger, booking: Booking};

        this.passBookSub = this.bookingsService.getBookingById(passenger.bid).subscribe(booking => {

          temp = {
            passenger,
            booking: booking as Booking
          };

          this.passBook.push(temp);
        });
      });

    });
  }

  ngOnDestroy() {
    this.passengerssSub.unsubscribe();
    this.passBookSub.unsubscribe();
  }

  filterPassenger() {
    this.isLoading = true;

    this.filteredPassBook = this.passBook.filter(option =>
      option.passenger.passengerName
        .toLowerCase()
        .includes(this.form.value.passengerName.trim().toLowerCase())
    );

    this.isLoading = false;
  }

  onClearForm() {
    this.form.reset();
  }

}
