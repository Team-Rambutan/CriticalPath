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
exampleActivitySet.push(activityA);
exampleActivitySet.push(activityB);
exampleActivitySet.push(activityC);
exampleActivitySet.push(activityD);
exampleActivitySet.push(activityE);
exampleActivitySet.push(activityF);
exampleActivitySet.push(activityG);
exampleActivitySet.push(activityH);
//console.log(exampleActivitySet);
//endregion

//find the longest path
function longestPath(startNode){
  var paths=[];

  function findAllPaths(startNode,currentCost){
    //base case
    if(startNode.dependencies.length===0){
      //console.log('base case');
      paths.push(currentCost)
    }

    //recursive case
    for(var i=0;i<startNode.dependencies.length;i++){
      //console.log('recursive case');
      var child=startNode.dependencies[i];
      findAllPaths(startNode.dependencies[i],currentCost+child.duration);
    }
  }//end findAllPaths function



  findAllPaths(startNode,1);
  return Math.max.apply(Math,paths);
}

//calculate the shortest distance.
function shortestPath(startNode){
  var paths=[];

  function findAllPaths(startNode,currentCost){
    //base case
    if(startNode.dependencies.length===0){
      //console.log('base case');
      paths.push(currentCost)
    }

    //recursive case
    for(var i=0;i<startNode.dependencies.length;i++){
      //console.log('recursive case');
      var child=startNode.dependencies[i];
      findAllPaths(startNode.dependencies[i],currentCost+child.duration);
    }
  }//end findAllPaths function



  findAllPaths(startNode,1);
  return Math.min.apply(Math,paths);
}

console.log(activityE);
//input the last node into the function
//objects have dependencies that are *before* the node, hence
//instead of usually putting the head of the node into a longest
//path algorithm, the last node is put in instead
console.log('shortest path:'+shortestPath(activityE));
console.log('longest path:'+longestPath(activityE));

