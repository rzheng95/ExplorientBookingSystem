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
  HeadingLevel
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
    const hotelObs = this.hotelsService.getHotelsByBid(bid).pipe(take(1));
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
              const hotels: Hotel[] = hotelsData;


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
                    heading: HeadingLevel.HEADING_3
                  }),
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
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: 'Hotel',
                  heading: HeadingLevel.HEADING_2
                })
              ]
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
                ]
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({

                      })
                    ]
                  }),
                  new Paragraph({
                    text: hotel.hotelName,
                    heading: HeadingLevel.HEADING_1
                  }),
                  new Paragraph({
                    text: hotel.addressLine1,
                    heading: HeadingLevel.HEADING_1
                  }),
                  hotel.addressLine2
                    ? new Paragraph({
                        text: hotel.addressLine2,
                        heading: HeadingLevel.HEADING_1
                      })
                    : new Paragraph({}),
                  new Paragraph({
                    text: hotel.city,
                    heading: HeadingLevel.HEADING_1
                  }),
                  new Paragraph({
                    text: hotel.country,
                    heading: HeadingLevel.HEADING_1
                  }),
                  new Paragraph({
                    text: `Tel: ${hotel.phone1}`,
                    heading: HeadingLevel.HEADING_1
                  })
                ]
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

}
