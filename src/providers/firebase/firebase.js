var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';
/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var FirebaseProvider = (function () {
    function FirebaseProvider(afd) {
        this.afd = afd;
    }
    /*  BASIC CRUD FOR PROJECTS */
    /*Provides a list of projects*/
    FirebaseProvider.prototype.getProjects = function () {
        return this.afd.list('/Projects/')
            .snapshotChanges()
            .map(function (changes) {
            return changes.map(function (c) { return (__assign({ key: c.payload.key }, c.payload.val())); });
        });
    };
    /* Use this method to add a Project Json into the database tree */
    FirebaseProvider.prototype.addProject = function (project) {
        this.afd.list('/Projects/').push(project);
        // this.afd.list('/shoppingItems/').snapshotChanges();
    };
    /*Use this method to update the information in a given Project Object*/
    FirebaseProvider.prototype.updateProject = function (project) {
        this.afd.list('/Projects/').update(project.key, project);
    };
    /* Use this method to remove a Project */
    FirebaseProvider.prototype.removeProject = function (item) {
        this.afd.list('/Projects/').remove(item.key);
    };
    FirebaseProvider.prototype.getEvents = function (project) {
        var path = '/Projects/' + project.key + '/Activities/';
        return this.afd.list(path)
            .snapshotChanges()
            .map(function (changes) {
            return changes.map(function (c) { return (__assign({ key: c.payload.key }, c.payload.val())); });
        });
    };
    /* Use this method to add a event Json into the database tree */
    FirebaseProvider.prototype.addActivity = function (project, activity) {
        var path = '/Projects/' + project.key + '/Activities/';
        console.log(project.key);
        console.log(activity);
        var ref = this.afd.list(path).push(activity);
        return ref.key;
        // this.afd.list('/shoppingItems/').snapshotChanges();
    };
    /* Use this method to add a event Json into the database tree */
    FirebaseProvider.prototype.deleteActivity = function (project, activity) {
        var path = '/Projects/' + project.key + '/Activities/';
        console.log(project.key);
        console.log(activity.key);
        this.afd.list(path).remove(activity.key);
    };
    /* Use this method to add a event Json into the database tree */
    FirebaseProvider.prototype.addDependency = function (project, ref, dependency) {
        var path = '/Projects/' + project.key + '/Activities/' + ref + '/dependencies/';
        this.afd.list(path).push(dependency);
    };
    return FirebaseProvider;
}());
FirebaseProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AngularFireDatabase])
], FirebaseProvider);
export { FirebaseProvider };
//# sourceMappingURL=firebase.js.map