/*
original example/resources
creately.com/blog/diagrams/critical-path-method-projects/#.WfVvtrGkBcU.gmail
https://www.youtube.com/watch?v=W_HCC3a5tmA
https://en.wikipedia.org/wiki/Topological_sorting
 */

/*
super simple code for finding longest path
https://stackoverflow.com/questions/20270811/how-can-i-calculate-the-shortest-and-longest-paths-of-this-qa-flow
 */

/*
another resource for finding longest path
http://www.geeksforgeeks.org/find-longest-path-directed-acyclic-graph/
 */

//region example set
//example set to test with
var exampleActivitySet=[];
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
  name:"F",
  duration:15,
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

var exampleActivitySet2=[
  { name: 'A',
  duration: 10,
  description: 'asdf',
  dependencies: [],
  assignees: [ 'aaa', 'bbb', 'ccc' ],
  earliestStart: 0,
  earliestEnd: 10 },
  { name: 'F',
    duration: 15,
    description: 'asdf',
    dependencies: [],
    assignees: [ 'aaa', 'bbb', 'ccc' ],
    earliestStart: 10,
    earliestEnd: 25 },
  { name: 'B',
    duration: 20,
    description: 'asdf',
    dependencies: [],
    assignees: [ 'aaa', 'bbb', 'ccc' ],
    earliestStart: 10,
    earliestEnd: 30 },
  { name: 'H',
    duration: 15,
    description: 'asdf',
    dependencies: [],
    assignees: [ 'aaa', 'bbb', 'ccc' ],
    earliestStart: 10,
    earliestEnd: 25 },
  { name: 'G',
    duration: 5,
    description: 'asdf',
    dependencies: [],
    assignees: [ 'aaa', 'bbb', 'ccc' ],
    earliestStart: 35,
    earliestEnd: 40 },
  { name: 'C',
    duration: 5,
    description: 'asdf',
    dependencies: [],
    assignees: [ 'aaa', 'bbb', 'ccc' ],
    earliestStart: 30,
    earliestEnd: 35 },
  { name: 'D',
    duration: 10,
    description: 'asdf',
    dependencies: [],
    assignees: [ 'aaa', 'bbb', 'ccc' ],
    earliestStart: 35,
    earliestEnd: 45 },
  { name: 'E',
    duration: 20,
    description: 'asdf',
    dependencies: [],
    assignees: [ 'aaa', 'bbb', 'ccc' ],
    earliestStart: 45,
    earliestEnd: 65 },];

//calculates the longest path
function longestPath(startNode){
  var paths=[];
  var names=[];


  function findAllPaths(startNode,currentCost){
    //base case
    if(startNode.dependencies.length===0){//if node has no dependencies (is at the beginning)...
      //console.log('base case');
      paths.push(currentCost);
      names.push(startNode.name,'end of path');
    }

    //recursive case
    //console.log('recursive case');
    for(var i=0;i<startNode.dependencies.length;i++){//for each edge (dependencies) of the node...
      var child=startNode.dependencies[i];
      names.push(startNode.name);
      findAllPaths(startNode.dependencies[i],currentCost+child.duration);//recursively find the next node until base case is satisfied
    }
  }//end findAllPaths function


  findAllPaths(startNode,startNode.duration);
  //console.log(paths);
  console.log(names);
  return Math.max.apply(Math,paths);
}

//calculate the shortest distance.
function shortestPath(firstStartNode){
  var paths=[];
  var names=[];


  function findAllPaths(startNode,currentCost){
    //base case
    if(startNode.dependencies.length===0){//if node has no dependencies (is at the beginning)...
      //console.log('base case');
      paths.push(currentCost);
      names.push(startNode.name,'end of path');
    }

    //recursive case
    //console.log('recursive case');
    for(var i=0;i<startNode.dependencies.length;i++){//for each edge (dependencies) of the node...
      var child=startNode.dependencies[i];
      names.push(startNode.name);
      findAllPaths(child,currentCost+child.duration);//recursively find the next node until base case is satisfied
    }
  }//end findAllPaths function


  findAllPaths(firstStartNode,firstStartNode.duration);
  //console.log(paths);
  console.log(names);
  return Math.min.apply(Math,paths);
}

function calculateTimes(topoEventSet){
  var forwardPassResult=forwardPassCalculation(topoEventSet);
  //console.log(forwardPassResult);
  var backwardPassResult=backwardPassCalculation(forwardPassResult);
  return backwardPassResult;
}


//forward pass calculation, calculates the earliest times for each of the nodes, adding them as properties
function forwardPassCalculation(topoEventSet){
  //console.log(topoEventSet);
  var originalSet=clone(topoEventSet);//keeps an original record of dependencies
  var finishedNodes=[];
  var inProcessNodes=[];

  //initialize the first node
  inProcessNodes.push(topoEventSet.shift());


  while(inProcessNodes.length>0){
    var nodeU=inProcessNodes.shift();
    if(!nodeU.hasOwnProperty('earliestStart')){nodeU.earliestStart=1};//case for the first node
    nodeU.earliestEnd=(nodeU.earliestStart-1)+nodeU.duration;//calculate the earliest end time
    //console.log(nodeU);
    //console.log(inProcessNodes);


    for(var i=0;i<topoEventSet.length;i++){//for each node in the topologically sorted node set...
      var nodeV=topoEventSet[i];


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
        var index=topoEventSet[i].dependencies.indexOf(nodeU);
        topoEventSet[i].dependencies.splice(index,1);

        //push nodeV into inProcessNodes to turn into nodeU's
        inProcessNodes.push(nodeV);
      }
    }

    //checks if node already has been calculated due to multiple dependencies, might have an updated earliestStart/earliestEnd
    if(contains(finishedNodes,nodeU)){
      //console.log(nodeU);
      var index=finishedNodes.indexOf(nodeU);
      finishedNodes.splice(index,1,nodeU);
      //console.log(finishedNodes);
    }else{
      finishedNodes.push(nodeU);
    }



    //console.log(inProcessNodes.length);
  }

  //add calculated times to originalSet
  for(var i=0;i<originalSet.length;i++){
    //console.log(i);
    var node=originalSet[i];
    //console.log(originalSet);
    var temp=containsName(finishedNodes,node);
    node.earliestStart=temp.earliestStart;
    node.earliestEnd=temp.earliestEnd;
  }

/*
  //add back dependencies
  for(var i=0;i<finishedNodes.length;i++){
    //console.log(i);
    var node=finishedNodes[i];
    //console.log(originalSet);
    var temp=containsName(originalSet,node);
    finishedNodes[i].dependencies=temp.dependencies;
  }
*/

  //console.log(finishedNodes);
  //console.log(originalSet);
  return originalSet;
}

//backward pass calculation, calculates the latest times for each of the nodes, adding them as properties
function backwardPassCalculation(forwardPassResult){
  //var workingSet=clone(forwardPassResult.reverse());
  var finishedNodes=[];
  var nodesToProcess=[];

  //initialize the first node 'U',calculate the latest times,
  var nodeU=forwardPassResult.pop();
  nodeU.latestEnd=nodeU.earliestEnd;
  nodeU.latestStart=nodeU.latestEnd-nodeU.duration+1;
  //console.log(nodeU);


  //console.log(workingSet);
  while(nodeU.dependencies.length>0) {
    //console.log(nodeU.dependencies[i]);
    var nodeV=containsName(forwardPassResult,nodeU.dependencies[0]);
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
      for(var i=0;i<nodesToProcess.length;i++){
        nodeU=nodesToProcess.shift();
        if(nodeU.dependencies.length>0)break;
        nodesToProcess.push(nodeU);
      }
    }
  }

  finishedNodes.push(nodesToProcess.shift());
  //console.log(nodesToProcess);

  console.log(finishedNodes);
  return finishedNodes;
}

//given object1, checks if object2 exist in object1's dependency list
function checkForDependencyMatch(object1,object2){
  for(var i=0;i<object1.dependencies.length;i++){
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
  for (var i = 0; i < a.length; i++) {
    if (a[i] === obj) {
      return a[i];
    }
  }
  return false;
}

//weak comparison
function containsName(a,obj){
  for (var i = 0; i < a.length; i++) {
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
    var name, s, i, empty = {};
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
  var r, i, l;
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


//forwardPassCalculation(exampleActivitySet);//okay i think this works
//backwardPassCalculation(exampleActivitySet);//should only works with forwardPassCalculation result
//(exampleActivitySet);
console.log(calculateTimes(exampleActivitySet));
//console.log(forwardPassCalculation((exampleActivitySet)));
