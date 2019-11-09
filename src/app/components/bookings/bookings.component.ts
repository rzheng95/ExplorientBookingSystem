import { Component, OnInit } from '@angular/core';
import { BookingsService } from 'src/app/services/bookings.service';
import { Booking } from 'src/app/models/booking';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  constructor(private bookingsService: BookingsService) { }

  private bookings: Booking[];

  ngOnInit() {
    this.bookingsService.getBookings().subscribe(bkgs => {
      console.log(bkgs);
    });
  }

}
