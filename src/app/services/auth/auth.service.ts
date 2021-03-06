import { Injectable, NgZone, HostListener, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from '../../error/error.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private userData: User; // Save logged in user data
  private authStatusListener = new Subject<boolean>();
  private authSub: Subscription;
  private signUpEmail: string;
  private userActivity;
  private userInactive: Subject<any> = new Subject();
  private userSub: Subscription;
  private isAuth = false;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public dialog: MatDialog
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));

        this.userSub = this.userInactive.subscribe(() => {
          if (this.isAuth) {
            this.isAuth = false;
            this.SignOut();
            this.showErrorMessage(
              'Inactivity',
              'You have been logged out due to inactivity.'
            );
          }
        });
        // JSON.parse(localStorage.getItem('user'));
      }
    });

    this.authSub = this.authStatusListener.subscribe(isAuth => {
      this.isAuth = isAuth;
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.userSub.unsubscribe();
  }

  clearTimeout() {
    clearTimeout(this.userActivity);
  }

  setTimeout(expireIn: number) {
    this.userActivity = setTimeout(() => {
      this.userInactive.next(undefined);
    }, expireIn * 1000);
  }

  showErrorMessage(title: string, message: string) {
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

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserData() {
    if (!this.isAuthenticated) {
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  // Sign in with email/password
  async SignIn(email, password) {
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(
        email,
        password
      );
      this.ngZone.run(() => {
        this.router.navigate(['/dashboard/']);
      });
      this.SetUserData(result.user);
      this.authStatusListener.next(true);
    } catch (error) {
      // window.alert(error.message);
      this.authStatusListener.next(false);
      this.showErrorMessage(null, error.message);
    }
  }

  // Sign up with email/password
  async SignUp(email, password) {
    const domain = email.substring(email.lastIndexOf('@') + 1);
    if (domain === 'uconn.edu' || domain === 'explorient.com') {
      try {
        const result = await this.afAuth.auth.createUserWithEmailAndPassword(
          email,
          password
        );
        this.signUpEmail = email;
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();
        const user: User = {
          uid: result.user.uid,
          email: result.user.email,
          emailVerified: result.user.emailVerified
        };
        this.SetUserData(user);
      } catch (error) {
        this.showErrorMessage(null, error.message);
      }
    } else {
      console.log('access denied');
      return;
    }
  }

  getSignUpEmail() {
    return this.signUpEmail;
  }

  // Send email verfificaiton when new user sign up
  async SendVerificationMail() {
    await this.afAuth.auth.currentUser.sendEmailVerification();
    this.router.navigate(['verify-email-address']);
  }

  // Reset Forggot password
  async ForgotPassword(passwordResetEmail) {
    try {
      await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
      this.showErrorMessage(
        'Email Sent',
        'Password reset email sent, check your inbox.'
      );
    } catch (error) {
      this.showErrorMessage(null, error.message);
    }
  }

  // Returns true when user is looged in and email is verified
  get isAuthenticated(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null && user.emailVerified !== false ? true : false;
  }

  /*
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  async AuthLogin(provider) {
    try {
      const result = await this.afAuth.auth.signInWithPopup(provider);
      this.ngZone.run(() => {
        this.router.navigate(['dashboard']);
      });
      this.SetUserData(result.user);
    } catch (error) {
      window.alert(error);
    }
  }
*/

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: User) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge: true
    });
  }

  // Sign out
  async SignOut() {
    await this.afAuth.auth.signOut();
    this.isAuth = false;
    this.authStatusListener.next(false);
    localStorage.removeItem('user');
    this.router.navigate(['sign-in']);
  }



}
