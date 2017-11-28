import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { ActivityFormPage } from '../activityForm/activityForm';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DurationValidator } from  '../../validators/duration';


/**
 * Generated class for the ProjectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-project',
  templateUrl: 'project.html',
})
export class ProjectPage {
  events: Observable<any[]>;
  dependencies: any[];
  item: any;
  newEvent = {
    name: '',
    description: '',
    duration: null
  };
  activityForm: FormGroup;

  submitAttempt: boolean = false;


  constructor(public navCtrl: NavController,public firebaseProvider: FirebaseProvider, public navParams: NavParams,public alertCtrl: AlertController,public formBuilder: FormBuilder) {
    this.item = navParams.get('item');
    console.log(this.item);
    this.events = this.firebaseProvider.getEvents(this.item);
    this.events.forEach(event => {
      console.log(event);
    })
    this.activityForm = formBuilder.group({
      name:['', Validators.compose([Validators.maxLength(50),Validators.required, Validators.pattern('[a-zA-Z 0-9.!@#$%^&*()_+-=]*',), Validators.required])],
      description:['',Validators.compose([Validators.maxLength(100), Validators.required, Validators.pattern('[a-zA-Z 0-9.!@#$%^&*()_+-=,]*'), Validators.required])],
      duration:['', Validators.compose([Validators.required, DurationValidator.isValid])]
    });
    this.dependencies = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectPage');
  }

  // add to the dependency array.
  setDependency(dependency){
    console.log(dependency);
    let exists = false;
    for(let x = 0; x < this.dependencies.length; x++) {
      if(dependency.name == this.dependencies[x].name) {
        exists = true;
        break;
      }
    }
    if(exists) {
      const alert = this.alertCtrl.create({
        title: 'Alert',
        message: 'This dependency already exists',
        buttons: [
          {
            text: 'Okay',
            role: 'Okay',
            handler: () => {

            }
          },
        ]
      });
      alert.present();
    }else {
      this.dependencies.push({name: dependency.name, duration: dependency.duration});
      console.log(this.dependencies);
    }
  }

  addActivity(item){
    this.submitAttempt = true;
    if(this.newEvent.name && this.newEvent.duration) {
      const parsedDuration = parseInt(this.newEvent.duration);
      if(parsedDuration) {
        this.newEvent.duration = parsedDuration
        const ref = this.firebaseProvider.addActivity(item, this.newEvent);

        for(let x = 0; x < this.dependencies.length; x++) {
          this.firebaseProvider.addDependency(this.item, ref, this.dependencies[x]);
        }
        //reset the fields
        this.newEvent = {
          name: '',
          description: '',
          duration: null
        };
       this.dependencies = [];
      } else {
        const alert = this.alertCtrl.create({
          title: 'Alert',
          message: 'In order to add an activity, the duration must be single integer',
          buttons: [
            {
              text: 'Okay',
              role: 'Okay',
              handler: () => {

              }
            },
          ]
        });
        alert.present();
      }
    }else {
      const alert = this.alertCtrl.create({
        title: 'Alert',
        message: 'In order to add an activity, it must have both a name and duration in days!',
        buttons: [
          {
            text: 'Okay',
            role: 'Okay',
            handler: () => {

            }
          },
        ]
      });
      alert.present();
    }
    this.activityForm.reset();

  }
  removeActivity(item) {
    console.log(item);
    console.log(item.name);
    console.log(this.newEvent);
    const alert = this.alertCtrl.create({
      title: 'Confirm Deletion',
      message: 'Do you want to delete: ' + item.name + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.firebaseProvider.deleteActivity(this.item, item);
          }
        }
      ]
    });
    alert.present();
  }

}
