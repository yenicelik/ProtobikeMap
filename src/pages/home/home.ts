import {Component, ViewChild, ElementRef} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {NavController} from 'ionic-angular';

import {Geolocation} from '@ionic-native/geolocation';

/*import {GoogleMapsClient} from '@google/maps';*/
import {LoginPage} from '../login/login';
import {SinglebikePage} from '../singlebike/singlebike';

declare var google;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    userProfile: any;
    userLocation: any;
    curBooking: any;


    constructor(public navCtrl: NavController, public geolocation: Geolocation, public modalCtrl: ModalController) {
        console.log("Home page creater loaded");
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


        var bikePositionMarker = new google.maps.Marker({
            position: {lat: 47.376600, lng: 8.547700},
            map: this.map,
            title: 'Bike No 43364'
        });

        this.map.setCenter({lat: 47.376600, lng: 8.547700});

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
                profileModal.onDidDismiss(data => {
                    console.log(JSON.stringify(data));
                    this.curBooking = data;
                    console.log(this.curBooking);
                });
                bikeModal.present();
            }
        });

        //After page has loaded, we ask the user for input!
        //TODO: remove this after marker was implemented
        let profileModal = this.modalCtrl.create(LoginPage);
        profileModal.onDidDismiss(data => {
            console.log(JSON.stringify(data));
            this.userProfile = data
        });
        profileModal.present();

        //this.userProfile = this.navCtrl.push(LoginPage, {callback: getUserCallback});
        //TODO: implement a mechanism that skips this if existent
        //TODO: implement a mechanism that stops GPS recording while doing this
    }

}
