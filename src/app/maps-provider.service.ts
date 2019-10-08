import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { JsMapsProviderService } from './js-maps-provider.service';
import { NativeMapsProviderService } from './native-maps-provider.service';
import { GoogleMaps, Marker } from '@ionic-native/google-maps';

declare var google;

@Injectable()
export class MapsProviderService {

  map: any;
  marker: any;

  constructor(public platform: Platform) {
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

}
