import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DurationValidator } from  '../../validators/duration';




/**
 * Generated class for the ProjectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-project',
  templateUrl: 'project.html',
})
export class ProjectPage {
  events: Observable<any[]>;
  item: any;
  newEvent = {
    name: '',
    description: '',
    duration: ''
  };

  activityForm: FormGroup;

  submitAttempt: boolean = false;


  constructor(public navCtrl: NavController,public firebaseProvider: FirebaseProvider, public navParams: NavParams,public alertCtrl: AlertController, public formBuilder: FormBuilder) {
    this.item = navParams.get('item');
    this.events = this.firebaseProvider.getEvents(this.item);
    this.events.forEach(event => {
      console.log(event);
    })
    this.activityForm = formBuilder.group({
      name:['', Validators.compose([Validators.maxLength(50),Validators.required, Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      description:['',Validators.compose([Validators.maxLength(100), Validators.required, Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      duration:['', Validators.compose([Validators.required, DurationValidator.isValid])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectPage');
  }

  addActivity(item){
    this.submitAttempt = true;
    this.firebaseProvider.addActivity(item, this.newEvent);
  }
  removeActivity(item) {
    console.log(item);
    console.log(item.name);
    console.log(this.newEvent);
    const alert = this.alertCtrl.create({
      title: 'Confirm Deletion',
      message: 'Do you want to delete: ' + item.name + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.firebaseProvider.deleteActivity(this.item, item);
          }
        }
      ]
    });
    alert.present();
  }

}
