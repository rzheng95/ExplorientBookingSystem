import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Vendor } from '../../models/vendor.model';
import { ErrorComponent } from '../../error/error.component';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

  updateVendor(id: string, value: any): Promise<void> {
    return this.vendorsCollection.doc(id).update(value);
  }

  getVendorNames() {
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

  getVendors() {
    return this.afs
      .collection(this.collectionPath)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Vendor;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getVendorNameById(vid: string) {
    return this.afs.collection(this.collectionPath).doc(vid).ref.get();
  }

  getVendorById(id: string): Observable<Vendor> {
    return this.vendorsCollection.doc(id).valueChanges() as Observable<Vendor>;
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
