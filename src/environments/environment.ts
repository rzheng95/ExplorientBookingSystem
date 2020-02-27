// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDkXsd4nBVHkgGBW7rYtg78awRaicXsPm0',
    authDomain: 'explorientbookingsystem.firebaseapp.com',
    databaseURL: 'https://explorientbookingsystem.firebaseio.com',
    projectId: 'explorientbookingsystem',
    storageBucket: 'explorientbookingsystem.appspot.com',
    messagingSenderId: '437643661769',
    appId: '1:437643661769:web:1da0f7c14cd94c0dca1818',
    measurementId: 'G-B4YM0DJMZ3'
  },
  sessionExpiration: 900,  // In seconds,
  itineraryHeaderImageUrl: 'https://i.imgur.com/tkhpaVJ.png',
  itineraryFooterImageUrl: 'https://i.imgur.com/zEtRFeM.png',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
