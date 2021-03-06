import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';
import { Booking } from '../../models/booking.model';
import { ErrorComponent } from '../../error/error.component';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private collectionPath = '/bookings';

  bookingsCollection: AngularFirestoreCollection<Booking>;

  constructor(private afs: AngularFirestore, private dialog: MatDialog) {
    this.bookingsCollection = afs.collection(this.collectionPath);
  }

  createBooking(booking: Booking) {
    this.bookingsCollection.add({ ...booking });
  }

  updateBooking(id: string, value: any): Promise<void> {
    return this.bookingsCollection.doc(id).update(value);
  }

  deleteBooking(id: string): Promise<void> {
    return this.bookingsCollection.doc(id).delete();
  }


  getBookingsOrderBy(orderBy: string) {
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

  getBookingById(id: string): Observable<Booking> {
    // return this.afs.collection(this.collectionPath, ref => ref.where(field, '==', data)).valueChanges();
    return this.bookingsCollection.doc(id).valueChanges() as Observable<Booking>;
  }

  showDialogMessage(title: string, message: string) {
    if (!title) {
      title = 'An error occured!';
    }
    this.dialog.open(ErrorComponent, {
      data: {
        title,
        message
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
