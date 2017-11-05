import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { ActivityFormPage } from '../activityForm/activityForm';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';


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

  constructor(public navCtrl: NavController,public firebaseProvider: FirebaseProvider, public navParams: NavParams,public alertCtrl: AlertController) {
    this.item = navParams.get('item');
    this.events = this.firebaseProvider.getEvents(this.item);
    this.events.forEach(event => {
      console.log(event);
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectPage');
  }

  addActivity(item){
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
