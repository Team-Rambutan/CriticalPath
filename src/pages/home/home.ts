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
  shoppingItems: Observable<any[]>;
  newItem = {
                name: '',
                events: ''
            };

  constructor(public navCtrl: NavController, public firebaseProvider: FirebaseProvider) {
    this.shoppingItems = this.firebaseProvider.getProjects();
    this.shoppingItems.forEach(project => {
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
}
