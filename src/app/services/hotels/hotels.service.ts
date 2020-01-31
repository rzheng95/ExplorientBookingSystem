import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from 'angularfire2/firestore';
import { Hotel } from '../../models/hotel.model';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from '../../error/error.component';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {
  private collectionPath = '/hotels';

  hotelsCollection: AngularFirestoreCollection<Hotel>;

  constructor(private afs: AngularFirestore, private dialog: MatDialog) {
    this.hotelsCollection = afs.collection(this.collectionPath);
  }

  createHotel(hotel: Hotel) {
    this.hotelsCollection.add({ ...hotel });
  }

  getHotels() {
    return this.afs
      .collection(this.collectionPath)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Hotel;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getHotelNames() {
    return this.afs.collection(this.collectionPath, ref => {
      return ref.orderBy('hotelName');
    }).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const id = a.payload.doc.id;
            const hotelName = (a.payload.doc.data() as Hotel).hotelName;
            return { id, hotelName };
          }))
        );
  }

  getHotelNameById(hid: string) {
    return this.afs.collection(this.collectionPath).doc(hid).ref.get();
  }

  getHotelById(id: string) {
    return this.hotelsCollection.doc(id).valueChanges();
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
}
