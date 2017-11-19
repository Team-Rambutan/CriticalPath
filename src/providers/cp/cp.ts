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

  calculateTimes(topoEventSet){
    let forwardPassResult= this.forwardPassCalculation(topoEventSet);
    //console.log(forwardPassResult);
    let backwardPassResult= this.backwardPassCalculation(forwardPassResult);

    let finalResult=this.calculateFloatTimes(backwardPassResult);
    return finalResult;
  }

  //calculate float times
//when given an activity set with calculated earliest/latest start/end times, it will return the same result with the float times
  calculateFloatTimes(activityList) {
    for (let i = 0; i < activityList.length; i++) {
      activityList[i].floatTime = activityList[i].latestEnd - activityList[i].earliestEnd;
    }
    return activityList;
  }



//forward pass calculation, calculates the earliest times for each of the nodes, adding them as properties
  //forward pass calculation, calculates the earliest times for each of the nodes, adding them as properties
  forwardPassCalculation(topoEventSet){
    function clone(src) {
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
            r.push(clone(src[i]));
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
      return mixin(r, src, clone);

    }

    let originalSet=clone(topoEventSet);//keeps an original record of dependencies

    let finishedNodes=[];
    let inProcessNodes=[];

    //initialize the first node
    inProcessNodes.push(originalSet.shift());

    while(inProcessNodes.length>0){
      let nodeU=inProcessNodes.shift();

      //case for the first node
      if(!nodeU.hasOwnProperty('earliestStart')){
        nodeU.earliestStart=1
      }

      //calculate the earliest end time
      nodeU.earliestEnd=(nodeU.earliestStart-1)+nodeU.duration;
      //console.log(nodeU);
      //console.log(inProcessNodes);


      for(let i=0;i<originalSet.length;i++){//for each node in the working set...
        let nodeV=originalSet[i];

        //console.log(i);

        if(this.checkForDependencyMatch(nodeV,nodeU)){//For each vertex v directly following u...
          //calculate the earliest start times...
          if(!nodeV.hasOwnProperty('earliestStart')){//if earliest start time isn't initialized yet...
            //console.log(nodeV);
            nodeV.earliestStart=(nodeU.earliestEnd+1);//calculate start time
          }else if(nodeU.earliestEnd>nodeV.earliestStart){//else, compare start times (case where there are multiple edges
            nodeV.earliestStart=(nodeU.earliestEnd+1);
          }

          //calculate the earliest end time...
          nodeV.earliestEnd=(nodeV.earliestStart-1)+nodeV.duration;
          ///console.log(nodeV);


          //remove the edge/dependency
          let index=originalSet[i].dependencies.indexOf(nodeU);
          originalSet[i].dependencies.splice(index,1);

          //push nodeV into inProcessNodes to turn into nodeU's
          inProcessNodes.push(nodeV);
        }
      }

      //checks if node already has been calculated due to multiple dependencies, might have an updated earliestStart/earliestEnd
      if(this.contains(finishedNodes,nodeU)){
        //console.log(nodeU);
        let index=finishedNodes.indexOf(nodeU);
        finishedNodes.splice(index,1,nodeU);
        //console.log(finishedNodes);
      }else{
        finishedNodes.push(nodeU);
      }
      //console.log(inProcessNodes.length);
    }

    //console.log(finishedNodes);


    //add calculated times to originalSet
    for(let i=0;i<finishedNodes.length;i++){
      //console.log(topoEventSet.length);
      //console.log(i);
      let temp=finishedNodes[i];

      //console.log(topoEventSet.length);
      for(let j=0;j<topoEventSet.length;j++){

        if(topoEventSet[j].name===temp.name){
          topoEventSet[j].earliestStart=temp.earliestStart;
          topoEventSet[j].earliestEnd=temp.earliestEnd;
          break;
        }else{
          //console.log('not found');
        }
      }
      //console.log(node);
    }

    return topoEventSet;
  }

  //backward pass calculation, calculates the latest times for each of the nodes, adding them as properties
  backwardPassCalculation(forwardPassResult){
    //var workingSet=clone(forwardPassResult.reverse());
    let finishedNodes=[];
    let nodesToProcess=[];



    //initialize the first node 'U',calculate the latest times,
    let nodeU=forwardPassResult.pop();
    nodeU.latestEnd=nodeU.earliestEnd;
    nodeU.latestStart=nodeU.latestEnd-nodeU.duration+1;
    //console.log(nodeU);


    //console.log(workingSet);
    while(nodeU.dependencies.length>0) {
      //console.log(nodeU);
      let nodeV= this.containsName(JSON.parse(JSON.stringify(forwardPassResult)),nodeU.dependencies[0]);
      nodeU.dependencies.shift();//eliminate dependency

      //calculate the latest end times...
      if (!nodeV.hasOwnProperty('latestStart')) {//if latest start time isn't initialized yet...
        //console.log(nodeV);
        nodeV.latestEnd = (nodeU.latestStart-1);//calculate latest end time
      } else if (nodeU.latestStart < nodeV.latestEnd) {//else, compare start times (case where there are multiple edges
        nodeV.latestEnd = (nodeU.latestStart-1);
      }
      //console.log(nodeV);
      //calculate the latest start time...
      nodeV.latestStart = nodeV.latestEnd - (nodeV.duration-1);
      //console.log(nodeV);

      nodesToProcess.push(nodeV);


      finishedNodes.push(nodeU);
      nodeU=nodesToProcess.shift();//assign a new node 'U'

      //case for the beginning node
      if(nodeU.name===forwardPassResult[0].name&&nodesToProcess.length>0){
        nodesToProcess.push(nodeU);//keep pushing beginning node back until all other nodes are processed
      }

      console.log('start');
      console.log(nodeU);
      console.log('end');

      if(nodeU.name===forwardPassResult[0].name&&nodesToProcess.length===0){
        finishedNodes.push(nodeU);
      }

    }

    //finishedNodes.push(nodesToProcess.shift());
    //finishedNodes.push(nodesToProcess.shift());

    //console.log(nodesToProcess);
    //console.log(JSON.parse(JSON.stringify(finishedNodes)));
    console.log('end');

    return finishedNodes;
  }

  //given object1, checks if object2 exist in object1's dependency list
  checkForDependencyMatch(object1,object2){
    for(let i=0; i<object1.dependencies.length; i++){
      //console.log('checking');
      //console.log(object1.dependencies[i]);
      if(object1.dependencies[i].name===object2.name)
      //console.log('match');
        return true;
    }
    return false;
  }

//checks if an array has obj in it
  contains(a, obj) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] === obj) {
        return a[i];
      }
    }
    return false;
  }

//weak comparison
  containsName(a,obj){
    for (let i = 0; i < a.length; i++) {
      if (a[i].name === obj.name) {
        return a[i];
      }
    }
    return false;
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
