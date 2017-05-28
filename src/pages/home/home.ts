import {Component, ViewChild, ElementRef} from '@angular/core';
import {ModalController, Platform} from 'ionic-angular';
import {NavController, AlertController} from 'ionic-angular';

import {Geolocation} from '@ionic-native/geolocation';

/*import {GoogleMapsClient} from '@google/maps';*/
import {LoginPage} from '../login/login';
import {SinglebikePage} from '../singlebike/singlebike';

import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import * as firebase from 'firebase';

declare var google;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    @ViewChild('infoFooter') infoFooter: ElementRef;
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    userProfile: any;
    userLocation: any;
    curBooking: any = {
        data: null,
        usrProfileUid: null,
        usrProfileName: null,
        usrPositionLng: null,
        usrPositionLat: null,
        opts: null,
        showBackdrop: null,
        enableBackdropDismiss: null
    };

    bikeItems: FirebaseListObservable<any[]>;

    constructor(public navCtrl: NavController, public geolocation: Geolocation, public modalCtrl: ModalController, private alertCtrl: AlertController, private afDB: AngularFireDatabase) {
        console.log("Home page creater loaded");
        this.bikeItems = afDB.list('/bikes');
    }


    ngOnInit() {
        console.log("ngOnInit loaded");
    }


    ionViewDidLoad() {
        console.log("ngAfterViewInit loaded");

        let mapEle = document.getElementById('map');
        let mapOpt = {
            center: {lat: 47.376438, lng: 8.547957},
            zoom: 16,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            style: [
                {
                    "featureType": "poi",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                }
            ]
        };

        //Initializing the map
        this.map = new google.maps.Map(mapEle, mapOpt);


        console.log("Map initialization started");

        //Adding a sample marker to the app

        var begin = true;
        setInterval(() => {
            this.geolocation.getCurrentPosition().then((position) => {

                console.log("Location determined");
                this.userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                //TODO change this to user location
                console.log(this.userLocation);
                var userPositionMarker = new google.maps.Marker({
                    position: this.userLocation,
                    map: this.map,
                    title: 'Your position'
                });

                if (begin) {
                    //TODO: for deployment, uncomment this!
                    //this.map.setCenter(userLatLng);
                    begin = false;
                }

            }, (err) => {
                console.log("GeoLocation services failed");
                console.log(err);
            });
        }, 1000 * 10);

        this.map.setCenter({lat: 47.376600, lng: 8.547700});

        //After page has loaded, we ask the user for input!
        //TODO: remove this after marker was implemented
        let profileModal = this.modalCtrl.create(LoginPage);
        profileModal.onDidDismiss(data => {
            console.log(JSON.stringify(data));
            this.userProfile = data;
        });
        profileModal.present();

        //this.userProfile = this.navCtrl.push(LoginPage, {callback: getUserCallback});
        //TODO: implement a mechanism that skips this if existent
        //TODO: implement a mechanism that stops GPS recording while doing this

        this.addBikeMarkers();


    }

    addBikeMarkers() {
        //Add all bikes in here:

        try {
            this.bikeItems.forEach(bike => {
                console.log("\n");
                console.log("Firebase content: ");
                console.log(JSON.stringify(bike));



            });
        }
        catch (e) {
            console.log(e);
            console.log("End of error");
        }

        var bikePositionMarker = new google.maps.Marker({
            position: {lat: 47.376600, lng: 8.547700},
            map: this.map,
            title: 'Bike No 43364'
        });

        //The user must have set a location to use the bike, because this is how we will know where he left the bike...
        bikePositionMarker.addListener('click', () => {
            //infoWindow.open(this.map, bikePositionMarker);
            if (this.userLocation) {
                let bikeModal = this.modalCtrl.create(SinglebikePage, {
                    usrProfileUid: this.userProfile.uid,
                    usrProfileName: this.userProfile.displayName,
                    usrPositionLng: this.userLocation.lng(),
                    usrPositionLat: this.userLocation.lat()

                });
                bikeModal.onDidDismiss(data => {
                    console.log(JSON.stringify(data));
                    this.curBooking = data;
                    console.log(this.curBooking);
                });
                bikeModal.present();
            }
        });

    }

    stopRiding() {
        let alert = this.alertCtrl.create({
            title: 'Stop riding',
            message: 'Do you want to stop riding?', //TODO phrase this more friendly
            buttons: [
                {
                    text: 'Stop Riding',
                    handler: () => {
                        console.log('Stop riding');
                        //Update bike locations
                        this.updateBikeLocation();
                    }
                },
                {
                    text: 'Continue riding',
                    handler: () => {
                        console.log('Continue riding');
                        //Do nothing
                    }
                }
            ]
        });
        alert.present();
    }

    updateBikeLocation() {

        console.log("Updating bike data");
        let saveData = {
            bike_no: 0,
            current_user: "0",
            positionLat: 47.376650,
            positionLng: 8.547750,
            //TODO: uncomment for deployment
            //positionLat: this.userLocation.lat(),
            //positionLng: this.userLocation.lng()
        }
//        this.bikeItems.push({0: saveData});
//        bikeItems.remove('key-of-some-data');

        this.bikeItems.update("0", saveData);

        //console.log(JSON.stringify(position));
        //firebase.database().ref('bikes/0').set(saveData); //TODO extend this to multiple bikes //TODO add a 'sry, no gps, bike could not be booked' option


    }

}
