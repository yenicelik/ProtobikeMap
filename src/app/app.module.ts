import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {Geolocation} from '@ionic-native/geolocation';

import {Facebook} from '@ionic-native/facebook';

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
        IonicModule.forRoot(MyApp)
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
