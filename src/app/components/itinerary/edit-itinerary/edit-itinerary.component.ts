import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ServicesService } from '../../../services/services/services.service';
import { Service } from '../../../models/service.model';

@Component({
  selector: 'app-edit-itinerary',
  templateUrl: './edit-itinerary.component.html',
  styleUrls: ['./edit-itinerary.component.css']
})
export class EditItineraryComponent implements OnInit {
  form: FormGroup;
  mode = 'edit';
  private bookingId: string;
  services: Service[] = [];

  constructor(private servicesService: ServicesService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      services: new FormArray([

      ])
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('bookingId')) {
        this.mode = 'edit';
        this.bookingId = paramMap.get('bookingId');
      } else {
        this.mode = 'create';
        this.bookingId = null;
      }
    });

    this.servicesService.getServiceByBid(this.bookingId).subscribe((sers: Service[]) => {
      this.services = sers;
      console.log(this.services);

      let count = 0;
      for (const service of this.services) {
        this.serviceFormArray.push(this.serviceFormGroup());

        this.serviceFormArray.controls[count].setValue({
          datePicker: this.services[count].date,
          serviceCaption: this.services[count].serviceCaption,
          destination: this.services[count].destination,
          activity: this.services[count].activity,
          accommodations: this.services[count].accommodations
        });
        count++;
        // this.serviceFormArray.controls[count].setValue({
        //   serviceCaption: service.serviceCaption
        // });
      }

      // console.log((services[0].date as any).toDate());
      // this.services.sort((a, b) => a.passengerName.localeCompare(b.passengerName));
    });

  }

  onSaveService(id: string) {

  }

  get serviceFormArray() {
    return this.form.get('services') as FormArray;
  }

  onClickAddService() {
    this.serviceFormArray.push(this.serviceFormGroup());
    const newService: Service = {
      bid: this.bookingId,
      date: null,
      serviceCaption: null,
      destination: null,
      activity: null,
      accommodations: null
    };
    this.services.push(newService);
  }

  serviceFormGroup() {
    return new FormGroup({
      datePicker: new FormControl(null),
      serviceCaption: new FormControl(null),
      destination: new FormControl(null),
      activity: new FormControl(null),
      accommodations: new FormControl(null)
    });
  }


  onSubmit() {
    for (const service of this.serviceFormArray.controls) {
      // console.log(this.form.get(['services', counter]).value);
      const newService: Service = {
        bid: this.bookingId,
        date: service.value.datePicker,
        serviceCaption: service.value.serviceCaption,
        destination: service.value.destination,
        activity: service.value.activity,
        accommodations: service.value.accommodations
      };
      // console.log(newService);
      // this.servicesService.addService(newService);
    }
  }


}
