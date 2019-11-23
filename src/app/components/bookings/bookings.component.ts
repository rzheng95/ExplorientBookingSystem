import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../../services/bookings/bookings.service';
import { Booking } from '../../models/booking.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  constructor(private bookingsService: BookingsService) { }

  bookings: Observable<Booking[]>;

  ngOnInit() {
    this.bookings = this.bookingsService.getBookingsOrderBy('contactName');
  }


}
