import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  AbstractControl
} from '@angular/forms';
import { BookingsService } from '../../../services/bookings/bookings.service';
import { ServicesService } from '../../../services/services/services.service';
import { Booking } from '../../../models/booking.model';
import { Service } from '../../../models/service.model';
import { Observable, Subscription } from 'rxjs';
import { startWith, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-itinerary',
  templateUrl: './edit-itinerary.component.html',
  styleUrls: ['./edit-itinerary.component.css']
})
export class EditItineraryComponent implements OnInit, OnDestroy {
  private bookingId: string;
  form: FormGroup;
  mode = 'edit';
  services: Service[] = [];
  servicesSub: Subscription;
  booking: Observable<Booking>;

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>[] = [];


  constructor(
    private servicesService: ServicesService,
    private bookingsService: BookingsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      services: new FormArray([])
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


    this.booking = this.bookingsService.getBookingById(this.bookingId) as Observable<Booking>;

    this.servicesSub = this.servicesService
      .getServiceByBid(this.bookingId)
      .subscribe((sers: Service[]) => {
        this.services = sers;
        this.services.sort((a, b) => this.sortNullDate(a.date, b.date));

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
          // console.log(this.serviceFormArray.controls[count]);

          this.filteredOptions[count] = this.serviceFormArray.controls[count].valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value.accommodations))
          );

          count++;
        }
      });
  }

  private _filter(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  ngOnDestroy() {
    if (this.servicesSub) {
      this.servicesSub.unsubscribe();
    }
  }

  sortNullDate(a, b) {
    a = a === null ? new Date('3000-12-12') : a;
    b = b === null ? new Date('3000-12-12') : b;
    return a - b;
  }

  getDate(date: Date) {
    // console.log(date.getDate());
    if (date) {
      return (
        date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()
      );
    }
    return null;
  }

  onSaveService(serviceId: string, formArrayIndex: number) {
    const control: AbstractControl = this.serviceFormArray.controls[
      formArrayIndex
    ];

    this.servicesService
      .updateService(serviceId, {
        date: control.value.datePicker,
        serviceCaption: control.value.serviceCaption.trim(),
        destination: control.value.destination.trim(),
        activity: control.value.activity.trim(),
        accommodations: control.value.accommodations.trim()
      })
      .then(() => console.log('Service saved.'))
      .catch(() => window.alert('Service could not be saved!'));
  }

  onDeleteService(serviceId: string, formArrayIndex: number) {
    this.servicesService
      .deleteService(serviceId)
      .then(() => console.log('Service deleted.'))
      .catch(() => window.alert('Service could not be deleted!'));
    this.serviceFormArray.removeAt(formArrayIndex);
  }

  get serviceFormArray() {
    return this.form.get('services') as FormArray;
  }


  onAddService() {

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

    // Crete an empty service in firestore
    this.servicesService
      .addService(newService)
      .then(() => console.log('Service added.'))
      .catch(() => window.alert('Service could not be added!'));
  }

  serviceFormGroup() {
    return new FormGroup({
      datePicker: new FormControl(null, {
        validators: [Validators.required]
      }),
      serviceCaption: new FormControl(null, {
        validators: [Validators.required]
      }),
      destination: new FormControl(null, {
        validators: [Validators.required]
      }),
      activity: new FormControl(null, {
        validators: [Validators.required]
      }),
      accommodations: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }
}
