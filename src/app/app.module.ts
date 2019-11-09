import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { BookingsComponent } from './components/bookings/bookings.component';
import { BookingsService } from './services/bookings.service';

@NgModule({
  declarations: [
    AppComponent,
    BookingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase, 'ExplorientBookingSystem'),
    AngularFirestoreModule
  ],
  providers: [
    BookingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
