import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Vendor } from '../../models/vendor.model';
import { ErrorComponent } from '../../error/error.component';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {

  private collectionPath = '/vendors';

  vendorsCollection: AngularFirestoreCollection<Vendor>;

  constructor(private afs: AngularFirestore, private dialog: MatDialog) {
    this.vendorsCollection = afs.collection(this.collectionPath);
  }

  createVendor(vendor: Vendor) {
    this.vendorsCollection.add({ ...vendor });
  }

  getVendorNames() {
    console.log('getting vendor names....');
    return this.afs.collection(this.collectionPath, ref => {
      return ref.orderBy('vendorName');
    }).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const id = a.payload.doc.id;
            const vendorName = (a.payload.doc.data() as Vendor).vendorName;
            return { id, vendorName };
          }))
        );
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
