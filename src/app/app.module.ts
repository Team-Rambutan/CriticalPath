import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ActivityFormPage } from '../pages/activityForm/activityForm';
import { ProjectPage } from '../pages/project/project';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpModule } from '@angular/http';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { FirebaseProvider } from '../providers/firebase/firebase';

export const firebaseConfig = {
  apiKey: "AIzaSyBa-3KkWI1xUxVeqQG2r1T4_fS0MBUX75U",
  authDomain: "rambutan-b6fc2.firebaseapp.com",
  databaseURL: "https://rambutan-b6fc2.firebaseio.com",
  projectId: "rambutan-b6fc2",
  storageBucket: "rambutan-b6fc2.appspot.com",
  messagingSenderId: "172585513927"
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ActivityFormPage,
    ProjectPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ActivityFormPage,
    ProjectPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseProvider
  ]
})
export class AppModule {}
