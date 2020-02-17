import { Document, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from 'docx';
import { PassengersService } from '../../../services/passengers/passengers.service';
import { Injectable } from '@angular/core';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { take, map, switchMap, tap } from 'rxjs/operators';
import { Passenger } from 'src/app/models/passenger.model';
import { Booking } from 'src/app/models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class ItineraryDocumentCreator {

  constructor(
    private passengersService: PassengersService,
    private bookingsService: BookingsService) {}
// : Promise<Document>
  public create(bid: string) {

    return this.passengersService.getPassengersByBid(bid).pipe(
      take(1),
      switchMap(passengers => {
        return this.bookingsService.getBookingById(bid).pipe(
          take(1),
          map(booking  => {
            const document = new Document({
              styles: {
                paragraphStyles: [{
                  id: 'Heading1',
                  name: 'Heading 1',
                  run: {
                    size: 22,
                    bold: true,
                    font: 'Arial Narrow'
                  }
                }]
              }
            });
            const table = this.createHeaderTable(passengers, booking as Booking);
            document.addSection({
              children: [table]
            });
            return document;
          })
        );
      }),

    ).toPromise();

    // ,
    // tap(() => {
    //   const document = new Document();
    //   const table = this.createHeaderTable(passengers);
    //   document.addSection({
    //     children: [table]
    //   });
    //   return document;
    // })

  }

  createHeaderTable(passengers: Passenger[], booking: Booking) {
    return new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({
                text: 'Passenger(s):',
                heading: HeadingLevel.HEADING_1
              })]
            }),
            new TableCell({
              // children: [new Paragraph(passengers.map((pass) => pass.passengerName).join('\n'))]
              children: passengers.map((pass) => new Paragraph({
                text: pass.passengerName,
                heading: HeadingLevel.HEADING_1
              }))
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({
                text: 'Date of departure:',
                heading: HeadingLevel.HEADING_1
              })]
            }),
            new TableCell({
              children: []
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({
                text: 'Date of return',
                heading: HeadingLevel.HEADING_1
              })]
            }),
            new TableCell({
              children: []
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({
                text: 'Tour:',
                heading: HeadingLevel.HEADING_1
              })]
            }),
            new TableCell({
              children: [new Paragraph({
                text: booking.package,
                heading: HeadingLevel.HEADING_1
              })]
            })
          ]
        })
      ],
      width: {
        size: 9050, // 9638
        type: WidthType.DXA
      }
      // ,columnWidths: [4819, 4819]
    });
  }
}
