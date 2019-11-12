import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Booking } from '../../models/booking.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private bookingsCollection: AngularFirestoreCollection<Booking>;
  bookings: Observable<Booking[]>;

  constructor(private afs: AngularFirestore) {
    this.bookingsCollection = afs.collection<Booking>('Bookings');
    // this.bookings = this.bookingsCollection.valueChanges();
    this.bookings = this.bookingsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Booking;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getBookings() {
    return this.bookings;
  }
}
