import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

import {Facebook} from '@ionic-native/facebook';
import firebase from 'firebase';

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

    constructor(public navCtrl: NavController, public navParams: NavParams, private facebook: Facebook, private viewCtrl: ViewController) {

    }

    ionViewWillEnter(){
        this.viewCtrl.showBackButton(false);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage entered');

    }

    facebookLogin(): void {
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

}
