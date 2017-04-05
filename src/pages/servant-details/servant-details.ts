import {Component, ViewChild} from '@angular/core';
import {
  NavController, ModalController, NavParams, Slides, LoadingController, AlertController,
  ViewController, ToastController
} from 'ionic-angular';
import {GlobalService} from "../../providers/GlobalService";
import {MapsPage} from "../maps-page/mapspage";
import {googlemaps} from 'googlemaps';
import {SMS} from 'ionic-native';
import {FullImagePage} from "../full-image/full-image";
import {LoginPage} from "../login/login";
import {HomepagePage} from "../homepage/homepage";
declare var google: any;

/*
 Generated class for the ServantDetails page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-servant-details',
  templateUrl: 'servant-details.html'
})
export class ServantDetailsPage {
  @ViewChild('mySlider') slider: Slides;
  public map: google.maps.Map;
  lat = 0.0;
  lng = 0.0;
  destination;
  public message: string = "";
  public serv;
  public user;
  public order;
  public company;
  public edituser = {
    email: "",
    mobile: "",
    username: "",
  };
  public worker;
  email: string = "";
  password: string = "";
  mobile: string;
  name: string = "";
  username:string = "";
  public latlog;
  constructor(public navCtrl: NavController,private toastCtrl: ToastController, public viewCtrl: ViewController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public globalService: GlobalService, public navParams: NavParams) {
    if (this.globalService.loggedIn) {
      this.user = this.globalService.user;
      this.edituser.email = this.user.email;
      this.edituser.mobile = this.user.mobile;
      this.edituser.username = this.user.username;
      console.log(this.user);
      console.log(this.edituser.username);
        }
    this.globalService.getWorkerDetails().subscribe(
      data => {
        console.log(data);
        this.latlog = data[0];
        console.log(this.latlog);
        this.lat = Number.parseFloat(this.latlog['latitude']);
        this.lng = Number.parseFloat(this.latlog['longitude']);
        console.log(this.latlog['latitude']);
        console.log(this.latlog['longitude']);
      }
    )
  }
  presentProfileModal(workerid) {
    let profileModal = this.modalCtrl.create(FullImagePage, {userId: workerid});
    profileModal.onDidDismiss(data => {
      console.log(data);
    });
    profileModal.present();
  }

  send(message: any) {
    var options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        intent: 'INTENT'  // Opens Default sms app
        //intent: '' // Sends sms without opening default sms app
      }
    }
    console.log(message);
    SMS.send(message, 'hello', options)
      .then(()=> {
        console.log("success");
      }, ()=> {
        console.log("failed");
      });
  }

  sendSMS(mobile: any) {
    var options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        intent: 'INTENT'  // Opens Default sms app
        //intent: '' // Sends sms without opening default sms app
      }
    }
    console.log(this.message);
    console.log(mobile);
    SMS.send(mobile, this.message, options)
      .then(()=> {
        console.log("success");
      }, ()=> {
        console.log("failed");
      });
  }

  ionViewDidLoad() {
    this.getworker();
    console.log('ionViewDidLoad ServantDetailsPage');
    this.globalService.getWorkerDetails().subscribe(
      data => {
        console.log(data);
        this.latlog = data[0];
        console.log(this.latlog);
        this.lat = this.latlog['latitude'];
        this.lng = this.latlog['longitude'];
        console.log(this.latlog['latitude']);
        console.log(this.latlog['longitude']);
      }
    )
  }

  gotomap() {
    console.log("shgdhasjds");
    this.navCtrl.push(MapsPage);
  }

  getworker() {
    this.globalService.getWorkerDetails().subscribe(
      data => {
        console.log(data);
        this.serv = data[0];
        console.log(this.serv);
      }
    )
  }
  sendlogged(workerid){
    console.log(this.message);
    this.globalService.postOrder(this.edituser.username, this.edituser.email,this.edituser.mobile,this.message,workerid).subscribe(
      data => {
        console.log(this.edituser.username);
        this.order = data;
        console.log(this.order);
        if (data.error != null) {
          let toast = this.toastCtrl.create({
            message: data.error,
            duration: 4000,
          });
          toast.present();
        }
        else {
          let toast = this.toastCtrl.create({
            message: this.globalService.language == 'en' ? 'Order Completed.' : 'تم الطلب بنجاح',
            duration: 4000,
          });
          toast.present();
          this.navCtrl.push(HomepagePage);
        }
      }
    );

  }
  sendnotlogged(workerid){
    this.globalService.postOrder(this.username, this.email,this.mobile,this.message,workerid).subscribe(
      data => {
        this.order = data;
        console.log(this.order);
        if (data.error != null) {
          let toast = this.toastCtrl.create({
            message: data.error,
            duration: 4000,
          });
          toast.present();
        }
        else {
          let toast = this.toastCtrl.create({
            message: this.globalService.language == 'en' ? 'Order Completed.' : 'تم الطلب بنجاح',
            duration: 4000,
          });
          toast.present();
          this.navCtrl.push(HomepagePage);
        }
      }
    );
  }

  addToCart(workerid) {
    if (this.globalService.loggedIn) {
      this.globalService.addToCart(workerid).subscribe((data) => {
        // console.log(data);
        if (data.error != null) {
          let toast = this.toastCtrl.create({
            message: data.error,
            duration: 4000,
          });
          toast.present();
        }
        else {
          let toast = this.toastCtrl.create({
            message: this.globalService.language == "en" ? "Item added to your favourite." : "تمت الاضافة الى قائمة المفضلة",
            duration: 4000,
          });
          toast.present();
        }
      })
    } else {
      this.showLoginAlert();
    }
  }

  showLoginAlert() {
    let alert = this.alertCtrl.create({
      title: this.globalService.language == 'en' ? 'Error' : 'خطأ',
      subTitle: this.globalService.language == 'en' ? 'Please log-in first' : 'برجاء تسجيل الدخول اولاً',
      buttons: [{
        text: this.globalService.language == 'en' ? 'OK' : 'حسناً',
        handler: () => {
          let foundh = false;
          this.navCtrl.getViews().forEach((object, index) => {
            if (object.component.name == 'signinPage') {
              console.log('i found signinPage poping to it ? at index: ' + index);
              console.log(this.navCtrl.getViews()[index]);
              foundh = true;
              this.navCtrl.popTo(index);
            }
          });
          if (!foundh) {
            console.log("pushing home page for the first time");
            this.navCtrl.push(LoginPage);
          }
        }
      }]
    });
    alert.present();
  }
}

