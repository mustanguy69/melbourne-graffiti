import { Platform, PopoverController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { JsMapsProviderService } from './js-maps-provider.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { HttpClient } from '@angular/common/http';
import {ShowGraffitiComponent} from './show-graffiti/show-graffiti.component';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import {NewGraffitiComponent} from './new-graffiti/new-graffiti.component';


declare var google;

@Injectable()
export class MapsProviderService {

  map: any;
  marker: any;
  markers: any = [];
  location: {
    latitude: number,
    longitude: number
  };
  latLng: any;

  constructor(public platform: Platform,
              private http: HttpClient,
              public popoverController: PopoverController,
              public geolocation: Geolocation,
              public diagnostic: Diagnostic) {
      this.map = new JsMapsProviderService();
  }

  init(element) {
    const map = this.map.init(element);
    const options = {
      enableHighAccuracy: true,
      timeout: 25000
    };
    this.geolocation.getCurrentPosition(options).then((position) => {
      this.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      this.latLng = new google.maps.LatLng(this.location.latitude, this.location.longitude);
      map.setCenter(this.latLng);
      const iconJs = {
        url: '../../assets/icon/dot-and-circle.png', // url
        scaledSize: new google.maps.Size(25, 25), // scaled size
      };

      this.marker = new google.maps.Marker({
        position: this.latLng,
        optimized: false,
        visible: true,
        icon: iconJs,
      });

      this.marker.setMap(map);

      this.geolocation.watchPosition(options).subscribe((position2) => {
        this.moveMarker(position2);
      });

      this.getMarkers(map);

    });
  }

  moveMarker(position) {
      const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.marker.setPosition(latLng);
  }

  getMarkers(map) {
    this.http.get('http://139.99.97.36:8080/api/graffiti', {})
    .subscribe(data => {
      this.markers.push(data);
      this.markers.forEach((value1) => {
        value1.forEach((value) => {
          const latLng = new google.maps.LatLng(value.lat, value.lng);
          const iconJs = {
              url: '../../assets/icon/spray-can.png', // url
              scaledSize: new google.maps.Size(35, 35), // scaled size
          };
          const graffitiMarker = new google.maps.Marker({
            position: latLng,
            optimized: false,
            visible: true,
            animation: 'DROP',
            icon: iconJs,
          });
          graffitiMarker.setMap(map);
          google.maps.event.addListener(graffitiMarker, 'click', () => {
            this.popShowGraffiti(value.name, value.artist, value.description, value.photo);
          });
        });
      });
    }, error => {
        console.log(error); // error message as string
    });
  }

  async popShowGraffiti(name, artist, description, photo) {
    const popover = await this.popoverController.create({
      component: ShowGraffitiComponent,
      componentProps: { name, artist, description, photo  },
      cssClass: 'popover_class',
    });

    return await popover.present();
  }


}
