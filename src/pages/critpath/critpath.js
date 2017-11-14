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
var CritpathPage = (function () {
    function CritpathPage(navCtrl, navParams, cpProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.cpProvider = cpProvider;
    }
    CritpathPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CritpathPage');
    };
    CritpathPage.prototype.test = function () {
        var list = [];
        var activityA = {
            name: "A",
            duration: 10,
            description: "asdf",
            dependencies: [],
            assignees: ["aaa", "bbb", "ccc"],
        };
        var activityB = {
            name: "B",
            duration: 20,
            description: "asdf",
            dependencies: [activityA],
            assignees: ["aaa", "bbb", "ccc"],
        };
        var activityC = {
            name: "C",
            duration: 5,
            description: "asdf",
            dependencies: [activityB],
            assignees: ["aaa", "bbb", "ccc"],
        };
        var activityD = {
            name: "D",
            duration: 10,
            description: "asdf",
            dependencies: [activityC],
            assignees: ["aaa", "bbb", "ccc"],
        };
        var activityF = {
            name: "15",
            duration: 3,
            description: "asdf",
            dependencies: [activityA],
            assignees: ["aaa", "bbb", "ccc"],
        };
        var activityG = {
            name: "G",
            duration: 5,
            description: "asdf",
            dependencies: [activityF, activityC],
            assignees: ["aaa", "bbb", "ccc"],
        };
        var activityH = {
            name: "H",
            duration: 15,
            description: "asdf",
            dependencies: [activityA],
            assignees: ["aaa", "bbb", "ccc"],
        };
        var activityE = {
            name: "E",
            duration: 20,
            description: "asdf",
            dependencies: [activityD, activityG, activityH],
            assignees: ["aaa", "bbb", "ccc"],
        };
        list.push(activityA);
        list.push(activityB);
        list.push(activityC);
        list.push(activityD);
        list.push(activityE);
        list.push(activityF);
        list.push(activityG);
        list.push(activityH);
        console.log(list);
        console.log(this.cpProvider.shortAndLong(list, activityE));
    };
    CritpathPage.prototype.test2 = function () {
        var sorted = this.cpProvider.topologicalSort([
            {
                name: 'A',
                dependencies: ['B', 'C']
            },
            {
                name: 'B',
                dependencies: []
            },
            {
                name: 'C',
                dependencies: []
            }
        ]);
        console.log(sorted);
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