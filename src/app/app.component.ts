import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  //rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log("MyApp loaded");


      const firebaseConfig = {
          apiKey: "AIzaSyChC62HAtPWAtFiJmcDlTGWwq_YFOjSNqE",
          authDomain: "protobike-1495735501799.firebaseapp.com",
          databaseURL: "https://protobike-1495735501799.firebaseio.com",
          projectId: "protobike-1495735501799",
          storageBucket: "protobike-1495735501799.appspot.com",
          messagingSenderId: "777348050122"
      };

      firebase.initializeApp(firebaseConfig);

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

