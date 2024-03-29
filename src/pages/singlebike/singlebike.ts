import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';


import * as firebase from 'firebase';


/**
 * Generated class for the SinglebikePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'page-singlebike',
    templateUrl: 'singlebike.html',
})
export class SinglebikePage {

    bikeItems: FirebaseListObservable<any[]>;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private viewCtrl: ViewController, private afDB: AngularFireDatabase) {
        //just as a test
        //TODO remove this for deployment
        this.bikeItems = afDB.list('/bikes');

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SinglebikePage');
    }

    bookBike() {
        console.log("All nav params is:  ");
        console.log(JSON.stringify(this.navParams));

        //TODO: We must make sure that both functions have successfully worked out!
        //TODO: add time
        let saveData = {
            bike_no: 0,
            current_user: this.navParams.get('usrProfileUid'),
            positionLat: this.navParams.get('usrPositionLat'),
            positionLng: this.navParams.get('usrPositionLng')
        };

        //console.log(JSON.stringify(position));
        this.bikeItems.update("0", saveData);

        console.log("Pushing to database should have been successful now");

        //ref('bikes/0').set(saveData); //TODO extend this to multiple bikes //TODO add a 'sry, no gps, bike could not be booked' option

        let bookingCode = this.alertCtrl.create({
            title: 'The code for this bike is 4391', //TODO check if this is the correct code..
            buttons: ['OK']
        });
        bookingCode.present();

        //passcode is bike-specific and should be retrieved, never set..
        this.viewCtrl.dismiss({bikeNo: 0, success: true, bikeCode: 4391});

    }

}
