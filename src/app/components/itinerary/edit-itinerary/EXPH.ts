import { Injectable } from '@angular/core';
import { Document } from 'docx';
import { forkJoin, of } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { HotelsService } from '../../../services/hotels/hotels.service';
import { environment } from '../../../../environments/environment';
import { Base64Image } from './Base64Image';

@Injectable({
  providedIn: 'root'
})
export class EXPH {
  constructor(
    private hotelsService: HotelsService,
    private base64Image: Base64Image
  ) {}

  public async create(bid: string) {
    const hotelObs = this.hotelsService.getHotelsByBid(bid).pipe(take(1));
    const headerImageObs = this.base64Image.getBase64ImageFromURL(environment.itineraryHeaderImageUrl).pipe(take(1));
    const footerImageObs = this.base64Image.getBase64ImageFromURL(environment.itineraryFooterImageUrl).pipe(take(1));


    return forkJoin([hotelObs, headerImageObs, footerImageObs]).pipe(switchMap(data => {
      const hotel = data[0];
      const header = data[1];
      const footer = data[2];

      return of(null);
    })).toPromise();

    const doc = new Document({
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
          }
        ]
      }
    });


  }
}
