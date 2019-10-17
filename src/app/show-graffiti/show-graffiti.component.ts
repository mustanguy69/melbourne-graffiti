import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, Events, Platform, LoadingController , NavController } from '@ionic/angular';

import { FilePath } from '@ionic-native/file-path/ngx';


declare let window: any;

@Component({
  selector: 'app-show-graffiti',
  templateUrl: './show-graffiti.component.html',
  styleUrls: ['./show-graffiti.component.scss']
})
export class ShowGraffitiComponent implements OnInit {
  page;
  name: string;
  artist: string;
  description: string;
  lat: number;
  lng: number;
  photo: any;
  status: any = 0;

  constructor(
    private events: Events,
    private navParams: NavParams,
    private nav: NavController,
    private popoverController: PopoverController,
    public platform: Platform,
    private filePath: FilePath,
    private loadingController: LoadingController) {
      this.lat = this.navParams.data.lat;
      this.lng = this.navParams.data.lng;
  }

  ngOnInit() {
    // Get data from popover page
    this.page = this.navParams.get('data');
  }

  closeShowGraffiti() {
    this.popoverController.dismiss();
  }


}
