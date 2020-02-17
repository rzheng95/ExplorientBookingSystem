import { Document, Paragraph, Table, TableRow, TableCell } from 'docx';
import { PassengersService } from '../../../services/passengers/passengers.service';
import { Injectable } from '@angular/core';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItineraryDocumentCreator {

  constructor(
    private passengersService: PassengersService  ) {}

  public create(bid: string): Promise<Document> {

    return this.passengersService.getPassengersByBid(bid).pipe(
      take(1),
      map(passenger => {
        const document = new Document();
        const table = this.createHeaderTable();
        document.addSection({
          children: [table]
        });
        return document;
      })
    ).toPromise();

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
