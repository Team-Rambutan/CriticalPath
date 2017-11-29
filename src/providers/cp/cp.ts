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

  // Takes in a list of nodes which are in order of the critical path
  calculateCritPathDuration(critPath) {
    let duration = 0;
    for(let i = 0; i < critPath.length; i++) {
      duration += critPath[i].duration;
    }
    return duration;
  }

  shortAndLong(tree, startNode) {
    let paths = [];
    function findAllPaths(startNode, currentCost) {
      //base case
      if (startNode.dependencies.length == 0) {
        //console.log('base case');
        paths.push(currentCost);
      }

      //recursive case
      for (let i = 0; i < startNode.dependencies.length; i++) {
        //console.log('recursive case');
        let child = startNode.dependencies[i];
        findAllPaths(startNode.dependencies[i], currentCost + child.duration);
      }
    }//end findAllPaths function
    findAllPaths(startNode,startNode.duration);
    return Math.max.apply(Math,paths)
  }

  //calculates the longest path
  longestPathDuration(startNode){
    let paths=[];
    let names=[];

    function findAllPaths(startNode,currentCost){
      //base case
      if(startNode.dependencies.length===0){//if node has no dependencies (is at the beginning)...
        //console.log('base case');
        paths.push(currentCost);
        names.push(startNode.name,'end of path');
      }

      //recursive case
      //console.log('recursive case');
      for(let i=0; i<startNode.dependencies.length; i++){//for each edge (dependencies) of the node...
        let child=startNode.dependencies[i];
        names.push(startNode.name);
        findAllPaths(startNode.dependencies[i],currentCost+child.duration);//recursively find the next node until base case is satisfied
      }
    }//end findAllPaths function


    findAllPaths(startNode,startNode.duration);
    //console.log(paths);
    //console.log(names);
    return Math.max.apply(Math,paths);
  }

  //calculate the shortest distance.
  shortestPathDuration(firstStartNode){
    let paths=[];
    let names=[];

    function findAllPaths(startNode,currentCost){
      //base case
      if(startNode.dependencies.length===0){//if node has no dependencies (is at the beginning)...
        //console.log('base case');
        paths.push(currentCost);
        names.push(startNode.name,'end of path');
      }

      //recursive case
      //console.log('recursive case');
      for(let i=0; i<startNode.dependencies.length; i++){//for each edge (dependencies) of the node...
        let child=startNode.dependencies[i];
        names.push(startNode.name);
        findAllPaths(child,currentCost+child.duration);//recursively find the next node until base case is satisfied
      }
    }//end findAllPaths function


    findAllPaths(firstStartNode,firstStartNode.duration);
    //console.log(paths);
    console.log(names);
    return Math.min.apply(Math,paths);
  }

//main function for calculating times
  calculateTimes(activitySet){
    let result;
    result=this.forwardPass(activitySet);
    //console.log(result);
    result=this.backwardPass(result);
    //console.log(result);
    result=this.calculateFloatTimes(result);
    return result;
  }


//forward pass calculations
  forwardPass(activitySet){
    let workingSet=activitySet;
    let finishedNodes=[];
    while(workingSet.length>0){
      let nodeU=workingSet.shift();

      for(let i=0;i<workingSet.length;i++){
        let nodeV=workingSet[i];
        this.calculateTimesForwardPass(nodeU,nodeV);
      }
      finishedNodes.push(nodeU);
    }




    //console.log(finishedNodes);
    return finishedNodes;
  }

//backward pass calculation
  backwardPass(activitySet){
    let workingSet=activitySet;
    workingSet.reverse();
    let finishedNodes=[];




    while(workingSet.length>0){
      let nodeU=workingSet.shift();

      //case if nodeU is the first node (earliest start time not initialized)
      if(!nodeU.hasOwnProperty('latestStart')){
        nodeU.latestEnd=nodeU.earliestEnd;
        nodeU.latestStart=(nodeU.latestEnd+1)-nodeU.duration;
      }

      for(let i=0;i<workingSet.length;i++){
        let nodeV=workingSet[i];
        this.calculateTimesBackwardPass(nodeU,nodeV);
      }
      finishedNodes.push(nodeU);
    }
    console.log('start');
    console.log(JSON.parse(JSON.stringify(finishedNodes)));
    console.log('end');
    return finishedNodes;
  }

//checks if nodeU has a dependency of nodeV
  hasDependency(nodeU,nodeV){
    for(let i=0;i<nodeU.dependencies.length;i++){
      let condition1=nodeU.dependencies[i].name===nodeV.name;
      if(condition1){
        return true;
      }
    }
    return false;
  }

  //calculates est, eet
  calculateTimesForwardPass(nodeU,nodeV){
    //case if nodeU is the first node (earliest start time not initialized)
    if(!nodeU.hasOwnProperty('earliestStart')){
      nodeU.earliestStart=1;
      nodeU.earliestEnd=(nodeU.earliestStart-1)+nodeU.duration;
    }

    //checks if nodeU is a dependency of nodeV
    if(!this.hasDependency(nodeV,nodeU)){
      return;
    }

    //calculate the earliest start times...
    if(!nodeV.hasOwnProperty('earliestStart')){//if earliest start time isn't initialized yet...
      nodeV.earliestStart=(nodeU.earliestEnd+1);//calculate start time
    }
    else if(nodeU.earliestEnd>nodeV.earliestStart){//else, compare start times (case where there are multiple edges
      nodeV.earliestStart=(nodeU.earliestEnd+1);
    }

    //calculate the earliest end time...
    nodeV.earliestEnd=(nodeV.earliestStart-1)+nodeV.duration;
  }

//calculate let,lst
  calculateTimesBackwardPass(nodeU,nodeV){

    //case if nodeU is the first node (earliest start time not initialized)
    if(!nodeU.hasOwnProperty('earliestStart')){
      nodeU.earliestStart=1;
      nodeU.earliestEnd=(nodeU.earliestStart-1)+nodeU.duration;
    }


    //checks if nodeV is a dependency of nodeU
    //console.log('comparing');
    //console.log(nodeU);
    //console.log(nodeV);
    //console.log(hasDependency(nodeU,nodeV));
    if(!this.hasDependency(nodeU,nodeV)){
      return;
    }

    //calculate the latest end times...
    if (!nodeV.hasOwnProperty('latestStart')) {//if latest start time isn't initialized yet...
      //nodeV.latestStart=0;//initialize latest start first to display order
      nodeV.latestEnd = (nodeU.latestStart-1);//calculate latest end time
    } else if (nodeU.latestStart < nodeV.latestEnd) {//else, compare start times (case where there are multiple edges
      nodeV.latestEnd = (nodeU.latestStart-1);
    }
    //console.log(nodeV);
    //calculate the latest start time...
    nodeV.latestStart = nodeV.latestEnd - (nodeV.duration-1);
    //console.log(nodeV);
  }

//calculate float times
  calculateFloatTimes(activitySet){
    for (let i = 0; i < activitySet.length; i++) {
      activitySet[i].floatTime = activitySet[i].latestEnd - activitySet[i].earliestEnd;
    }
    return activitySet;
  }

//remove the edge/dependency
  removeDependency(nodeU,nodeV){
    let index=nodeU.dependencies.indexOf(nodeV);
    nodeU.dependencies.splice(index,1);
  }


//cloning objects
//https://davidwalsh.name/javascript-clone
  clone(src) {
    function mixin(dest, source, copyFunc) {
      let name, s, i, empty = {};
      for(name in source){
        // the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
        // inherited from Object.prototype.	 For example, if dest has a custom toString() method,
        // don't overwrite it with the toString() method that source inherited from Object.prototype
        s = source[name];
        if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
          dest[name] = copyFunc ? copyFunc(s) : s;
        }
      }
      return dest;
    }

    if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
      // null, undefined, any non-object, or function
      return src;	// anything
    }
    if(src.nodeType && "cloneNode" in src){
      // DOM Node
      return src.cloneNode(true); // Node
    }
    if(src instanceof Date){
      // Date
      return new Date(src.getTime());	// Date
    }
    if(src instanceof RegExp){
      // RegExp
      return new RegExp(src);   // RegExp
    }
    let r, i, l;
    if(src instanceof Array){
      // array
      r = [];
      for(i = 0, l = src.length; i < l; ++i){
        if(i in src){
          r.push(this.clone(src[i]));
        }
      }
      // we don't clone functions for performance reasons
      //		}else if(d.isFunction(src)){
      //			// function
      //			r = function(){ return src.apply(this, arguments); };
    }else{
      // generic objects
      r = src.constructor ? new src.constructor() : {};
    }
    return mixin(r, src, this.clone);
  }

  //given a list of activities with calculated earliest/latest start/end times, will return a longest path list
  longestPath(activityList){
    let result=[];
    for(let i=0;i<activityList.length;i++){
      //console.log(i);
      let condition1=activityList[i].earliestEnd-activityList[i].latestEnd===0;
      let condition2=activityList[i].earliestStart-activityList[i].latestStart===0;

      if(condition1&&condition2){
        result.push(activityList[i]);
      }
    }

    result.reverse();
    return result;
  }

  /* Helper method and Top Sort method */
  // Performs a basic top sort, returns an array of activity names in a top order
  removeEdge(adjacentVertex, node) {
    node.dependencies = node.dependencies.filter(vertex => vertex.name !== adjacentVertex);
    return node;
  }

  topologicalSort(nodes: any[]) {
    console.log(nodes);

    const saved = JSON.parse(JSON.stringify(nodes));
    const hasIncomingEdges = node => node.dependencies.length;
    const noIncomingEdges = node => !node.dependencies.length;
    let noEdges = nodes.filter(noIncomingEdges),
      withEdges = nodes.filter(hasIncomingEdges),
      sorted = [];

    while (noEdges.length) {
      const node = noEdges.pop();
      sorted.push(node);

      withEdges = withEdges.map( this.removeEdge.bind(null, node.name) );
      const newNoEdges = withEdges.filter(noIncomingEdges);
      noEdges = noEdges.concat(newNoEdges);
      withEdges = withEdges.filter(hasIncomingEdges);
    }
   // console.log(sorted);

    for(let x = 0; x <saved.length; x++) {
      for(let y = 0; y < sorted.length; y++) {
        if(sorted[y].name == saved[x].name){
          sorted[y].dependencies = saved[x].dependencies;
        }
      }
    }
    console.log("this is sorted with dependencies\n");
    console.log(sorted);
    return sorted;
  }

}
