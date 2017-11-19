import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  constructor(public afd: AngularFireDatabase) {}


  /*  BASIC CRUD FOR PROJECTS */


  /*Provides a list of projects*/
  getProjects() {
    return this.afd.list('/Projects/')
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val()
        }));
      });
  }

  /* Use this method to add a Project Json into the database tree */
  addProject(project) {
    this.afd.list('/Projects/').push(project);
   // this.afd.list('/shoppingItems/').snapshotChanges();
  }

  /*Use this method to update the information in a given Project Object*/
  updateProject(project) {
    this.afd.list('/Projects/').update(project.key, project);
  }

  /* Use this method to remove a Project */
  removeProject(item) {
    this.afd.list('/Projects/').remove(item.key);
  }

  getEvents(project) {
    const path = '/Projects/' + project.key + '/Activities/'
    return this.afd.list(path)
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val()
        }));
      });
  }


  /* Use this method to add a event Json into the database tree */
  addActivity(project,activity) {
    const path = '/Projects/' + project.key + '/Activities/'
    console.log(project.key);
    console.log(activity);
    const ref = this.afd.list(path).push(activity);
    return ref.key;
    // this.afd.list('/shoppingItems/').snapshotChanges();
  }

  /* Use this method to add a event Json into the database tree */
  deleteActivity(project,activity) {
    const path = '/Projects/' + project.key + '/Activities/'
    console.log(project.key);
    console.log(activity.key);
    this.afd.list(path).remove(activity.key);
  }

  /* Use this method to add a event Json into the database tree */
  addDependency(project,ref, dependency) {
    const path = '/Projects/' + project.key + '/Activities/' + ref + '/dependencies/';
    this.afd.list(path).push(dependency);
  }
}


