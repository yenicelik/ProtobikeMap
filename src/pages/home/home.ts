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
    curBooking: any = null;/*{
        data: null,
        usrProfileUid: null,
        usrProfileName: null,
        usrPositionLng: null,
        usrPositionLat: null,
        opts: null,
        showBackdrop: null,
        enableBackdropDismiss: null
    };*/
    markersList: any;
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
        this.infoFooter.nativeElement.classList.add('keyboardopen');


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

            console.log("Current booking is: ");
            console.log(this.curBooking);
            console.log("\n");

            this.geolocation.getCurrentPosition().then((position) => {

                console.log("Location determined");
                this.userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                console.log(this.userLocation);
                var userPositionMarker = new google.maps.Marker({
                    position: this.userLocation,
                    map: this.map,
                    title: 'Your position'
                });

                if (begin) {
                    this.map.setCenter(this.userLocation);
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

        setInterval(() => {
            this.addBikeMarkers();
        },1000 * 10);


    }

    addBikeMarkers() {
        //Add all bikes in here:

        try {

            //this.map.clearOverlays(); //does this function even exist?

            this.bikeItems.forEach(bike => {
                console.log("\n");
                console.log("Firebase content: ");
                console.log(JSON.stringify(bike[0]));

                //TODO skip if owner is not "0"

                var bikePositionMarker = new google.maps.Marker({
                    position: {lat: bike[0].positionLat, lng: bike[0].positionLng},
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
                            this.infoFooter.nativeElement.classList.remove('keyboardopen');
                            console.log(this.curBooking);
                        });
                        bikeModal.present();
                    }
                });


                //this.markersList.push(bikePositionMarker);


            });
        }
        catch (e) {
            console.log("Start of error");
            console.log(e.message);
            console.log("End of error");
        }


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
        this.infoFooter.nativeElement.classList.add('keyboardopen');
    }

    updateBikeLocation() {

        console.log("Updating bike data");
        let saveData = {
            bike_no: 0,
            current_user: "0",
            //positionLat: 47.376650,
            //positionLng: 8.547750,
            //TODO: uncomment for deployment
            positionLat: this.userLocation.lat(),
            positionLng: this.userLocation.lng()
        }
//        this.bikeItems.push({0: saveData});
//        bikeItems.remove('key-of-some-data');

        this.bikeItems.update("0", saveData);

        //console.log(JSON.stringify(position));
        //firebase.database().ref('bikes/0').set(saveData); //TODO extend this to multiple bikes //TODO add a 'sry, no gps, bike could not be booked' option


    }

}
