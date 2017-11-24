
//region example set
//example set to test with
let exampleActivitySet=[];
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

exampleActivitySet.push(activityA);
exampleActivitySet.push(activityF);
exampleActivitySet.push(activityB);
exampleActivitySet.push(activityH);
exampleActivitySet.push(activityG);
exampleActivitySet.push(activityC);
exampleActivitySet.push(activityD);
exampleActivitySet.push(activityE);
//console.log(exampleActivitySet);
//endregion

//example output
//assumes input is a topologically sorted array
console.log(longestPath(calculateTimes(exampleActivitySet)));
console.log(longestPathDuration(exampleActivitySet[exampleActivitySet.length-1]));

//calculate float times
//when given an activity set with calculated earliest/latest start/end times, it will return the same result with the float times
function calculateFloatTimes(activityList) {
  for (let i = 0; i < activityList.length; i++) {
    activityList[i].floatTime = activityList[i].latestEnd - activityList[i].earliestEnd;
  }
  return activityList;
}

//calculates the longest path
function longestPathDuration(startNode){
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
function shortestPathDuration(firstStartNode){
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

//combines both forwardPassCalculation and backwardPassCalculation function
//when given a topologically sorted event set, it will return the same result along with calculated earliest/latest start/end times
function calculateTimes(topoEventSet){
  let forwardPassResult=forwardPassCalculation(topoEventSet);
  //console.log(forwardPassResult);
  let backwardPassResult=backwardPassCalculation(forwardPassResult);
  //console.log(backwardPassResult);
  //let finalResult=calculateFloatTimes(backwardPassResult);

  return calculateFloatTimes(backwardPassResult);
}

//forward pass calculation, calculates the earliest times for each of the nodes, adding them as properties
function forwardPassCalculation(topoEventSet){
  //console.log(topoEventSet);
  let originalSet=clone(topoEventSet);//keeps an original record of dependencies
  let finishedNodes=[];
  let inProcessNodes=[];

  //initialize the first node
  inProcessNodes.push(topoEventSet.shift());


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


    for(let i=0;i<topoEventSet.length;i++){//for each node in the topologically sorted node set...
      let nodeV=topoEventSet[i];


      if(checkForDependencyMatch(nodeV,nodeU)){//For each vertex v directly following u...
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
        let index=topoEventSet[i].dependencies.indexOf(nodeU);
        topoEventSet[i].dependencies.splice(index,1);

        //push nodeV into inProcessNodes to turn into nodeU's
        inProcessNodes.push(nodeV);
      }
    }

    //checks if node already has been calculated due to multiple dependencies, might have an updated earliestStart/earliestEnd
    if(contains(finishedNodes,nodeU)){
      //console.log(nodeU);
      let index=finishedNodes.indexOf(nodeU);
      finishedNodes.splice(index,1,nodeU);
      //console.log(finishedNodes);
    }else{
      finishedNodes.push(nodeU);
    }
    //console.log(inProcessNodes.length);
  }

  //add calculated times to originalSet
  for(let i=0;i<originalSet.length;i++){
    //console.log(i);
    let node=originalSet[i];
    //console.log(originalSet);
    let temp=containsName(finishedNodes,node);
    node.earliestStart=temp.earliestStart;
    node.earliestEnd=temp.earliestEnd;
  }

  //console.log(finishedNodes);
  //console.log(originalSet);
  topoEventSet=originalSet;
  return topoEventSet;
}

//backward pass calculation, calculates the latest times for each of the nodes, adding them as properties
function backwardPassCalculation(forwardPassResult){
  //let workingSet=clone(forwardPassResult.reverse());
  let finishedNodes=[];
  let nodesToProcess=[];

  //initialize the first node 'U',calculate the latest times,
  let nodeU=forwardPassResult.pop();
  nodeU.latestEnd=nodeU.earliestEnd;
  nodeU.latestStart=nodeU.latestEnd-nodeU.duration+1;
  //console.log(nodeU);

  //console.log(workingSet);
  while(nodeU.dependencies.length>0) {
    //console.log(nodeU.dependencies[i]);
    let nodeV=containsName(forwardPassResult,nodeU.dependencies[0]);
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

    if(nodeU.dependencies.length===0){
      finishedNodes.push(nodeU);
      nodeU=nodesToProcess.shift();//assign a new node 'U'
      //console.log(nodeU);
    }

    if(nodeU.dependencies.length===0&&nodesToProcess.length>0){//checks if the newly assigned nodeU is the beginning of the graph
      for(let i=0;i<nodesToProcess.length;i++){
        nodeU=nodesToProcess.shift();
        if(nodeU.dependencies.length>0)break;
        nodesToProcess.push(nodeU);
      }
    }
  }

  finishedNodes.push(nodesToProcess.shift());
  //console.log(nodesToProcess);

  //console.log(finishedNodes);
  return finishedNodes;
}

//given a list of activities with calculated earliest/latest start/end times, will return a longest path list
function longestPath(activityList){
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

//given object1, checks if object2 exist in object1's dependency list
function checkForDependencyMatch(object1,object2){
  for(let i=0; i<object1.dependencies.length; i++){
    //console.log('checking');
    //console.log(object1.dependencies[i]);
    if(object1.dependencies[i]===object2)
      //console.log('match');
      return true;
    }
  return false;
}

//checks if an array has obj in it
function contains(a, obj) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] === obj) {
      return a[i];
    }
  }
  return false;
}

//weak comparison
function containsName(a,obj){
  for (let i = 0; i < a.length; i++) {
    if (a[i].name === obj.name) {
      return a[i];
    }
  }
  return false;
}

//cloning objects
//https://davidwalsh.name/javascript-clone
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
