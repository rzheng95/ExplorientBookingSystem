import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Booking } from '../../models/booking.model';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from '../../error/error.component';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private collectionPath = '/bookings';
  private bookings: Booking[] = [];

  bookingsCollection: AngularFirestoreCollection<Booking>;

  constructor(private afs: AngularFirestore, private dialog: MatDialog) {
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


  getBookingsOrderBy(orderBy: string) {
    console.log('reading in bookingsService');
    return this.afs.collection(this.collectionPath, ref => {
      return ref.orderBy(orderBy);
    }).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Booking;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        );
  }

  // getBookingByContactName(contactName: string) {
  //   return this.afs.collection(this.collectionPath, ref => ref.where('contactName', '==', contactName)).valueChanges();
  // }

  showDialogMessage(title: string, message: string) {
    if (!title) {
      title = 'An error occured!';
    }
    this.dialog.open(ErrorComponent, {
      data: {
        title: title,
        message: message
      }
    });
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
