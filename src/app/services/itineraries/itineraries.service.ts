import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Itinerary } from '../../models/itinerary.model';


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
}
