import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { JsMapsProviderService } from './js-maps-provider.service';
import { NativeMapsProviderService } from './native-maps-provider.service';
import { GoogleMaps, Marker } from '@ionic-native/google-maps';
import { HttpClient } from '@angular/common/http';

declare var google;

@Injectable()
export class MapsProviderService {

  map: any;
  marker: any;
  markers: any = [];

  constructor(public platform: Platform, private http: HttpClient) {
    if(this.platform.is('cordova') &&
      (this.platform.is('ios') || this.platform.is('android'))){
      this.map = new NativeMapsProviderService(GoogleMaps);
    } else {
      this.map = new JsMapsProviderService();
    }
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

    if(this.platform.is('cordova') &&
      (this.platform.is('ios') || this.platform.is('android'))){
        let markerNative: Marker = map.addMarkerSync({
            icon: {
              url: 'assets/icon/dot-and-circle.png',
              size: {
                width: 25,
                height: 25,
              },
            },
            position: {lat: lat, lng: lng}
        });

        this.marker = markerNative;

    } else {
      this.marker = new google.maps.Marker({
        position: latLng,
        optimized: false,
        visible: true,
        icon: iconJs,
      });
      this.marker.setMap(map);
    }

    this.getMarkers(map);

  }

  moveMarker(position) {

      if(this.platform.is('cordova') &&
        (this.platform.is('ios') || this.platform.is('android'))){
          this.marker.setPosition({ lat: position.coords.latitude, lng: position.coords.longitude});
      } else {
          let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.marker.setPosition(latLng);
      }


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
          if(platform.is('cordova') &&
            (platform.is('ios') || platform.is('android'))){
              let graffitiMarker: Marker = map.addMarkerSync({
                  animation: 'DROP',
                  position: { lat: value.lat, lng: value.lng},
                  icon: "assets/icon/spray-can.png",
                  size: {
                    width: 28,
                    height: 28,
                  },
              });

          } else {
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
          }
        })
      });
    }, error => {
        console.log(error); // error message as string
    });
  }


}
