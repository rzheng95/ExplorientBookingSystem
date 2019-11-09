import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking';


@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private bookingsCollection: AngularFirestoreCollection<Booking>;
  bookings: Observable<Booking[]>;

  constructor(private afs: AngularFirestore) {
    this.bookingsCollection = afs.collection<Booking>('Bookings');
    this.bookings = this.bookingsCollection.valueChanges();
  }

  getBookings() {
    return this.bookings;
  }
}
