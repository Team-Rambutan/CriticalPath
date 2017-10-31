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
function longestPath(wGraph,startNode){
  var paths=[];

  function findAllPaths(startNode,currentCost){
    for(var i=0;i<startNode.dependencies.length;i++){//for each of the dependency...
      console.log(i);
      var child=startNode.dependencies[i];


      console.log(child);
      console.log(currentCost);

      if(child.dependencies===null){//if its null (meaning reach to other side of tree)...
        paths.push(currentCost);//push to path variable
      }else{
        var nextChild=child.dependencies[0];
        findAllPaths(wGraph[nextChild],currentCost+startNode.duration);//recursively call function
      }
    }
  }

  findAllPaths(startNode,1);
  return Math.max.apply(Math,paths)
}

console.log(activityE);
console.log(longestPath(exampleActivitySet,activityE));

