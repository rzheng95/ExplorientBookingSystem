import { Document, Paragraph, Table, TableRow, TableCell } from 'docx';
import { PassengersService } from '../../../services/passengers/passengers.service';
import { Injectable } from '@angular/core';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItineraryDocumentCreator {

  constructor(
    private passengersService: PassengersService  ) {}

  public create(bid: string) {

    return this.passengersService.getPassengersByBid(bid).pipe(
      take(1),

    ).toPromise();

    return new Promise((resolve) => {
      // take(1) is useful if you need the data once and don't want to manually cancel the subscription again
      this.passengersService.getPassengersByBid(bid).pipe(take(1)).subscribe(() => {
        const document = new Document();

        const table = this.createHeaderTable();
        document.addSection({
          children: [table]
        });
        resolve(document);
      });
    });
  }

  createHeaderTable() {
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
