import { Component, OnInit, OnDestroy} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { User } from 'src/app/models/user.model';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  private authListenerSubs: Subscription;
  user: User;
  isBookingsToggled = false;
  isPassengersToggled = false;
  isHotelsToggled = false;
  isVendorsToggled = false;
  dropdownArrow = 'keyboard_arrow_right';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUserData();
    this.isAuthenticated = this.authService.isAuthenticated;
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  toggleBookings() {
    this.isBookingsToggled = !this.isBookingsToggled;
  }

  togglePassengers() {
    this.isPassengersToggled = !this.isPassengersToggled;
  }

  toggleHotels() {
    this.isHotelsToggled = !this.isHotelsToggled;
  }

  toggleVendors() {
    this.isVendorsToggled = !this.isVendorsToggled;
  }

  onLogout() {
    this.isAuthenticated = false;
    this.authService.SignOut();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
