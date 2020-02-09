import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Passenger } from '../../../models/passenger.model';
import { Subscription } from 'rxjs';
import { PassengersService } from 'src/app/services/passengers/passengers.service';

@Component({
  selector: 'app-search-passenger',
  templateUrl: './search-passenger.component.html',
  styleUrls: ['./search-passenger.component.css']
})
export class SearchPassengerComponent implements OnInit {
  form: FormGroup;
  isLoading = false;

  passengers: Passenger[];
  filteredPassengers: Passenger[];
  passengerssSub: Subscription;

  constructor(private passengersService: PassengersService) { }

  ngOnInit() {
    this.form = new FormGroup({
      passengerName: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.passengerssSub = this.passengersService.getPassengers().subscribe(passengers => {
      this.passengers = passengers;
    });
  }

  filterPassenger() {
    this.isLoading = true;

    this.filteredPassengers = this.passengers.filter(option =>
      option.passengerName
        .toLowerCase()
        .includes(this.form.value.passengerName.trim().toLowerCase())
    );

    this.isLoading = false;
  }

  onClearForm() {
    this.form.reset();
  }

}
