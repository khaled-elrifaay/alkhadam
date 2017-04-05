import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import {GlobalService} from "../../providers/GlobalService";
import {AdvancedSearchPage} from "../advanced-search/advanced-search";
import {Camera} from "ionic-native";

/*
 Generated class for the Dashboard page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-editworker',
  templateUrl: 'editworker.html'
})
export class EditWorkerPage {



  public worker;
  public countryid: string = "";
  public countries;
  public nationalityid: string = "";
  public nationalities;
  public occupationid: string = "";
  public occupations;
  public religionid: string = "";
  public religions;
  public maritalid: string = "";
  public maritals;
  public birth_date;
  public Name;
  public sex = "";
  public companyid = "5";
  public Salary = "100";
  public image = "";  //Personal Photo
  public image2 = "";  //Full Photo
  public imag3 = ""; //Host Photo - CV ?
  PERSONAL_PHOTO = 1;
  FULL_PHOTO = 2;
  HOST_PHOTO = 2;
  agree = false;


  constructor(public navCtrl: NavController, public navParams: NavParams, public globalService: GlobalService,
              public alertCtrl: AlertController, public toastCtrl: ToastController) {
    this.getAllFilters();
    this.worker = navParams.get('worker');
    this.Name = this.worker.name;
    this.Salary = this.worker.salary;
    console.log(this.worker)
  }


  getAllFilters() {
    this.globalService.getAllFilters().subscribe(
      data => {
        this.countries = data.country;
        this.religions = data.religion;
        this.maritals = data.status;
        this.occupations = data.occupation;
        this.nationalities = data.nationality;
        // this.ages = data.ages;
        console.log(data)
      }
    );
  }

  submitWorker() {
    console.log(this.agree);
    let wholeobj = {
      workerid: this.worker.workerid,//1
      companyid: this.globalService.user.memberid,//1
      countryid: this.countryid,
      occupationid: this.occupationid, //2
      nationalityid: this.nationalityid,//3
      religionid: this.religionid,//4
      status: this.maritalid, //5
      gender: this.sex,//6
      birth_date: this.birth_date,//7
      name: this.Name,//8
      salary: this.Salary,//9
      image: this.image,//10
      image2: this.image2,//11
      imag3: this.imag3,//12
    };

    this.globalService.editWorker(wholeobj).subscribe(data => {
      console.log(data);
      if (data.error == null || data.error == '') {
        let toast = this.toastCtrl.create({
          message: data.error != null ? data.error : 'Success.',
          duration: 3000
        });
        toast.present();
        this.navCtrl.pop();
      } else {
        let toast = this.toastCtrl.create({
          message: data.error != null ? data.error : 'Error.',
          duration: 3000
        });
        toast.present();
        // this.showConfirm();
      }
    }, (err => {
      console.log(err);
    }));
  }

  // showConfirm() {
  //   let confirm = this.alertCtrl.create({
  //     title: this.globalService.language == "en" ? 'No results were found.' : 'لم يتم العثور على اى نتائج',
  //     message: this.globalService.language == "en" ? 'Would you like to search again?' : 'هل تريد البحث مجدداً؟',
  //     buttons: [
  //       {
  //         text: this.globalService.language == "en" ? 'No' : 'لا',
  //         handler: () => {
  //         }
  //       },
  //       {
  //         text: this.globalService.language == "en" ? 'Yes' : 'نعم',
  //         handler: () => {
  //           this.navCtrl.pop();
  //         }
  //       }
  //     ]
  //   });
  //   confirm.present();
  // }

  GalleryOrCamera(number) {
    let confirm = this.alertCtrl.create({
      title: 'Choose method',
      message: 'Choose picture from gallery or camera ?',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            this.pickPicture(number);
          }
        },
        {
          text: 'Camera',
          handler: () => {
            this.takePicture(number);
          }
        }
      ]
    });
    confirm.present();
  }

  pickPicture(number) {
    //noinspection TypeScriptUnresolvedVariable
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
      // this.base64 = imageData;
      // console.log(this.base64);
      // this.base64Image = "data:image/jpeg;base64," + imageData;
      // this.edituser.image = this.base64Image;

      if (number == this.PERSONAL_PHOTO) {
        this.image = "data:image/jpeg;base64," + imageData;
      } else if (number == this.FULL_PHOTO) {
        this.image2 = "data:image/jpeg;base64," + imageData;
      } else if (number == this.HOST_PHOTO) {
        this.imag3 = "data:image/jpeg;base64," + imageData;
      }
    }, (err) => {
      console.log(err);
    });
  }

  takePicture(number) {
    //noinspection TypeScriptUnresolvedVariable
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
      if (number == this.PERSONAL_PHOTO) {
        this.image = "data:image/jpeg;base64," + imageData;
      } else if (number == this.FULL_PHOTO) {
        this.image2 = "data:image/jpeg;base64," + imageData;
      } else if (number == this.HOST_PHOTO) {
        this.imag3 = "data:image/jpeg;base64," + imageData;
      }
    }, (err) => {
      console.log(err);
    });
  }


  searchWorkers(): any {
  }

  gotoSearch() {
    this.navCtrl.push(AdvancedSearchPage)
  }

}
