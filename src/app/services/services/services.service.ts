import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Service } from '../../models/service.model';
import { map } from 'rxjs/operators';

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
    this.servicesCollection.add({ ...service });
  }

  getServiceByBid(bid: string) {
    return this.afs.collection(this.collectionPath, ref => {
      return ref.where('bid', '==', bid);
    }).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Service;
        data.date = (data.date as any).toDate();
        const id = a.payload.doc.id;

        return { id, ...data };
      }))
    );
  }

}
