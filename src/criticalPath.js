
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
  result=backwardPass(result);
  result=calculateFloatTimes(result);
  return result;
}

//forward pass calculations
function forwardPass(activitySet){
  let finishedNodes=[];

  //first node initialization
  let nodeU=activitySet[0];
  nodeU.earliestStart=1;
  nodeU.earliestEnd=nodeU.earliestStart+nodeU.duration-1;

  while(activitySet.length>0){
    let nodeU=activitySet.shift();

    for(let i=0;i<activitySet.length;i++){
      let nodeV=activitySet[i];
      calculateTimesForwardPass(nodeU,nodeV);
    }
    finishedNodes.push(nodeU);

  }
  return finishedNodes;
}

//backward pass calculation
function backwardPass(activitySet){
  activitySet.reverse();
  let finishedNodes=[];

  //first node initialization
  let nodeU=activitySet[0];
  nodeU.latestEnd=nodeU.earliestEnd;
  nodeU.latestStart=nodeU.latestEnd-nodeU.duration+1;

  //all the other nodes
  for(let i=0;i<activitySet.length;i++){
    let nodeU=activitySet[i];
    for(let j=0;j<nodeU.dependencies.length;j++) {
      let nodeV=nodeU.dependencies[j];
      calculateTimesBackwardPass(nodeU,nodeV);
    }
    finishedNodes.push(nodeU);
  }
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
  return nodeV;
}

//calculate let,lst
function calculateTimesBackwardPass(nodeU,nodeV){
  //checks if nodeV is a dependency of nodeU
  if(!hasDependency(nodeU,nodeV)){
    return;
  }

  //calculate the latest end times...
  if (!nodeV.hasOwnProperty('latestStart')) {//if latest start time isn't initialized yet...
    nodeV.latestEnd = (nodeU.latestStart-1);//calculate latest end time
  } else if (nodeU.latestStart < nodeV.latestEnd) {//else, compare start times (case where there are multiple edges
    nodeV.latestEnd = (nodeU.latestStart-1);
  }
  //calculate the latest start time...
  nodeV.latestStart = nodeV.latestEnd - (nodeV.duration-1);
  return nodeV;
}

//calculate float times
function calculateFloatTimes(activitySet){
  for (let i = 0; i < activitySet.length; i++) {
    activitySet[i].floatTime = activitySet[i].latestEnd - activitySet[i].earliestEnd;
  }
  return activitySet;
}
