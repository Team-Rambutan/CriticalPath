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

  list: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public cpProvider: CpProvider) {
    this.list = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CritpathPage');
  }

  test(){
    let activityA={
      name:"A",
      duration:10,
      description:"asdf",
      dependencies:[],
      assignees:["aaa","bbb","ccc"],
    };
    let activityB={
      name:"B",
      duration:20,
      description:"asdf",
      dependencies:[activityA],
      assignees:["aaa","bbb","ccc"],
    };
    let activityC={
      name:"C",
      duration:5,
      description:"asdf",
      dependencies:[activityB],
      assignees:["aaa","bbb","ccc"],
    };
    let activityD={
      name:"D",
      duration:10,
      description:"asdf",
      dependencies:[activityC],
      assignees:["aaa","bbb","ccc"],
    };

    let activityF={
      name:"F",
      duration:15,
      description:"asdf",
      dependencies:[activityA],
      assignees:["aaa","bbb","ccc"],
    };
    let activityG={
      name:"G",
      duration:5,
      description:"asdf",
      dependencies:[activityF,activityC],
      assignees:["aaa","bbb","ccc"],
    };
    let activityH={
      name:"H",
      duration:15,
      description:"asdf",
      dependencies:[activityA],
      assignees:["aaa","bbb","ccc"],
    };

    let activityE={
      name:"E",
      duration:20,
      description:"asdf",
      dependencies:[activityD,activityG,activityH],
      assignees:["aaa","bbb","ccc"],
    };
    this.list.push(activityA);
    this.list.push(activityB);
    this.list.push(activityC);
    this.list.push(activityD);
    this.list.push(activityE);
    this.list.push(activityF);
    this.list.push(activityG);
    this.list.push(activityH);
    console.log(this.list);
    console.log(this.cpProvider.longestPathDuration(activityE));
    this.list = [];
  }

  test2() {
    let activityA={
      name:"A",
      duration:10,
      description:"asdf",
      dependencies:[],
      assignees:["aaa","bbb","ccc"],
    };
    let activityB={
      name:"B",
      duration:20,
      description:"asdf",
      dependencies:[activityA],
      assignees:["aaa","bbb","ccc"],
    };
    let activityC={
      name:"C",
      duration:5,
      description:"asdf",
      dependencies:[activityB],
      assignees:["aaa","bbb","ccc"],
    };
    let activityD={
      name:"D",
      duration:10,
      description:"asdf",
      dependencies:[activityC],
      assignees:["aaa","bbb","ccc"],
    };

    let activityF={
      name:"F",
      duration:15,
      description:"asdf",
      dependencies:[activityA],
      assignees:["aaa","bbb","ccc"],
    };
    let activityG={
      name:"G",
      duration:5,
      description:"asdf",
      dependencies:[activityF,activityC],
      assignees:["aaa","bbb","ccc"],
    };
    let activityH={
      name:"H",
      duration:15,
      description:"asdf",
      dependencies:[activityA],
      assignees:["aaa","bbb","ccc"],
    };

    let activityE={
      name:"E",
      duration:20,
      description:"asdf",
      dependencies:[activityD,activityG,activityH],
      assignees:["aaa","bbb","ccc"],
    };
    this.list.push(activityA);
    this.list.push(activityB);
    this.list.push(activityC);
    this.list.push(activityD);
    this.list.push(activityE);
    this.list.push(activityF);
    this.list.push(activityG);
    this.list.push(activityH);
    const sorted = this.cpProvider.topologicalSort(this.list);

    console.log(sorted);
    this.list = [];
  }

  test3() {
    let activityA={
      name:"A",
      duration:10,
      description:"asdf",
      dependencies:[],
      assignees:["aaa","bbb","ccc"],
    };
    let activityB={
      name:"B",
      duration:20,
      description:"asdf",
      dependencies:[activityA],
      assignees:["aaa","bbb","ccc"],
    };
    let activityC={
      name:"C",
      duration:5,
      description:"asdf",
      dependencies:[activityB],
      assignees:["aaa","bbb","ccc"],
    };
    let activityD={
      name:"D",
      duration:10,
      description:"asdf",
      dependencies:[activityC],
      assignees:["aaa","bbb","ccc"],
    };

    let activityF={
      name:"F",
      duration:15,
      description:"asdf",
      dependencies:[activityA],
      assignees:["aaa","bbb","ccc"],
    };
    let activityG={
      name:"G",
      duration:5,
      description:"asdf",
      dependencies:[activityF,activityC],
      assignees:["aaa","bbb","ccc"],
    };
    let activityH={
      name:"H",
      duration:15,
      description:"asdf",
      dependencies:[activityA],
      assignees:["aaa","bbb","ccc"],
    };

    let activityE={
      name:"E",
      duration:20,
      description:"asdf",
      dependencies:[activityD,activityG,activityH],
      assignees:["aaa","bbb","ccc"],
    };
    this.list.push(activityA);
    this.list.push(activityB);
    this.list.push(activityC);
    this.list.push(activityD);
    this.list.push(activityE);
    this.list.push(activityF);
    this.list.push(activityG);
    this.list.push(activityH);
    const top = this.cpProvider.topologicalSort(this.list);
    console.log(top);
    const path = this.cpProvider.calculateTimes(top);
    console.log(path);
    this.list = [];
  }

}
