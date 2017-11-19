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
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { AlertController } from 'ionic-angular';
/**
 * Generated class for the ProjectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ProjectPage = (function () {
    function ProjectPage(navCtrl, firebaseProvider, navParams, alertCtrl) {
        this.navCtrl = navCtrl;
        this.firebaseProvider = firebaseProvider;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.newEvent = {
            name: '',
            description: '',
            duration: ''
        };
        this.item = navParams.get('item');
        this.events = this.firebaseProvider.getEvents(this.item);
        this.events.forEach(function (event) {
            console.log(event);
        });
    }
    ProjectPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ProjectPage');
    };
    ProjectPage.prototype.addActivity = function (item) {
        this.firebaseProvider.addActivity(item, this.newEvent);
    };
    ProjectPage.prototype.removeActivity = function (item) {
        var _this = this;
        console.log(item);
        console.log(item.name);
        console.log(this.newEvent);
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
                        _this.firebaseProvider.deleteActivity(_this.item, item);
                    }
                }
            ]
        });
        alert.present();
    };
    return ProjectPage;
}());
ProjectPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-project',
        templateUrl: 'project.html',
    }),
    __metadata("design:paramtypes", [NavController, FirebaseProvider, NavParams, AlertController])
], ProjectPage);
export { ProjectPage };
//# sourceMappingURL=project.js.map