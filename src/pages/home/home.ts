import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  map: any;

  constructor(public navCtrl: NavController) {
    console.log("Home page creater loaded");

  }

  ngOnInit() {
    console.log("ngOnInit loaded");

  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit loaded");

    let mapEle = document.getElementById('map');

    let mapOpt = {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    };


    this.map = new google.maps.Map(mapEle, mapOpt);

  }

}
