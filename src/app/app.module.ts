import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';

import { MapsProviderService } from './maps-provider.service';
import { JsMapsProviderService } from './js-maps-provider.service';

import { NewGraffitiComponent } from './new-graffiti/new-graffiti.component';
import { ShowGraffitiComponent } from './show-graffiti/show-graffiti.component';

import { Camera } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';


import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FilePath } from '@ionic-native/file-path/ngx';

@NgModule({
  declarations: [AppComponent, NewGraffitiComponent, ShowGraffitiComponent],
  entryComponents: [NewGraffitiComponent, ShowGraffitiComponent],
  imports: [BrowserModule, IonicModule.forRoot({backButtonText: 'Retour',scrollPadding: false,scrollAssist: true}), AppRoutingModule, FormsModule, HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    HTTP,
    MapsProviderService,
    JsMapsProviderService,
    Camera,
    FileTransfer,
    FilePath,
    Crop
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
