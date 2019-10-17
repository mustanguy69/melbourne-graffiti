import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, Events, Platform, LoadingController , NavController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FilePath } from '@ionic-native/file-path/ngx';
import { MapsProviderService } from '../maps-provider.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';

declare let window: any;

@Component({
  selector: 'app-new-graffiti',
  templateUrl: './new-graffiti.component.html',
  styleUrls: ['./new-graffiti.component.scss']
})
export class NewGraffitiComponent implements OnInit {
  page;
  base64Image: SafeResourceUrl;
  name: string;
  artist: string;
  description: string;
  lat: number;
  lng: number;
  photo: any;
  status: any = 0;
  loaderToShow: any;
  error: string;

  constructor(
    private events: Events,
    private navParams: NavParams,
    private nav: NavController,
    private popoverController: PopoverController,
    public http: HttpClient,
    private camera: Camera,
    private transfer: FileTransfer,
    public platform: Platform,
    private sanitization: DomSanitizer,
    private filePath: FilePath,
    private loadingController: LoadingController,
    private crop: Crop,
    public keyboard: Keyboard) {
      this.lat = this.navParams.data.lat;
      this.lng = this.navParams.data.lng;

      platform.ready().then(() => {
      this.keyboard.onKeyboardShow().subscribe(() => {
        document.body.classList.add('keyboard-is-open');
        this.movePopupFromContainerList(document.getElementsByClassName('popup'), true);
      });

      this.keyboard.onKeyboardHide().subscribe(() => {
        document.body.classList.remove('keyboard-is-open');
      });
    });
  }

  ngOnInit() {
    // Get data from popover page
    this.page = this.navParams.get('data');
  }

  movePopupFromContainerList(list, up) {
    if (list.length) {
      const popup = list[0].childNodes[0];
      popup.style.bottom = up ? '130px' : '0px';
    }
  }

  cropUpload() {
    const options = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,

    };

    this.camera.getPicture(options).then((imageData) => {
      this.crop.crop(imageData, {quality: 40})
      .then(
        (newImage) => {
          this.base64Image = window.Ionic.WebView.convertFileSrc(newImage);
          this.photo = newImage;
        },
        (error) => {console.error('Error cropping image', error);}
      );
    }, (err) => {
      console.log(err);
    });
  }

  async createNewGrafiti() {
    this.showLoader();
    // Destination URL
    const url = 'http://139.99.97.36:8080/api/graffiti';

    // File for Upload
    const targetPath = this.photo;

    const postData = {
        name: this.name,
        artist: this.artist,
        description: this.description,
        lat: this.lat,
        lng: this.lng,
    };

    const options: FileUploadOptions = {
      fileKey: 'file',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: postData
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer.upload(targetPath, url, options)
    .then((res) => {
      this.status = 1;
      console.log(res);
    }).catch((error) => {
      console.log(error);
      this.error = 'Something wrong happened, try again !';

    }).finally(() => { this.hideLoader(); });
  }

  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: 'Sending your graffiti !'
    }).then((res) => {
      res.present();
      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed!');
      });
    });
    // this.hideLoader();
  }

  hideLoader() {
      this.loadingController.dismiss();
  }

  closeNewGraffiti() {
    this.popoverController.dismiss();
  }
}
