import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Booking } from '../../models/booking.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private collectionPath = '/bookings';

  bookingsCollection: AngularFirestoreCollection<Booking>;

  constructor(private afs: AngularFirestore) {
    this.bookingsCollection = afs.collection(this.collectionPath);
  }

  createBooking(booking: Booking) {
    this.bookingsCollection.add({ ...booking });
  }

  updateBooking(key: string, value: any): Promise<void> {
    return this.bookingsCollection.doc(key).update(value);
  }

  deleteBooking(key: string): Promise<void> {
    return this.bookingsCollection.doc(key).delete();
  }

  getBookings() {
    return this.bookingsCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Booking;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        );
  }

  // private bookingsCollection: AngularFirestoreCollection<Booking>;
  // bookings: Observable<Booking[]>;

  // constructor(private afs: AngularFirestore) {
  //   this.bookingsCollection = afs.collection<Booking>('Bookings');
  //   // this.bookings = this.bookingsCollection.valueChanges();
  //   this.bookings = this.bookingsCollection.snapshotChanges().pipe(
  //     map(actions => actions.map(a => {
  //       const data = a.payload.doc.data() as Booking;
  //       const id = a.payload.doc.id;
  //       return { id, ...data };
  //     }))
  //   );
  // }

  // getBookings() {
  //   return this.bookings;
  // }
}
