import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the CpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CpProvider {

  constructor(public http: Http) {
    console.log('Hello CpProvider Provider');
  }


  shortAndLong(tree, startNode) {
    var paths = [];

    function findAllPaths(startNode, currentCost) {
      //base case
      if (startNode.dependencies.length == 0) {
        //console.log('base case');
        paths.push(currentCost);
      }

      //recursive case
      for (var i = 0; i < startNode.dependencies.length; i++) {
        //console.log('recursive case');
        var child = startNode.dependencies[i];
        findAllPaths(startNode.dependencies[i], currentCost + child.duration);
      }
    }//end findAllPaths function
    findAllPaths(startNode,startNode.duration);
    return Math.max.apply(Math,paths)
  }


}
