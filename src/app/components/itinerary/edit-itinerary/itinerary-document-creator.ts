import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeadingLevel,
  VerticalMergeType
} from 'docx';
import { Injectable } from '@angular/core';
import { take, map, switchMap, tap } from 'rxjs/operators';
import { BookingsService } from '../../../services/bookings/bookings.service';
import { PassengersService } from '../../../services/passengers/passengers.service';
import { Passenger } from '../../../models/passenger.model';
import { Booking } from '../../../models/booking.model';
import { ServicesService } from '../../../services/services/services.service';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

@Injectable({
  providedIn: 'root'
})
export class ItineraryDocumentCreator {
  constructor(
    private passengersService: PassengersService,
    private bookingsService: BookingsService,
    private servicesService: ServicesService
  ) {}
  // : Promise<Document>
  public async create(bid: string) {
    const first = await this.servicesService.getFirstServiceDate(bid);
    const last  = await this.servicesService.getLastServiceDate(bid);

    const departureDate = monthNames[first.getMonth()] + ' ' + first.getDate() + ', ' + first.getFullYear();
    const returnDate = monthNames[last.getMonth()] + ' ' + last.getDate() + ', ' + last.getFullYear();

    return this.passengersService
      .getPassengersByBid(bid)
      .pipe(
        take(1),
        switchMap(passengers => {
          return this.bookingsService.getBookingById(bid).pipe(
            take(1),
            map(booking => {
              const document = new Document({
                styles: {
                  paragraphStyles: [
                    {
                      id: 'Heading1',
                      name: 'Heading 1',
                      run: {
                        size: 22,
                        bold: true,
                        font: 'Arial Narrow'
                      },
                      paragraph: {
                        spacing: {
                          // before: 100
                        }
                      }
                    }
                  ]
                }
              });

              const table = this.createHeaderTable(
                passengers,
                booking as Booking,
                departureDate,
                returnDate
              );
              document.addSection({
                children: [table]
              });
              return document;
            })
          );
        })
      )
      .toPromise();
  }

  private async getFirstAndLastDates() {}

  createHeaderTable(
    passengers: Passenger[],
    booking: Booking,
    departureDate: string,
    returnDate: string
  ) {
    return new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: 'Passenger(s):',
                  heading: HeadingLevel.HEADING_1
                })
              ],
              margins: {
                left: 100,
                right: 100
              }
            }),
            new TableCell({
              children: passengers.map(
                pass =>
                  new Paragraph({
                    text: pass.passengerName,
                    heading: HeadingLevel.HEADING_1
                  })
              ),
              margins: {
                left: 100
              }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: 'Date of departure:',
                  heading: HeadingLevel.HEADING_1
                })
              ],
              verticalMerge: VerticalMergeType.RESTART,
              margins: {
                left: 100,
                right: 100
              }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: departureDate,
                  heading: HeadingLevel.HEADING_1
                })
              ],
              verticalMerge: VerticalMergeType.CONTINUE,
              margins: {
                left: 100
              }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: 'Date of return:',
                  heading: HeadingLevel.HEADING_1
                })
              ],
              margins: {
                left: 100
              }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: returnDate,
                  heading: HeadingLevel.HEADING_1
                })
              ],
              margins: {
                left: 100
              }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: 'Tour:',
                  heading: HeadingLevel.HEADING_1
                })
              ],
              margins: {
                left: 100
              }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: booking.package,
                  heading: HeadingLevel.HEADING_1
                })
              ],
              margins: {
                left: 100
              }
            })
          ]
        })
      ],
      width: {
        size: 9050, // maximum 9638
        type: WidthType.DXA
      }
    });
  }
}
