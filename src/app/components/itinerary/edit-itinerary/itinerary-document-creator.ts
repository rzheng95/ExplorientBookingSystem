import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeadingLevel,
  VerticalMergeType,
  TextRun,
  Run,
  UnderlineType
} from 'docx';
import { Injectable } from '@angular/core';
import { take, map, switchMap, tap } from 'rxjs/operators';
import { BookingsService } from '../../../services/bookings/bookings.service';
import { PassengersService } from '../../../services/passengers/passengers.service';
import { Passenger } from '../../../models/passenger.model';
import { Booking } from '../../../models/booking.model';
import { ServicesService } from '../../../services/services/services.service';
import { ItinerariesService } from 'src/app/services/itineraries/itineraries.service';
import { forkJoin, of } from 'rxjs';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

@Injectable({
  providedIn: 'root'
})
export class ItineraryDocumentCreator {
  constructor(
    private passengersService: PassengersService,
    private bookingsService: BookingsService,
    private servicesService: ServicesService,
    private itinerariesService: ItinerariesService
  ) {}
  public async create(bid: string) {
    const first = await this.servicesService.getFirstServiceDate(bid);
    const last = await this.servicesService.getLastServiceDate(bid);

    // Ex. February 22, 2020
    // prettier-ignore
    const departureDate = monthNames[first.getMonth()] + ' ' + first.getDate() + ', ' + first.getFullYear();
    // prettier-ignore
    const returnDate = monthNames[last.getMonth()] + ' ' + last.getDate() + ', ' + last.getFullYear();

    // prettier-ignore
    const bookingObs = this.bookingsService.getBookingById(bid).pipe(take(1));
    // prettier-ignore
    const itineraryObs = this.itinerariesService.getItineraryByBid(bid).pipe(take(1));
    // prettier-ignore
    const passengersObs = this.passengersService.getPassengersByBid(bid).pipe(take(1));

    return forkJoin([bookingObs, itineraryObs, passengersObs]).pipe(
      switchMap(data => {
        const booking = data[0];
        const itinerary = data[1];
        const passengers = data[2];

        const document = this.newDocument();

        const headerTable = this.createHeaderTable(
          passengers,
          booking,
          departureDate,
          returnDate
        );

        const tourSummary = this.createTourSummary(itinerary.tourSummary);

        const additionalInfo = this.createAdditionalInfo(itinerary.additionalInfo);

        document.addSection({
          children: [
            headerTable,
            // Tour Summary:
            new Paragraph({
              text: 'TOUR SUMMARY:',
              heading: HeadingLevel.HEADING_4
            }).addRunToFront(new Run({
              text: ''
            }).break()),
            ...tourSummary,
            // Additional Information
            new Paragraph({
              text: '',
              heading: HeadingLevel.HEADING_4
            }).addRunToFront(new Run({
              text: 'Additional Information:',
              underline: {}
            }).break()),
            ...additionalInfo
          ]
        });
        return of(document);
      })
    ).toPromise();
  }

  public newDocument(): Document {
    return new Document({
      styles: {
        paragraphStyles: [
          {
            id: 'Heading1',
            name: 'Ariail-Narrow',
            run: {
              size: 20,
              bold: true,
              font: 'Arial Narrow'
            }
          },
          {
            id: 'Heading2',
            name: 'Ariail-Narrow-Bold-Font11',
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
          },
          {
            id: 'Heading3',
            name: 'Ariail-Narrow-Bold-Font10',
            run: {
              size: 20,
              bold: true,
              font: 'Arial Narrow'
            },
            paragraph: {
              spacing: {
                before: 100,
                after: 300
              }
            }
          },
          {
            id: 'Heading4',
            name: 'Ariail-Narrow-Bold-Spacing',
            run: {
              size: 20,
              bold: true,
              font: 'Arial Narrow'
              // ,allCaps: true
            },
            paragraph: {
              spacing: {
                before: 100,
                after: 300
              }
            }
          }
        ]
      }
    });
  }

  public createAdditionalInfo(additionalInfo: string): Paragraph[] {
    const bulletPoints: Paragraph[] = [];
    const paragraphs = additionalInfo.split('\n');

    paragraphs.forEach(para => {
      bulletPoints.push(this.createBullet(para));
    });

    return bulletPoints;
  }

  public createTourSummary(tourSummary: string): Paragraph[] {
    const bulletPoints: Paragraph[] = [];
    const paragraphs = tourSummary.split('\n');

    paragraphs.forEach(para => {
      bulletPoints.push(this.createBullet(para));
    });

    return bulletPoints;
  }

  public createBullet(text: string): Paragraph {
    return new Paragraph({
      text,
      bullet: {
        level: 0
      },
      heading: HeadingLevel.HEADING_1
    });
  }

  public createHeaderTable(
    passengers: Passenger[],
    booking: Booking,
    departureDate: string,
    returnDate: string
  ): Table {
    return new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: 'Passenger(s):',
                  heading: HeadingLevel.HEADING_2
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
                    heading: HeadingLevel.HEADING_2
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
                  heading: HeadingLevel.HEADING_2
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
                  heading: HeadingLevel.HEADING_2
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
                  heading: HeadingLevel.HEADING_2
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
                  heading: HeadingLevel.HEADING_2
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
                  heading: HeadingLevel.HEADING_2
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
                  heading: HeadingLevel.HEADING_2
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
