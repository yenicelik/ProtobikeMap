import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import {Facebook} from '@ionic-native/facebook';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    userProfile: any = null;

    constructor(public navCtrl: NavController, public navParams: NavParams, private facebook: Facebook, private viewCtrl: ViewController, private afAuth: AngularFireAuth) {
        /*
         afAuth.authState.subscribe(user => {
         if (!user) {
         this.displayName = null;
         return;
         }
         this.displayName = user.displayName;
         });
         */
    }

    ionViewWillEnter(){
        this.viewCtrl.showBackButton(false);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage entered');

    }

    facebookLogin(): void {
         //See if this is needed anywhere now...
        this.facebook.login(['email']).then( (response) => {
            console.log("Facebook logging in...");

            const facebookCredential = firebase.auth.FacebookAuthProvider.
                credential(response.authResponse.accessToken);

            firebase.auth().signInWithCredential(facebookCredential).
                then((success) => {
                console.log("Firebase success: " + JSON.stringify(success.displayName));
                this.userProfile = success;

                this.viewCtrl.dismiss(this.userProfile);

            }).
                catch((error) => {
                console.log("Firebase failure: " + JSON.stringify(error));
            });
        }).catch((error) => { console.log(error) });
    }

    //Sign out
    signOut() {
        this.afAuth.auth.signOut();
    }

}
