import { Component, OnInit, OnDestroy} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { User } from 'src/app/models/user.model';
import { nav } from 'src/environments/nav';



@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  private authListenerSubs: Subscription;
  user: User;
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

  get nav() {
    return nav;
  }

  toggleBookings() {
    nav.isBookingsToggled = !nav.isBookingsToggled;
    nav.isPassengersToggled = false;
    nav.isHotelsToggled = false;
    nav.isVendorsToggled = false;
  }

  togglePassengers() {
    nav.isPassengersToggled = !nav.isPassengersToggled;
    nav.isBookingsToggled = false;
    nav.isHotelsToggled = false;
    nav.isVendorsToggled = false;
  }

  toggleHotels() {
    nav.isHotelsToggled = !nav.isHotelsToggled;
    nav.isBookingsToggled = false;
    nav.isPassengersToggled = false;
    nav.isVendorsToggled = false;
  }

  toggleVendors() {
    nav.isVendorsToggled = !nav.isVendorsToggled;
    nav.isBookingsToggled = false;
    nav.isHotelsToggled = false;
    nav.isPassengersToggled = false;
  }

  onLogout() {
    this.isAuthenticated = false;
    this.authService.SignOut();
  }

  ngOnDestroy() {
    if (this.authListenerSubs) {
      this.authListenerSubs.unsubscribe();
    }
  }
}
