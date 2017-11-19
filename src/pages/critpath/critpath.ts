import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CpProvider } from './../../providers/cp/cp';

/**
 * Generated class for the CritpathPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

/**
  IMPORTANT NOTE: THIS PAGE IS JUST FOR CALCULATING AND MANAGING DATA. NO CRUD TO DATABASE ALLOWED
 */
@IonicPage()
@Component({
  selector: 'page-critpath',
  templateUrl: 'critpath.html',
})
export class CritpathPage {
  list: any[];
  activities: any[];
  project: any;
  formatList: any[]; // holds the list of activities without preceding keys.
  calculatedList: any[];
  topList: any[];
  longPath: any[]; // holds nodes of the critical path.
  duration: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public cpProvider: CpProvider) {
    this.project = navParams.get('project');
    console.log(this.project);
    this.activities = this.project.Activities;
    console.log(this.activities);
    this.formatList = [];
    this.list = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CritpathPage');

    // Messy messy, but we need to strip the preceding keys of the objects
    for (var key in this.activities) {
      if (this.activities.hasOwnProperty(key)) {
        var dependencies = this.activities[key].dependencies;
        var temp = []; // set us up a temporary array to story the dependencies
        for(var dependency in dependencies) {
          temp.push({name: dependencies[dependency].name,
                    duration: dependencies[dependency].duration})
        }
        this.activities[key].dependencies = temp;
        console.log(this.activities[key].dependencies);

        // push into the array, all activities that are stripped of their
        this.formatList.push( {
          name: this.activities[key].name,
          duration: this.activities[key].duration,
          description: this.activities[key].description,
          dependencies: this.activities[key].dependencies
        });
      }
    }
    this.calculateAndAssign();
  }


  // Fucntion which generates critical path data into data bindable variables
  calculateAndAssign() {
    this.topList = this.cpProvider.topologicalSort(this.formatList)
    //send in copy of topList to calculate times
    this.calculatedList = this.cpProvider.calculateTimes(JSON.parse(JSON.stringify(this.topList)));
    console.log(this.calculatedList);
    this.longPath = this.cpProvider.longestPath(this.calculatedList);
    console.log(this.longPath);
    console.log(this.topList);
    this.duration = this.cpProvider.calculateCritPathDuration(this.longPath);

    // for(let x = 0; x <this.topList.length; x++) {
    //   for(let y = 0; y < this.calculatedList.length; y++) {
    //     if(this.topList[x].name == this.calculatedList[y].name){
    //       this.topList[y].earl = this.calculatedList[x].dependencies;
    //     }
    //   }
    // }
  }


}
