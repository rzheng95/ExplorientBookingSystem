import { Injectable } from '@angular/core';
import {
  Document,
  Header,
  Paragraph,
  Footer,
  TextRun,
  Media,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  WidthType
} from 'docx';
import { forkJoin, of, Observable } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { HotelsService } from '../../../services/hotels/hotels.service';
import { environment } from '../../../../environments/environment';
import { Base64Image } from './Base64Image';
import { Hotel } from '../../../models/hotel.model';
import { Buffer } from 'buffer';
import { ServicesService } from '../../../services/services/services.service';
import { Service } from '../../../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class EXPH {
  constructor(
    private hotelsService: HotelsService,
    private servicesService: ServicesService,
    private base64Image: Base64Image
  ) {}

  public async create(bid: string, contactPerson: string) {
    const servicesObs = this.servicesService.getServiceByBid(bid).pipe(take(1));
    // prettier-ignore
    const headerImageObs = this.base64Image.getBase64ImageFromURL(environment.itineraryHeaderImageUrl).pipe(take(1));
    // prettier-ignore
    const footerImageObs = this.base64Image.getBase64ImageFromURL(environment.itineraryFooterImageUrl).pipe(take(1));

    return forkJoin([servicesObs, headerImageObs, footerImageObs])
      .pipe(
        switchMap(data => {
          const services = data[0];
          const headerImageBase64 = data[1];
          const footerImageBase64 = data[2];

          // extract a list of distinct hid
          const hids: string[] = this.extractUniqueHids(services);

          // create an array of hotel observables
          const hotelsObs: Observable<Hotel>[] = [];
          hids.forEach(element => {
            hotelsObs.push(
              this.hotelsService.getHotelById(element).pipe(take(1))
            );
          });

          // forkjoin the array of hotel observables
          return forkJoin(hotelsObs).pipe(
            switchMap(hotelsData => {
              const hotels: Hotel[] = this.removeNoHotel(hotelsData);

              const document = new Document({
                styles: {
                  paragraphStyles: [
                    {
                      id: 'Heading1',
                      name: 'Ariail-Narrow-Font11',
                      run: {
                        size: 22,
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
                      }
                    },
                    {
                      id: 'Heading3',
                      name: 'Ariail-Narrow-Bold-Font12',
                      run: {
                        size: 24,
                        bold: true,
                        font: 'Arial Narrow'
                      }
                    }
                  ]
                }
              });

              const headerImage = Media.addImage(
                document,
                Buffer.from(headerImageBase64, 'base64'),
                220,
                55
              );
              const footerImage = Media.addImage(
                document,
                Buffer.from(footerImageBase64, 'base64'),
                120,
                25
              );

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
                            text:
                              'Explorient Travel Services® is a proud member of ',
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
                  new Paragraph({
                    text: `Hotel Listing for ${contactPerson}`,
                    heading: HeadingLevel.HEADING_3,
                    alignment: AlignmentType.CENTER
                  }),
                  new Paragraph({}),
                  this.hotelTable(hotels)
                ]
              });
              return of(document);
            })
          );
        })
      )
      .toPromise();
  }

  hotelTable(hotels: Hotel[]): Table {
    return new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: 'City',
                  heading: HeadingLevel.HEADING_2
                })
              ],
              width: {
                size: 30,
                type: WidthType.PERCENTAGE
              },
              margins: {
                left: 100,
                right: 100,
                bottom: 50
              },
              shading: {
                fill: 'bfbfbf'
              }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: 'Hotel',
                  heading: HeadingLevel.HEADING_2
                })
              ],
              width: {
                size: 70,
                type: WidthType.PERCENTAGE
              },
              margins: {
                left: 100,
                right: 100,
                bottom: 50
              },
              shading: {
                fill: 'bfbfbf'
              }
            })
          ]
        }),
        ...hotels.map(hotel => {
          return new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: hotel.city,
                    heading: HeadingLevel.HEADING_1
                  })
                ],
                margins: {
                  left: 100,
                  right: 100
                }
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      // hotel name
                      new TextRun({
                        text: hotel.hotelName,
                        bold: true
                      }),
                      // addressLine1
                      hotel.addressLine1
                        ? new TextRun({
                            text: hotel.addressLine1
                          }).break()
                        : new TextRun({}),
                      // addressLine2
                      hotel.addressLine2
                        ? new TextRun({
                            text: hotel.addressLine2
                          }).break()
                        : new TextRun({}),
                      // city
                      hotel.city
                        ? new TextRun({
                            text: hotel.city
                          }).break()
                        : new TextRun({}),
                      // country
                      hotel.country
                        ? new TextRun({
                            text: hotel.country
                          }).break()
                        : new TextRun({}),
                      // Phone 1
                      hotel.phone1
                        ? new TextRun({
                            text: `Tel: ${hotel.phone1}`
                          }).break()
                        : new TextRun({}),
                      // Phone 2
                      hotel.phone2
                      ? new TextRun({
                          text: `Tel: ${hotel.phone2}`
                        }).break()
                      : new TextRun({})
                    ],
                    heading: HeadingLevel.HEADING_1
                  }),
                  new Paragraph({})
                ],
                margins: {
                  left: 100,
                  right: 100
                }
              })
            ]
          });
        })
      ]
    });
  }

  private extractUniqueHids(services: Service[]): string[] {
    const hids: string[] = [];
    services.forEach(element => {
      hids.push(element.hid);
    });

    const distinct = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    return hids.filter(distinct);
  }

  private removeNoHotel(hotels: Hotel[]): Hotel[] {
    hotels.forEach((element, index) => {
      if (element.hotelName.toLowerCase() === 'No Hotel'.toLowerCase()) {
        hotels.splice(index, 1);
      }
    });
    return hotels;
  }
}
