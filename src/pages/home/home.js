var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ProjectPage } from '../project/project';
import { CritpathPage } from '../critpath/critpath';
var HomePage = (function () {
    function HomePage(navCtrl, firebaseProvider, alertCtrl) {
        this.navCtrl = navCtrl;
        this.firebaseProvider = firebaseProvider;
        this.alertCtrl = alertCtrl;
        this.newItem = {
            name: '',
            events: ''
        };
        this.newEvent = {
            name: 'This is a test',
            duration: 3
        };
        this.projects = this.firebaseProvider.getProjects();
        this.projects.forEach(function (project) {
            console.log(project);
        });
        //console.log(this.shoppingItems);
        //this.shoppingItems.subscribe(val => console.log(val));
    }
    HomePage.prototype.addItem = function () {
        this.firebaseProvider.addProject(this.newItem);
    };
    HomePage.prototype.removeItem = function (item) {
        var _this = this;
        console.log(item);
        var alert = this.alertCtrl.create({
            title: 'Confirm Deletion',
            message: 'Do you want to delete: ' + item.name + '?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Confirm',
                    handler: function () {
                        _this.firebaseProvider.removeProject(item);
                    }
                }
            ]
        });
        alert.present();
    };
    HomePage.prototype.addEvent = function (item) {
        this.firebaseProvider.addActivity(item, this.newEvent);
    };
    HomePage.prototype.itemTapped = function (event, item) {
        // Go to ProjectPage
        this.navCtrl.push(ProjectPage, {
            item: item
        });
    };
    HomePage.prototype.goCritPath = function (event, item) {
        // Go to ProjectPage
        this.navCtrl.push(CritpathPage, {
            project: item
        });
    };
    return HomePage;
}());
HomePage = __decorate([
    Component({
        selector: 'page-home',
        templateUrl: 'home.html'
    }),
    __metadata("design:paramtypes", [NavController, FirebaseProvider, AlertController])
], HomePage);
export { HomePage };
//# sourceMappingURL=home.js.map