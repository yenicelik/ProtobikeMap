import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

/*import {GoogleMapsClient} from '@google/maps';*/

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  map: any;

  constructor(public navCtrl: NavController, public geolocation: Geolocation) {
    console.log("Home page creater loaded");

  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit loaded");

    let mapEle = document.getElementById('map');

    let mapOpt = {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    };

    //Initializing the map
    this.map = new google.maps.Map(mapEle, mapOpt);

    //Adding a sample marker to the app
    var marker = new google.maps.Marker({
      position: {lat: -34.397, lng: 150.644},
      map: this.map,
      title: 'Hello World!'
    });

    this.geolocation.getCurrentPosition().then((position) => {
      let userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var userPosition = new google.maps.Marker({
        position: userLatLng,
        map: this.map,
        title: 'You position'
      })
      this.map.setCenter(userLatLng);

    }, (err) => {
      console.log(err);
    });


  }

}
