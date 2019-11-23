import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from 'angularfire2/firestore';
import { Passenger } from '../../models/passenger.model';
import { MatDialog } from '@angular/material';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PassengersService {
  private collectionPath = '/passengers';

  passengersCollection: AngularFirestoreCollection<Passenger>;

  constructor(private afs: AngularFirestore, private dialog: MatDialog) {
    this.passengersCollection = afs.collection(this.collectionPath);
  }

  addPassenger(passenger: Passenger) {
    return this.passengersCollection.add({ ...passenger });
  }

  getPassengersByBid(bid: string) {
    return this.afs.collection(this.collectionPath, ref => {
      return ref.where('bid', '==', bid);
    }).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Passenger;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  updatePassenger(id: string, value: any) {
    return this.passengersCollection.doc(id).update(value);
  }

  deletePassenger(id: string) {
    return this.passengersCollection.doc(id).delete();
  }
}
