import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { JsMapsProviderService } from './js-maps-provider.service';

import { HttpClient } from '@angular/common/http';

declare var google;

@Injectable()
export class MapsProviderService {

  map: any;
  marker: any;
  markers: any = [];

  constructor(public platform: Platform, private http: HttpClient) {

      this.map = new JsMapsProviderService();
      
  }

  init(location, element){
    let map = this.map.init(location, element);
    let latLng = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);

    let lat = location.coords.latitude;
    let lng = location.coords.longitude;
    var iconJs = {
        url: "../../assets/icon/dot-and-circle.png", // url
        scaledSize: new google.maps.Size(25, 25), // scaled size
    };

    this.marker = new google.maps.Marker({
      position: latLng,
      optimized: false,
      visible: true,
      icon: iconJs,
    });
    this.marker.setMap(map);

    this.getMarkers(map);

  }

  moveMarker(position) {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.marker.setPosition(latLng);
  }

  getMarkers(map) {
    let platform = this.platform;
    let graffitiMarker = null
    if (graffitiMarker !== null) {
        graffitiMarker.setMap(null);
    }
    this.http.get('http://139.99.97.36:8080/api/graffiti', {})
    .subscribe(data => {
      this.markers.push(data);
      this.markers.forEach(function (value, key) {
        value.forEach(function (value, key) {
          let latLng = new google.maps.LatLng(value.lat, value.lng);
          var iconJs = {
              url: "../../assets/icon/spray-can.png", // url
              scaledSize: new google.maps.Size(35, 35), // scaled size
          };
          let graffitiMarker = new google.maps.Marker({
            position: latLng,
            optimized: false,
            visible: true,
            animation: 'DROP',
            icon: iconJs,
          });
          graffitiMarker.setMap(map);
        });
      });
    }, error => {
        console.log(error); // error message as string
    });
  }


}
