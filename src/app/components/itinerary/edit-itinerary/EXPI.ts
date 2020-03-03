import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeadingLevel,
  TextRun,
  Run,
  Header,
  Footer,
  Media,
  AlignmentType} from 'docx';
import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { take, switchMap, delay } from 'rxjs/operators';
import { Passenger } from '../../../models/passenger.model';
import { Booking } from '../../../models/booking.model';
import { Service } from '../../../models/service.model';
import { BookingsService } from '../../../services/bookings/bookings.service';
import { PassengersService } from '../../../services/passengers/passengers.service';
import { ServicesService } from '../../../services/services/services.service';
import { ItinerariesService } from '../../../services/itineraries/itineraries.service';
import { HotelsService } from 'src/app/services/hotels/hotels.service';
import { Hotel } from 'src/app/models/hotel.model';
import { Buffer } from 'buffer';
import { environment } from '../../../../environments/environment';
import { Base64Image } from './Base64Image';

const monthNames = [
  'Jan.',
  'Feb.',
  'March',
  'April',
  'May',
  'June',
  'July',
  'Aug.',
  'Sep.',
  'Oct.',
  'Nov.',
  'Dec.'
];

@Injectable({
  providedIn: 'root'
})
export class EXPI {
  constructor(
    private passengersService: PassengersService,
    private bookingsService: BookingsService,
    private servicesService: ServicesService,
    private itinerariesService: ItinerariesService,
    private hotelsService: HotelsService,
    private base64Image: Base64Image
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

    const servicesObs = this.servicesService.getServiceByBid(bid).pipe(
      take(1),
      switchMap(services => {
        services.forEach(async service => {
          const hotelname = ((
            await this.hotelsService.getHotelNameById(service.hid)
          ).data() as Hotel).hotelName;
          if (!hotelname) {
            service.hid = '';
          } else {
            if (hotelname === 'No Hotel') {
              service.hid = '';
            } else {
              service.hid = hotelname;
            }
          }
          // console.log('here');
        });
        return of(services).pipe(take(1));
      })
    );

    const headerImageObs = this.base64Image.getBase64ImageFromURL(environment.itineraryHeaderImageUrl).pipe(take(1));

    const footerImageObs = this.base64Image.getBase64ImageFromURL(environment.itineraryFooterImageUrl).pipe(take(1));

    return forkJoin([bookingObs, itineraryObs, passengersObs, servicesObs, headerImageObs, footerImageObs])
      .pipe(
        delay(200),
        switchMap(data => {
          const booking = data[0];
          const itinerary = data[1];
          const passengers = data[2];
          const services = data[3];
          const headerImageBase64 = data[4];
          const footerImageBase64 = data[5];

          // console.log(services[0].hid);

          const document = this.newDocument();

          const headerTable = this.createHeaderTable(
            passengers,
            booking,
            departureDate,
            returnDate
          );

          const tourSummary = this.createBulletPoints(itinerary.tourSummary);

          const additionalInfo = this.createBulletPoints(
            itinerary.additionalInfo
          );

          const headerImage = Media.addImage(document, Buffer.from(headerImageBase64, 'base64'), 220, 55);
          const footerImage = Media.addImage(document, Buffer.from(footerImageBase64, 'base64'), 120, 25);

          document.addSection({
            headers: {
              default: new Header({
                children: [
                  new Paragraph({
                    children: [headerImage]
                  }),
                  new Paragraph({}),
                  new Paragraph({})
                ]
              })
            },
            footers: {
              default: new Footer({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'Explorient Travel Services® is a proud member of ',
                        font: {
                          name: 'Times New Roman'
                        },
                        bold: true,
                        italics: true
                      }),
                      footerImage
                    ],
                    alignment: AlignmentType.RIGHT
                  })
                ]
              })
            },
            children: [
              headerTable,
              // Tour Summary:
              new Paragraph({
                text: 'TOUR SUMMARY:',
                heading: HeadingLevel.HEADING_4
              }).addRunToFront(
                new Run({
                  text: ''
                }).break()
              ),
              ...tourSummary,
              // Additional Information
              new Paragraph({
                text: '',
                heading: HeadingLevel.HEADING_4
              }).addRunToFront(
                new Run({
                  text: 'Additional Information:',
                  underline: {}
                }).break()
              ),
              ...additionalInfo,
              // Tour Itinerary
              new Paragraph({
                text: 'TOUR ITINERARY:',
                heading: HeadingLevel.HEADING_5
              }).addRunToFront(
                new Run({
                  text: ''
                }).break()
              ),
              this.createItineraryTable(services)
            ]
          });
          return of(document);
        })
      )
      .toPromise();
  }

  public newDocument(): Document {
    return new Document({
      styles: {
        paragraphStyles: [
          {
            id: 'Heading1',
            name: 'Ariail-Narrow-Font10',
            run: {
              size: 20,
              bold: false,
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
            name: 'Ariail-Narrow-Bold-Spacing-Font10',
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
          },
          {
            id: 'Heading5',
            name: 'Ariail-Narrow-Bold-Spacing-Font24',
            run: {
              size: 24,
              bold: true,
              font: 'Arial Narrow'
            },
            paragraph: {
              spacing: {
                before: 200
              }
            }
          }
        ]
      }
    });
  }

  public createBulletPoints(str: string): Paragraph[] {
    const bulletPoints: Paragraph[] = [];
    if (!str) {
      return bulletPoints;
    }
    const paragraphs = str.replace(/\n$/, '').split('\n');

    paragraphs.forEach(para => {
      bulletPoints.push(this.createBullet(para));
    });
    return bulletPoints;
  }

  public createBullet(text: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text,
          font: {
            name: 'Arial Narrow'
          }
        })
      ],
      bullet: {
        level: 0
      }
    });
  }

  public createItineraryTable(services: Service[]): Table {
    return new Table({
      rows: [
        // Top row
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: 'Day',
                  heading: HeadingLevel.HEADING_4
                })
              ],
              width: {
                size: 10,
                type: WidthType.PERCENTAGE
              },
              margins: {
                left: 100,
                right: 100
              },
              shading: {
                fill: 'bfbfbf'
              }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: 'Activity Summary',
                  heading: HeadingLevel.HEADING_4
                })
              ],
              width: {
                size: 90,
                type: WidthType.PERCENTAGE
              },
              margins: {
                left: 100,
                right: 100
              },
              shading: {
                fill: 'bfbfbf'
              }
            })
          ]
        }),
        ...services.map((service, index) => {
          return new TableRow({
            children: [
              // Day
              new TableCell({
                children: [
                  new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    text:
                      monthNames[service.date.getMonth()] +
                      ' ' +
                      service.date.getDate()
                  })
                ],
                margins: {
                  left: 100,
                  right: 100
                }
              }),
              // Activity Summary
              new TableCell({
                children: [
                  new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [
                      // Destination
                      new TextRun({
                        text: service.destination + ': ',
                        bold: true
                      }),
                      // Activity
                      new TextRun({
                        text: service.activity
                      })
                    ]
                  }),
                  // Line break
                  new Paragraph({}),
                  new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [
                      // Meal text
                      this.mealsToText(
                        service.breakfast,
                        service.lunch,
                        service.dinner
                      )
                        ? new TextRun({
                            text: 'Meals: ',
                            bold: true
                          })
                        : new TextRun({}),
                      // Meal body
                      this.mealsToText(
                        service.breakfast,
                        service.lunch,
                        service.dinner
                      )
                        ? new TextRun({
                            text: this.mealsToText(
                              service.breakfast,
                              service.lunch,
                              service.dinner
                            )
                          })
                        : new TextRun({}),
                      // Accommodations text
                      service.hid
                        ? new TextRun({
                            text: 'Accommodations: ',
                            bold: true
                          }).break()
                        : new TextRun({}),
                      // Accommodations body
                      service.hid
                        ? new TextRun({
                            text: service.hid
                          })
                        : new TextRun({}),
                      // Room type
                      new TextRun({
                        text:
                          service.hid && service.roomType
                            ? ' (' + service.roomType + ')'
                            : ''
                      }),
                      // Notes
                      service.notes
                        ? new TextRun({
                            text: '**Notes: ',
                            bold: true
                          })
                            .break()
                            .break()
                        : new TextRun({})
                    ]
                  }),
                  // Notes bullet poitns
                  ...this.createBulletPoints(service.notes),
                  // End line break
                  index === services.length - 1
                    ? new Paragraph({
                        heading: HeadingLevel.HEADING_1,
                        text: '****END OF PROGRAM***'
                      })
                    : new Paragraph({})
                ],
                margins: {
                  left: 100,
                  right: 100
                }
              })
            ]
          });
        })
      ],
      width: {
        size: 9050, // maximum 9638
        type: WidthType.DXA
      }
    });
  }

  private mealsToText(breakfast: boolean, lunch: boolean, dinner: boolean) {
    let text = '';
    if (breakfast) {
      text += 'Breakfast';
    }
    if (lunch) {
      if (breakfast) {
        text += ', ';
      }
      text += 'Lunch';
    }
    if (dinner) {
      if (breakfast || lunch) {
        text += ', ';
      }
      text += 'Dinner';
    }
    return text;
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
              width: {
                size: 20,
                type: WidthType.PERCENTAGE
              },
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
              width: {
                size: 80,
                type: WidthType.PERCENTAGE
              },
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
