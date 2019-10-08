import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, Events, Platform } from '@ionic/angular';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FilePath } from '@ionic-native/file-path/ngx';
declare let window: any;

@Component({
  selector: 'app-new-graffiti',
  templateUrl: './new-graffiti.component.html',
  styleUrls: ['./new-graffiti.component.scss']
})
export class NewGraffitiComponent implements OnInit {
  page;
  base64Image: SafeResourceUrl;
  respData: any;
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
    private popoverController: PopoverController,
    public http: HttpClient,
    private camera: Camera,
    private transfer: FileTransfer,
    public platform: Platform,
    private sanitization: DomSanitizer,
    private filePath: FilePath) {
      this.lat = this.navParams.data.lat;
      this.lng = this.navParams.data.lng;
  }

  ngOnInit() {
    //Get data from popover page
    this.page = this.navParams.get('data');
  }

  cropUpload() {
    var options = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      //sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then((imageData) => {
      this.photo = imageData
      // if (this.platform.is('ios')) {
      //   this.base64Image = normalizeURL(imageData);
      // // Alternatively if the problem only occurs in ios and normalizeURL
      // // doesn't work for you then you can also use:
      // // this.base64Image= imageData.replace(/^file:\/\//, '');
      // }
      // else {
      // this.filePath.resolveNativePath(imageData)
      //  .then(filePath => this.base64Image = filePath)
      //  .catch(err => console.log(err));
      this.base64Image = window.Ionic.WebView.convertFileSrc(imageData);
      // }

    }, (err) => {
     // Handle error
    });
  }

  createNewGrafiti() {

    // Destination URL
    let url = 'http://192.168.1.112:8080/api/graffiti';

    // File for Upload
    var targetPath = this.photo;

    let postData = {
        "name": this.name,
        "artist": this.artist,
        "description": this.description,
        "lat": this.lat,
        "lng": this.lng,
    }

    var options: FileUploadOptions = {
      fileKey: 'file',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: postData
    };

    let fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer.upload(targetPath, url, options)
     .then((data) => {
       this.status = 1;
       console.log(data)
     }, (err) => {
       console.log(err)
     })
    // Use the FileTransfer to upload the image
    //return fileTransfer.upload(targetPath, url, options);
  }

  eventFromPopover() {
    this.events.publish('fromPopoverEvent');
    this.popoverController.dismiss();
  }
}
