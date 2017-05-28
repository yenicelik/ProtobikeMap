import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {Geolocation} from '@ionic-native/geolocation';
import {Facebook} from '@ionic-native/facebook';


import {AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {LoginPage} from '../pages/login/login';
import {SinglebikePage} from '../pages/singlebike/singlebike';


@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LoginPage,
        SinglebikePage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp({
            apiKey: "AIzaSyChC62HAtPWAtFiJmcDlTGWwq_YFOjSNqE",
            authDomain: "protobike-1495735501799.firebaseapp.com",
            databaseURL: "https://protobike-1495735501799.firebaseio.com",
            projectId: "protobike-1495735501799",
            storageBucket: "protobike-1495735501799.appspot.com",
            messagingSenderId: "777348050122"
        }),
        AngularFireDatabaseModule,
        AngularFireAuthModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        SinglebikePage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        Facebook,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
