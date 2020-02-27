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
import { Hotel } from '../../../models/hotel.model';
import { Vendor } from '../../../models/vendor.model';
import { Observable, Subscription } from 'rxjs';
import { startWith, map, take } from 'rxjs/operators';
import { HotelsService } from '../../../services/hotels/hotels.service';
import { VendorsService } from '../../../services/vendors/vendors.service';
import { Itinerary } from '../../../models/itinerary.model';
import { ItinerariesService } from '../../../services/itineraries/itineraries.service';
import { ItineraryDocumentCreator } from './itinerary-document-creator';
import { Packer, Document } from 'docx';
import saveAs from 'file-saver';

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
  itinerarySub: Subscription;
  itinDataSub: Subscription;
  booking: Observable<Booking>;

  hotels: { id: string; hotelName: string }[] = [];
  hotelFilteredOptions: Observable<{ id: string; hotelName: string }[]>[] = [];

  vendors: { id: string; vendorName: string }[];
  vendorFilteredOptions: Observable<
    { id: string; vendorName: string }[]
  >[] = [];

  constructor(
    private servicesService: ServicesService,
    private bookingsService: BookingsService,
    private hotelsService: HotelsService,
    private vendorService: VendorsService,
    private itinerariesService: ItinerariesService,
    private route: ActivatedRoute,
    private itinDocCreator: ItineraryDocumentCreator
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      tourSummary: new FormControl(null, {
        validators: [Validators.required]
      }),
      additionalInfo: new FormControl(null),
      services: new FormArray([])
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('bookingId')) {
        this.mode = 'edit';
        this.bookingId = paramMap.get('bookingId');
      } else {
        this.mode = 'create';
        this.bookingId = null;
        return;
      }
    });

    // Get tour summary and additional info
    this.itinerarySub = this.itinerariesService
      .getItineraryByBid(this.bookingId)
      .subscribe(itinerary => {
        if (itinerary) {
          this.form.patchValue({
            tourSummary: itinerary.tourSummary,
            additionalInfo: itinerary.additionalInfo
          });
        }
      });

    // Get a list of hotels {id, hotelName}
    this.hotelsService.getHotelNames().subscribe(hotels => {
      this.hotels = hotels;
    });

    // Get a list of vendors {id, vendorName}
    this.vendorService.getVendorNames().subscribe(vendors => {
      this.vendors = vendors;
    });

    this.booking = this.bookingsService.getBookingById(
      this.bookingId
    ) as Observable<Booking>;

    this.servicesSub = this.servicesService
      .getServiceByBid(this.bookingId)
      .subscribe((sers: Service[]) => {
        this.services = sers;
        this.services.sort((a, b) => this.sortNullDate(a.date, b.date));

        this.services.forEach((service, index) => {
          this.serviceFormArray.push(this.serviceFormGroup());

          this.serviceFormArray.controls[index].patchValue({
            datePicker: service.date,
            serviceCaption: service.serviceCaption,
            destination: service.destination,
            activity: service.activity,
            roomType: service.roomType,
            breakfast: service.breakfast,
            lunch: service.lunch,
            dinner: service.dinner,
            notes: service.notes
          });

          // fetch hotel name by id
          if (service.hid) {
            this.hotelsService
              .getHotelNameById(service.hid.trim())
              .then(doc => {
                const hotel = doc.data() as Hotel;
                this.serviceFormArray.controls[index].patchValue({
                  hid: hotel.hotelName
                });
              })
              .catch(err => console.log(err));
          }

          // fetch vendor name by id
          if (service.vid) {
            this.vendorService
              .getVendorNameById(service.vid.trim())
              .then(doc => {
                const vendor = doc.data() as Vendor;
                this.serviceFormArray.controls[index].patchValue({
                  vid: vendor.vendorName
                });
              })
              .catch(err => console.log(err));
          }

          // Each accommodation field will have a valueChanges listener
          this.hotelFilteredOptions[index] = this.serviceFormArray.controls[
            index
          ].valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value.hid))
          );

          // Each vendor field will have a valueChanges listener
          this.vendorFilteredOptions[index] = this.serviceFormArray.controls[
            index
          ].valueChanges.pipe(
            startWith(''),
            map(value => this._filter2(value.vid))
          );
        });
      });
  }

  private _filter(hotel: string): { id: string; hotelName: string }[] {
    if (hotel) {
      const filterValue = hotel.toLowerCase();
      return this.hotels.filter(option =>
        option.hotelName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }

  private _filter2(vendor: string): { id: string; vendorName: string }[] {
    if (vendor) {
      const filterValue = vendor.toLowerCase();
      return this.vendors.filter(option =>
        option.vendorName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }

  ngOnDestroy() {
    if (this.servicesSub) {
      this.servicesSub.unsubscribe();
    }
    if (this.itinerarySub) {
      this.itinerarySub.unsubscribe();
    }
    if (this.itinDataSub) {
      this.itinDataSub.unsubscribe();
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

  private getHotelIdByName(hotelName: string) {
    if (hotelName) {
      for (const h of this.hotels) {
        if (h.hotelName === hotelName) {
          return h.id;
        }
      }
    }
    return hotelName;
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

  /*

  onDownload() {
    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create([
      experiences,
      education,
      skills,
      achievements
    ]);

    Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob, 'example.docx');
      console.log('Document created successfully');
    });
  }

  */

  onPrintItinerary() {
    this.booking.pipe(take(1)).subscribe(bkg => {
      const lastname = bkg.contactName.split(' ')[1].toUpperCase();
      this.itinDocCreator.create(this.bookingId).then(doc => {
        Packer.toBlob(doc as Document).then(blob => {
          if (lastname) {
            saveAs(blob, `EXPI_${lastname}.docx`);
          } else {
            saveAs(blob, 'Itinerary.docx');
          }
          // console.log('Document created successfully');
        });
      });
    });

  }

  onSaveItinerary() {
    const itinerary: Itinerary = {
      bid: this.bookingId,
      tourSummary: this.form.value.tourSummary,
      additionalInfo: this.form.value.additionalInfo
    };

    // update itinerary -> itinerary exists

    this.itinerariesService
      .getItineraryByBid(this.bookingId)
      .pipe(take(1))
      .subscribe(itin => {
        if (itin) {
          this.itinerariesService
            .updateItinerary(itin.id, itinerary)
            .then(() => {
              window.alert('Updated Tour Summary & Additional Information.');
            })
            .catch(err => {
              window.alert(
                'Could not update Tour Summary & Additional Information!'
              );
            });
        } else {
          this.itinerariesService
            .addItinerary(itinerary)
            .then(() => {
              window.alert('Added Tour Summary & Additional Information.');
            })
            .catch(err => {
              window.alert(
                'Could not add Tour Summary & Additional Information!'
              );
            });
        }
      });
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
        hid: this.getHotelIdByName(control.value.hid.trim()),
        roomType: control.value.roomType,
        breakfast: control.value.breakfast,
        lunch: control.value.lunch,
        dinner: control.value.dinner,
        vid: this.getVendorIdByName(control.value.vid.trim()),
        notes: control.value.notes
      })
      .then(() => console.log('Service saved.'))
      .catch(() => window.alert('Service could not be saved!'));
  }

  onDeleteService(serviceId: string, formArrayIndex: number) {
    this.servicesService
      .deleteService(serviceId)
      .then(() => console.log('Service deleted.'))
      .catch(() => window.alert('Service could not be deleted!'));
    // this.serviceFormArray.removeAt(formArrayIndex);
  }

  get serviceFormArray() {
    return this.form.get('services') as FormArray;
  }

  onAddService() {
    this.servicesService
      .getLastServiceDate(this.bookingId)
      .then(dateData => {
        const date = dateData;
        if (date) {
          date.setDate(dateData.getDate() + 1);
        }

        this.serviceFormArray.push(this.serviceFormGroup());
        const newService: Service = {
          bid: this.bookingId,
          date,
          serviceCaption: null,
          destination: null,
          activity: null,
          hid: null,
          roomType: null,
          breakfast: false,
          lunch: false,
          dinner: false,
          vid: null,
          notes: null
        };
        this.services.push(newService);

        // Crete an empty service in firestore
        this.servicesService
          .addService(newService)
          .then(() => console.log('Service added.'))
          .catch(() => window.alert('Service could not be added!'));
      })
      .catch(err => console.log(err));
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
      hid: new FormControl(null, {
        validators: [Validators.required]
      }),
      roomType: new FormControl(null),
      breakfast: new FormControl(null),
      lunch: new FormControl(null),
      dinner: new FormControl(null),
      vid: new FormControl(null, {
        validators: [Validators.required]
      }),
      notes: new FormControl(null)
    });
  }
}
