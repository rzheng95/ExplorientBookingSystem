import { Document, Paragraph, Table, TableRow, TableCell } from 'docx';
import { PassengersService } from '../../../services/passengers/passengers.service';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { resolve } from 'url';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { count, switchMap, take } from 'rxjs/operators';
import { Subscription, interval } from 'rxjs';
import { Passenger } from 'src/app/models/passenger.model';

@Injectable({
  providedIn: 'root'
})
export class ItineraryDocumentCreator implements OnDestroy {
  passengers: Passenger[];
  passengerSub: Subscription;

  constructor(
    private passengersService: PassengersService,
    private bookingsService: BookingsService
  ) {}

  public create(bid: string) {
    return new Promise((resolve, reject) => {
      this.passengersService.getPassengersByBid(bid).pipe(take(1)).subscribe(passData => {
        const document = new Document();

        const table = this.createHeaderTable(bid);
        document.addSection({
          children: [table]
        });
        resolve(document);
      });
    });


  }

  ngOnDestroy(): void {
    if (this.passengerSub) {
      this.passengerSub.unsubscribe();
    }
  }

  createHeaderTable(bid: string) {
    return new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph('Passenger(s):')]
            }),
            new TableCell({
              children: [new Paragraph('')]
            })
          ]
        })
      ]
    });
  }
}
