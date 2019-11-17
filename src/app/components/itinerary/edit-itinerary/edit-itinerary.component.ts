import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-edit-itinerary',
  templateUrl: './edit-itinerary.component.html',
  styleUrls: ['./edit-itinerary.component.css']
})
export class EditItineraryComponent implements OnInit {
  form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      services: new FormArray([
        this.serviceFormGroup()
      ])
    });
  }

  onSaveItinerary() {

  }

  get services() {
    return this.form.get('services') as FormArray;
  }

  onClickAddService() {
    this.services.push(this.serviceFormGroup());
  }

  serviceFormGroup() {
    return new FormGroup({
      datePicker: new FormControl(null),
      serviceCaption: new FormControl(null),
      destination: new FormControl(null),
      activity: new FormControl(null)
    });
  }


  onSubmit() {
    console.log('here');
    // console.log(this.form.get(['services']).value);
  }
}
