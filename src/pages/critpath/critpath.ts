import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CpProvider } from './../../providers/cp/cp';

/**
 * Generated class for the CritpathPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-critpath',
  templateUrl: 'critpath.html',
})
export class CritpathPage {


  constructor(public navCtrl: NavController, public navParams: NavParams, public cpProvider: CpProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CritpathPage');
  }

  test(){
    var list = [];
    var activityA={
      name:"A",
      duration:10,
      description:"asdf",
      dependencies:[],
      assignees:["aaa","bbb","ccc"],
    }
    var activityB={
      name:"B",
      duration:20,
      description:"asdf",
      dependencies:[activityA],
      assignees:["aaa","bbb","ccc"],
    }
    var activityC={
      name:"C",
      duration:5,
      description:"asdf",
      dependencies:[activityB],
      assignees:["aaa","bbb","ccc"],
    }
    var activityD={
      name:"D",
      duration:10,
      description:"asdf",
      dependencies:[activityC],
      assignees:["aaa","bbb","ccc"],
    }

    var activityF={
      name:"15",
      duration:3,
      description:"asdf",
      dependencies:[activityA],
      assignees:["aaa","bbb","ccc"],
    }
    var activityG={
      name:"G",
      duration:5,
      description:"asdf",
      dependencies:[activityF,activityC],
      assignees:["aaa","bbb","ccc"],
    }
    var activityH={
      name:"H",
      duration:15,
      description:"asdf",
      dependencies:[activityA],
      assignees:["aaa","bbb","ccc"],
    }
    var activityE={
      name:"E",
      duration:20,
      description:"asdf",
      dependencies:[activityD,activityG,activityH],
      assignees:["aaa","bbb","ccc"],
    }
    list.push(activityA);
    list.push(activityB);
    list.push(activityC);
    list.push(activityD);
    list.push(activityE);
    list.push(activityF);
    list.push(activityG);
    list.push(activityH);
    console.log(list);
    console.log(this.cpProvider.shortAndLong(list,activityE));
  }

  test2() {
    const sorted = this.cpProvider.topologicalSort([
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
  }

}
