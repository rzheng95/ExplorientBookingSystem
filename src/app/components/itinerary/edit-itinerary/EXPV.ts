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
export class EXPV {
  constructor(
    private vendorsService: VendorsService,
    private servicesService: ServicesService,
    private base64Image: Base64Image
  ) {}

  public async create(bid: string, contactPerson: string) {
    const servicesObs = this.servicesService.getServiceByBid(bid).pipe(take(1));

    return forkJoin([servicesObs])
      .pipe(
        switchMap(data => {
          const services = data[0];

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
                    },
                    {
                      id: 'Heading4',
                      name: 'Ariail-Narrow-Bold-Font14',
                      run: {
                        size: 28,
                        bold: true,
                        font: 'Arial Narrow'
                      }
                    }
                  ]
                }
              });

              document.addSection({
                children: [

                ]
              });
              return of(document);
            })
          );
        })
      )
      .toPromise();
  }

  private createVoucher(services: Service[]) {
    return new Paragraph({
      children: [
        new TextRun({
          text: `Land Service Vourcher for Booking #`
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
