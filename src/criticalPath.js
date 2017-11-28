
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

console.log(calculateTimes(exampleActivitySet));
//calculateTimes(exampleActivitySet);


//main function for calculating times
function calculateTimes(activitySet){
  let result;
  result=forwardPass(activitySet);
  //console.log(result);
  result=backwardPass(result);
  //console.log(result);
  result=calculateFloatTimes(result);
  return result;
}

//forward pass calculations
function forwardPass(activitySet){
  let workingSet=clone(activitySet);
  let finishedNodes=[];

  while(workingSet.length>0){
    let nodeU=workingSet.shift();

    for(let i=0;i<workingSet.length;i++){
      let nodeV=workingSet[i];
      calculateTimesForwardPass(nodeU,nodeV);
      removeDependency(nodeU,nodeV);
    }
    finishedNodes.push(nodeU);

  }

  //console.log(finishedNodes);
  addCalculatedTimesForwardPass(activitySet,finishedNodes);

  return activitySet;
}

//backward pass calculation
function backwardPass(activitySet){
  activitySet.reverse();
  let finishedNodes=[];
  //console.log(activitySet);

  //first node initialization
  let nodeU=activitySet[0];
  nodeU.latestEnd=nodeU.earliestEnd;
  nodeU.latestStart=nodeU.latestEnd-nodeU.duration+1;
  //console.log(nodeU);

  //all the other nodes
  for(let i=0;i<activitySet.length;i++){
    let nodeU=activitySet[i];
    for(let j=0;j<nodeU.dependencies.length;j++) {
      //console.log(nodeU.dependencies);
      let nodeV=nodeU.dependencies[j];
      //console.log(nodeV);
      calculateTimesBackwardPass(nodeU,nodeV);
    }
    finishedNodes.push(nodeU);
  }
  //console.log(finishedNodes);
  return finishedNodes;
}

//checks if nodeU has a dependency of nodeV
function hasDependency(nodeU,nodeV){
  for(let i=0;i<nodeU.dependencies.length;i++){
    let condition1=nodeU.dependencies[i].name===nodeV.name;
    if(condition1){
      return true;
    }
  }
  return false;
}

//calculates est, eet
function calculateTimesForwardPass(nodeU,nodeV){
  //case if nodeU is the first node (earliest start time not initialized)
  if(!nodeU.hasOwnProperty('earliestStart')){
    nodeU.earliestStart=1;
    nodeU.earliestEnd=(nodeU.earliestStart-1)+nodeU.duration;
  }

  //checks if nodeU is a dependency of nodeV
  if(!hasDependency(nodeV,nodeU)){
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
function calculateTimesBackwardPass(nodeU,nodeV){

  //checks if nodeV is a dependency of nodeU

  //console.log('comparing');
  //console.log(nodeU);
  //console.log(nodeV);
  //console.log(hasDependency(nodeU,nodeV));
  if(!hasDependency(nodeU,nodeV)){
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
function calculateFloatTimes(activitySet){
  for (let i = 0; i < activitySet.length; i++) {
    activitySet[i].floatTime = activitySet[i].latestEnd - activitySet[i].earliestEnd;
  }
  return activitySet;
}

//remove the edge/dependency
function removeDependency(nodeU,nodeV){
  let index=nodeU.dependencies.indexOf(nodeV);
  nodeU.dependencies.splice(index,1);
}

//adds new values to the original set (which still has dependencies)
function addCalculatedTimesForwardPass(originalSet,workingSet) {
  for(let i=0;i<originalSet.length;i++){
    let newValues=workingSet[i];//todo, assumes that original set and working set is in same order
    originalSet[i].earliestStart=newValues.earliestStart;
    originalSet[i].earliestEnd=newValues.earliestEnd;
  }
  //console.log(originalSet);
}

function addCalculatedTimesBackwardPass(originalSet,workingSet){
  for(let i=0;i<originalSet.length;i++){
    let newValues=workingSet[i];//todo
    originalSet.latestStart=newValues.latestStart;
    originalSet.latestEnd=newValues.latestEnd;
  }
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

