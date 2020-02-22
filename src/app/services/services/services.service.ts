import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from 'angularfire2/firestore';
import { Service } from '../../models/service.model';
import { map, take, tap, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private collectionPath = '/services';

  servicesCollection: AngularFirestoreCollection<Service>;

  constructor(private afs: AngularFirestore) {
    this.servicesCollection = afs.collection(this.collectionPath);
  }

  addService(service: Service) {
    return this.servicesCollection.add({ ...service });
  }

  updateService(id: string, value: any) {
    return this.servicesCollection.doc(id).update(value);
  }

  deleteService(id: string) {
    return this.servicesCollection.doc(id).delete();
  }

  getServiceByBid(bid: string): Observable<Service[]> {
    return this.afs
      .collection(this.collectionPath, ref => {
        return ref.where('bid', '==', bid);
      })
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Service;
            if (data.date) {
              data.date = (data.date as any).toDate();
            }
            const id = a.payload.doc.id;

            return { id, ...data };
          })
        )
      );
  }

  getLastServiceDate(bid: string): Promise<Date> {
    return this.getServiceByBid(bid)
      .pipe(
        take(1),
        map(services => services.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())),
        switchMap(services => {
          if (services && services.length > 0) {
            return of(services[0].date);
          } else {
            return of(null);
          }
        })
      ).toPromise();
  }

  getFirstServiceDate(bid: string): Promise<Date> {
    return this.getServiceByBid(bid)
      .pipe(
        take(1),
        map(services => services.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())),
        switchMap(services => {
          if (services && services.length > 0) {
            return of(services[0].date);
          } else {
            return of(null);
          }
        })
      ).toPromise();
  }
}
