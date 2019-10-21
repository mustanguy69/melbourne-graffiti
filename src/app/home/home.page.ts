import { Component, ViewChild, ElementRef, HostListener, AfterContentInit, OnInit } from '@angular/core';
import {NavController, PopoverController, Events, Platform} from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapsProviderService } from '../maps-provider.service';

import { NewGraffitiComponent } from '../new-graffiti/new-graffiti.component';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterContentInit {

  location: {
    latitude: number,
    longitude: number
  };

  markers: any = [];
  map: any;

  @ViewChild('map', {static: true}) private mapElement: ElementRef;

  constructor(
      public geolocation: Geolocation,
      public mapsProvider: MapsProviderService,
      private popoverController: PopoverController,
      public keyboard: Keyboard,
      public platform: Platform,
      public diagnostic: Diagnostic) {}

  ngOnInit(): void {
  }

  ngAfterContentInit(): void  {
    this.platform.ready().then(() => {
      this.diagnostic.isLocationAuthorized().then((isEnabled) => {
        if (isEnabled === true) {
          this.loadMap();
        } else {
          this.diagnostic.requestLocationAuthorization().then((status) => {
            this.loadMap();
          }).catch((e) => {
            console.log('location problem 4');
          });
        }
      }).catch((e) => {
        console.log('location problem 3');
      });
    });
  }

  loadMap() {
    this.map = this.mapsProvider.init(this.mapElement);
    const options = {
      enableHighAccuracy: true,
      timeout: 25000
    };
    this.geolocation.watchPosition(options).subscribe((position) => {
      this.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    });
  }

   async popNewGraffiti() {
      const popover = await this.popoverController.create({
        component: NewGraffitiComponent,
        componentProps: { lat: this.location.latitude, lng: this.location.longitude  },
        cssClass: 'popover_class',
      });

      popover.onDidDismiss()
          .then(() => {
            this.mapsProvider.getMarkers(this.map);
          });

      return await popover.present();

  }

}
