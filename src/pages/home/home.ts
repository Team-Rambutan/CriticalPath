import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  projects: Observable<any[]>;
  newItem = {
    name: '',
    events: ''
  };
  newEvent = {
    name: 'This is a test',
    duration: 3
  };

  constructor(public navCtrl: NavController, public firebaseProvider: FirebaseProvider, public alertCtrl: AlertController) {
    this.projects = this.firebaseProvider.getProjects();
    this.projects.forEach(project => {
      console.log(project);
    })
    //console.log(this.shoppingItems);
    //this.shoppingItems.subscribe(val => console.log(val));
  }

  addItem() {
    this.firebaseProvider.addProject(this.newItem);
  }

  removeItem(item) {
    console.log(item);
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
            this.firebaseProvider.removeProject(item);
          }
        }
      ]
    });
    alert.present();
  }

  addEvent(item){
    this.firebaseProvider.addActivity(item, this.newEvent);
  }

}
