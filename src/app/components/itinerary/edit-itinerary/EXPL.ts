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
import { Vendor } from '../../../models/vendor.model';
import { VendorsService } from '../../../services/vendors/vendors.service';

@Injectable({
  providedIn: 'root'
})
export class EXPL {
  constructor(
    private vendorsService: VendorsService,
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

          // extract a list of distinct vid
          const hids: string[] = this.extractUniqueVids(services);

          // create an array of vendor observables
          const vendorObs: Observable<Vendor>[] = [];
          hids.forEach(element => {
            vendorObs.push(
              this.vendorsService.getVendorById(element).pipe(take(1))
            );
          });

          // forkjoin the array of vendor observables
          return forkJoin(vendorObs).pipe(
            switchMap(vendorsData => {
              const vendors: Vendor[] = this.removeNoVendor(vendorsData);

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
                    text: `Land Service Operator List for ${contactPerson}`,
                    heading: HeadingLevel.HEADING_3,
                    alignment: AlignmentType.CENTER
                  }),
                  new Paragraph({}),
                  this.vendorTable(vendors)
                ]
              });
              return of(document);
            })
          );
        })
      )
      .toPromise();
  }

  vendorTable(vendors: Vendor[]): Table {
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
                  text: 'Land Operator Contact List',
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
        ...vendors.map(vendor => {
          return new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: vendor.city,
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
                        text: vendor.vendorName,
                        bold: true
                      }),
                      // addressLine1
                      vendor.addressLine1
                        ? new TextRun({
                            text: vendor.addressLine1
                          }).break()
                        : new TextRun({}),
                      // addressLine2
                      vendor.addressLine2
                        ? new TextRun({
                            text: vendor.addressLine2
                          }).break()
                        : new TextRun({}),
                      // city
                      vendor.city
                        ? new TextRun({
                            text: vendor.city
                          }).break()
                        : new TextRun({}),
                      // country
                      vendor.country
                        ? new TextRun({
                            text: vendor.country
                          }).break()
                        : new TextRun({}),
                      // Phone 1
                      vendor.phone1
                        ? new TextRun({
                            text: `Tel: ${vendor.phone1}`
                          }).break()
                        : new TextRun({}),
                      // Phone 2
                      vendor.phone2
                      ? new TextRun({
                          text: `Tel: ${vendor.phone2}`
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

  private extractUniqueVids(services: Service[]): string[] {
    const vids: string[] = [];
    services.forEach(element => {
      vids.push(element.vid);
    });

    const distinct = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    return vids.filter(distinct);
  }

  private removeNoVendor(vendors: Vendor[]): Vendor[] {
    vendors.forEach((element, index) => {
      if (element.vendorName.toLowerCase() === 'No Vendor'.toLowerCase()) {
        vendors.splice(index, 1);
      }
    });
    return vendors;
  }
}
