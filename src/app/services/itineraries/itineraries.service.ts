import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Itinerary } from '../../models/itinerary.model';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ItinerariesService {
  private collectionPath = '/itineraries';

  itinerariesCollection: AngularFirestoreCollection<Itinerary>;

  constructor(private afs: AngularFirestore) {
    this.itinerariesCollection = afs.collection(this.collectionPath);
  }

  addItinerary(itinerary: Itinerary) {
    return this.itinerariesCollection.add({ ...itinerary });
  }

  updateItinerary(id: string, value: any) {
    return this.itinerariesCollection.doc(id).update(value);
  }

  deleteItinerary(id: string) {
    return this.itinerariesCollection.doc(id).delete();
  }

  getItineraryByBid(bid: string): Observable<Itinerary> {
    return this.afs.collection(this.collectionPath, ref => {
      return ref.where('bid', '==', bid);
    }).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Itinerary;
        const id = a.payload.doc.id;
        return { id, ...data };
      })),
      switchMap(itineraries => {
        if (itineraries && itineraries.length > 0) {
          // return this first one
          return of(itineraries[0] as Itinerary) as Observable<Itinerary>;
        } else {
          return of(null) as Observable<Itinerary>;
        }
      })
    );
  }
}
