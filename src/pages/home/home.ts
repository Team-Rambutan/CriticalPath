import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  items: Observable<any[]>;
  newItem = {
                name: '',
                events: ''
            };
  newEvent = {
    name: 'This is a test',
    duration: 3
  };

  constructor(public navCtrl: NavController, public firebaseProvider: FirebaseProvider) {
    this.items = this.firebaseProvider.getProjects();
    this.items.forEach(project => {
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
    this.firebaseProvider.removeProject(item);
  }
  addEvent(item){
    this.firebaseProvider.addActivity(item, this.newEvent);
  }

}
