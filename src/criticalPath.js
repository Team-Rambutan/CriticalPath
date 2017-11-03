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
function shortestPath(startNode){
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
  //console.log(names);
  console.log(paths);
  return Math.min.apply(Math,paths);
}

//returns all possible durations
function nameAndDurations(startNode){
  var paths=[];
  var names=[];

  function findAllPaths(startNode,currentCost){
    //base case
    if(startNode.dependencies.length===0){//if node has no dependencies (is at the beginning)...
      //console.log('base case');
      paths.push(currentCost);
      var currentCostObject=[currentCost];
      //console.log(currentCostObject);
      //paths.forEach(function(item,index){item.push(currentCostObject);});

      names.push((startNode.name,currentCost));
      //names.forEach(function(item,index){console.log(item+' at index:'+index);});
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
  //console.log(paths);


  return ('');
}



//input the last node into the function
//objects have dependencies that are *before* the node, hence
//instead of usually putting the head of the node into a longest
//path algorithm, the last node is put in instead
//console.log('shortest path:'+shortestPath(activityE));
//console.log('longest path:'+longestPath(activityE));
console.log(nameAndDurations(activityE));
