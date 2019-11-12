import { Injectable, NgZone } from '@angular/core';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userData: User; // Save logged in user data
  private authStatusListener = new Subject<boolean>();

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
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

  autoAuthUser() {

  }

  // Sign in with email/password
  async SignIn(email, password) {
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(
        email,
        password
      );
      this.ngZone.run(() => {
        this.router.navigate(['dashboard']);
      });
      this.SetUserData(result.user);
      this.authStatusListener.next(true);
    } catch (error) {
      window.alert(error.message);
      this.authStatusListener.next(false);
    }
  }

  // Sign up with email/password
  async SignUp(email, password) {
    const domain = email.substring(email.lastIndexOf('@') + 1);
    // if (domain !== 'uconn.edu') {
    //   console.log('access denied');
    //   return;
    // }
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(
        email,
        password
      );
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
      window.alert(error.message);
    }
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
      window.alert('Password reset email sent, check your inbox.');
    } catch (error) {
      window.alert(error);
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
    this.authStatusListener.next(false);
    localStorage.removeItem('user');
    this.router.navigate(['sign-in']);
  }
}
