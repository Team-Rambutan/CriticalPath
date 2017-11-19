var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var CritpathPage = (function () {
    function CritpathPage(navCtrl, navParams, cpProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.cpProvider = cpProvider;
        this.project = navParams.get('project');
        console.log(this.project);
        this.activities = this.project.Activities;
        console.log(this.activities);
        this.formatList = [];
        this.list = [];
    }
    CritpathPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CritpathPage');
        // Messy messy, but we need to strip the preceding keys of the objects
        for (var key in this.activities) {
            if (this.activities.hasOwnProperty(key)) {
                var dependencies = this.activities[key].dependencies;
                var temp = []; // set us up a temporary array to story the dependencies
                for (var dependency in dependencies) {
                    temp.push({ name: dependencies[dependency].name,
                        duration: dependencies[dependency].duration });
                }
                this.activities[key].dependencies = temp;
                //console.log(this.activities[key].dependencies);
                // push into the array, all activities that are stripped of their
                this.formatList.push({
                    name: this.activities[key].name,
                    duration: this.activities[key].duration,
                    description: this.activities[key].description,
                    dependencies: this.activities[key].dependencies
                });
            }
        }
        console.log('this is the format list');
        console.log(this.formatList);
        this.calculateAndAssign();
    };
    // Fucntion which generates critical path data into data bindable variables
    CritpathPage.prototype.calculateAndAssign = function () {
        this.topList = this.cpProvider.topologicalSort(this.formatList);
        //send in copy of topList to calculate times
        console.log('asdf1');
        console.log(this.topList);
        var temp = this.cpProvider.topologicalSort(this.formatList);
        var tempString = JSON.stringify(temp);
        console.log(tempString);
        console.log(JSON.parse(tempString));
        console.log('asdf2');
        //this.calculatedList = this.cpProvider.calculateTimes(JSON.parse(JSON.stringify(this.topList)));//note: undefined happens here 11.19.17
        this.calculatedList = this.cpProvider.calculateTimes(JSON.parse(tempString)); //note: undefined happens here 11.19.17
        //console.log('asdf 1');
        //console.log(this.cpProvider.calculateTimes(JSON.parse(JSON.stringify(this.topList))));
        //console.log(this.calculatedList);
        //console.log('asdf 2');
        this.longPath = this.cpProvider.longestPath(JSON.parse(JSON.stringify(this.calculatedList)));
        console.log(this.longPath);
        console.log(this.topList);
        this.duration = this.cpProvider.calculateCritPathDuration(this.longPath);
        // Messy, messy, but we have to add the start and end times to the top sorted list
        for (var x = 0; x < this.topList.length; x++) {
            for (var y = 0; y < this.calculatedList.length; y++) {
                if (this.topList[x].name == this.calculatedList[y].name) {
                    this.topList[x].earliestStart = this.calculatedList[y].earliestStart;
                    this.topList[x].earliestEnd = this.calculatedList[y].earliestEnd;
                    this.topList[x].latestStart = this.calculatedList[y].latestStart;
                    this.topList[x].latestEnd = this.calculatedList[y].latestEnd;
                }
            }
        }
    };
    return CritpathPage;
}());
CritpathPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-critpath',
        templateUrl: 'critpath.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams, CpProvider])
], CritpathPage);
export { CritpathPage };
//# sourceMappingURL=critpath.js.map