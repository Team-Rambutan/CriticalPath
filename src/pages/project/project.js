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
            duration: null
        };
        this.item = navParams.get('item');
        console.log(this.item);
        this.events = this.firebaseProvider.getEvents(this.item);
        this.events.forEach(function (event) {
            console.log(event);
        });
        this.dependencies = [];
    }
    ProjectPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ProjectPage');
    };
    // add to the dependency array.
    ProjectPage.prototype.setDependency = function (dependency) {
        console.log(dependency);
        var exists = false;
        for (var x = 0; x < this.dependencies.length; x++) {
            if (dependency.name == this.dependencies[x].name) {
                exists = true;
                break;
            }
        }
        if (exists) {
            var alert_1 = this.alertCtrl.create({
                title: 'Alert',
                message: 'This dependency already exists',
                buttons: [
                    {
                        text: 'Okay',
                        role: 'Okay',
                        handler: function () {
                        }
                    },
                ]
            });
            alert_1.present();
        }
        else {
            this.dependencies.push({ name: dependency.name, duration: dependency.duration });
            console.log(this.dependencies);
        }
    };
    ProjectPage.prototype.addActivity = function (item) {
        if (this.newEvent.name && this.newEvent.duration) {
            var parsedDuration = parseInt(this.newEvent.duration);
            if (parsedDuration) {
                this.newEvent.duration = parsedDuration;
                var ref = this.firebaseProvider.addActivity(item, this.newEvent);
                for (var x = 0; x < this.dependencies.length; x++) {
                    this.firebaseProvider.addDependency(this.item, ref, this.dependencies[x]);
                }
                //reset the fields
                this.newEvent = {
                    name: '',
                    description: '',
                    duration: null
                };
                this.dependencies = [];
            }
            else {
                var alert_2 = this.alertCtrl.create({
                    title: 'Alert',
                    message: 'In order to add an activity, the duration must be single integer',
                    buttons: [
                        {
                            text: 'Okay',
                            role: 'Okay',
                            handler: function () {
                            }
                        },
                    ]
                });
                alert_2.present();
            }
        }
        else {
            var alert_3 = this.alertCtrl.create({
                title: 'Alert',
                message: 'In order to add an activity, it must have both a name and duration in days!',
                buttons: [
                    {
                        text: 'Okay',
                        role: 'Okay',
                        handler: function () {
                        }
                    },
                ]
            });
            alert_3.present();
        }
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