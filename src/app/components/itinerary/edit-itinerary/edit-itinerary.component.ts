import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
      contactName: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onSaveItinerary() {

  }
}
