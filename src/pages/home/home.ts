import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {Geolocation} from '@ionic-native/geolocation';

/*import {GoogleMapsClient} from '@google/maps';*/
import { LoginPage } from '../login/login';

declare var google;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    map: any;
    userProfile: any;

    constructor(public navCtrl: NavController, public geolocation: Geolocation) {
        console.log("Home page creater loaded");


    }

    //Get userProfile callback function
    /*getUserProfile = (_params) => {
        return new Promise((resolve, reject) => {
           this.userProfile = _params;
           resolve();
        });
    }*/

    /*loadMap() {
        console.log("loadMap entered");

        let mapEle = document.getElementById('map');

        //Option for when location service is enabled

        //Option for when location service is disabled
    }*/



    ngOnInit() {
        console.log("ngOnInit loaded");
    }

    ngAfterViewInit() {

        console.log("ngAfterViewInit loaded");

        let mapEle = document.getElementById('map');

        //Adding a sample marker to the app
        this.geolocation.getCurrentPosition().then((position) => {

            console.log("Location determined");
            let userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            let mapOpt = {
                center: userLatLng,
                zoom: 15,
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
            };

            //Initializing the map
            this.map = new google.maps.Map(mapEle, mapOpt);


            console.log("Map initialization started");

            var userPosition = new google.maps.Marker({
                position: userLatLng,
                map: this.map,
                title: 'You position'
            });

        }, (err) => {
            console.log(err);
        });

        //After page has loaded, we ask the user for input!
        this.navCtrl.push(LoginPage, {userProfile: null});

    }

}
