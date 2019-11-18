import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SearchBookingComponent } from '../../bookings/search-booking/search-booking.component';
import { Passenger } from '../../../models/passenger.model';
import { PassengersService } from '../../../services/passengers/passengers.service';

@Component({
  selector: 'app-add-passenger',
  templateUrl: './add-passenger.component.html',
  styleUrls: ['./add-passenger.component.css']
})
export class AddPassengerComponent {
  mode = 'Add';
  constructor(
    public dialogRef: MatDialogRef<SearchBookingComponent>,
    private passengersService: PassengersService,
    @Inject(MAT_DIALOG_DATA) public data: Passenger
  ) {
    if (data.passengerName === '') {
      this.mode = 'Add';
    } else {
      this.mode = 'Edit';
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onAddClick() {
    this.passengersService
      .addPassenger(this.data)
      .then(() => console.log('Passenger added.'))
      .catch(() => window.alert('Passenger could not be added!'));
    this.dialogRef.close();
  }

  onSaveClick() {
    // update passengerName only
    this.passengersService
      .updatePassenger(this.data.id, {
        passengerName: this.data.passengerName
      })
      .then(() => console.log('Passenger saved.'))
      .catch(() => window.alert('Passenger could not be saved!'));
    this.dialogRef.close();
  }

  onDeleteClick() {
    this.passengersService.deletePassenger(this.data.id);
    this.dialogRef.close();
  }
}
