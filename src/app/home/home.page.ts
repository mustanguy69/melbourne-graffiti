import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NavController, PopoverController, Events } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapsProviderService } from '../maps-provider.service';

import { NewGraffitiComponent } from '../new-graffiti/new-graffiti.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  location: {
    latitude: number,
    longitude: number
  };

  markers: any = [];
  map: any;

  @ViewChild('map', {static: true}) private mapElement: ElementRef;

  constructor(
      public navCtrl: NavController,
      public geolocation: Geolocation,
      public mapsProvider: MapsProviderService,
      private popoverController: PopoverController,
      private events: Events) {}

  ngOnInit() {
    this.findUserLocation();
  }

  findUserLocation(){
    let options = {
      enableHighAccuracy: true,
      timeout: 25000
    };

    //LocationService.getMyLocation().then((myLocation: MyLocation) => {
    this.geolocation.getCurrentPosition(options).then((position) => {

      this.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      this.map = this.mapsProvider.init(position, this.mapElement);

    });

    this.geolocation.watchPosition(options).subscribe((position) => {
      this.mapsProvider.moveMarker(position);
    })
  }


  async popNewGraffiti(ev: any) {
      const popover = await this.popoverController.create({
        component: NewGraffitiComponent,
        event: ev,
        componentProps: { lat: this.location.latitude, lng: this.location.longitude  },
        cssClass: 'popover_class',
      });

      popover.onDidDismiss()
      .then((result) => {
        console.log('test')
        this.mapsProvider.getMarkers(this.map);
      });

      return await popover.present();
  }

}
