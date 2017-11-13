/*
Khan's algorithm
https://en.wikipedia.org/wiki/Topological_sorting

L ← Empty list that will contain the sorted elements
S ← Set of all nodes with no incoming edge
while S is non-empty do
    remove a node n from S
    add n to tail of L
    for each node m with an edge e from n to m do
        remove edge e from the graph
        if m has no other incoming edges then
            insert m into S
if graph has edges then
    return error (graph has at least one cycle)
else
    return L (a topologically sorted order)


 */

/*
shortest path algorithm, maybe be adapted to do the opposite

    Let d be an array of the same length as V; this will hold the shortest-path distances from s. Set d[s] = 0, all other d[u] = ∞.
    Let p be an array of the same length as V, with all elements initialized to nil. Each p[u] will hold the predecessor of u in the shortest path from s to u.
    Loop over the vertices u as ordered in V, starting from s:
        For each vertex v directly following u (i.e., there exists an edge from u to v):
            Let w be the weight of the edge from u to v.
            Relax the edge: if d[v] > d[u] + w, set
                d[v] ← d[u] + w,
                p[v] ← u.
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



function calculateStartEndtimes(eventSet){
  var forwardPass=forwardPassCalculation((eventSet));
  var backwardPass=backwardPassCalculation((forwardPass));

  return backwardPass;
}


//calculates the earliest an event can start
function forwardPassCalculation(eventSet) {
  var calculatedNodes=[];
  var noIncomingEdgeSet=[];
  noIncomingEdgeSet=checkForNonDependencies(eventSet);//pushes nodes dont have any edges
  //console.log(noIncomingEdgeSet);

  // console.log(node);
  //calculates beginning and end times, and adds as a property
  while(noIncomingEdgeSet.length>0){

    //node 'n'
    var node=noIncomingEdgeSet.shift();// .shift takes from the first index
    if(node.dependencies.length===0){node.earliestStart=0}
    node.earliestEnd=node.earliestStart+node.duration;
    calculatedNodes.push(node);
    //check node dependency and remove edges
    for(var m=0;m<eventSet.length;m++){//for each node...
      //console.log(eventSet[m]);
      //console.log('comparing');
      //console.log(eventSet[m]);
      //console.log('with');
      //console.log(node);
      //console.log(m);
      if (checkForDependencyMatch(eventSet[m],node)) {//if node eventSet[m] connects with 'node' (n)..
        if(eventSet[m].earliestStart===null){//case where earliest start property hasnt been initialized
          eventSet[m].earliestStart=node.earliestEnd;
        }else if(eventSet[m].earliestStart<node.earliestEnd){//if the eventSet[m] node start earlier than 'node' 'n', replace the starting time
          eventSet[m].earliestStart=node.earliestEnd;
        }


        //console.log('dependency match');
        //console.log(eventSet[m]);



        //delete eventSet[m].dependencies[node];//remove the edge
        //console.log(eventSet[m].dependencies.indexOf(node));
        var index=eventSet[m].dependencies.indexOf(node);
        eventSet[m].dependencies.splice(index,1);
        //eventSet[m].dependencies[node]=null;

        //console.log(m);
        //console.log(eventSet[m]);
        if (eventSet[m].dependencies.length>0) {//if m has no other incoming edges then
          noIncomingEdgeSet.push(eventSet[m])//insert m into noIncomingEdgeSet
        }
        //console.log(eventSet[m]);
      }
    }
  }

  //checks for loops/cycles, otherwise returns the same set of nodes with added properties
  for(var i=0;i<eventSet.length;i++){
    if(eventSet[i].dependencies.length>0){
      console.log('still has dependencies')
      console.log(eventSet[i]);
      //return 'wut';
    }
  }
  //console.log(calculatedNodes);
  return calculatedNodes;
}

function checkForDependencyMatch(object1,object2){
  for(var i=0;i<object1.dependencies.length;i++){
    //console.log('checking');
    //console.log(object1.dependencies[i]);
    if(object1.dependencies[i]===object2){
      return true;
    }
  }
  return false;
}



//basically like the forward pass, but will go backwards going through child nodes first
function backwardPassCalculation(eventSet){
  var calculatedNodes=[];
  var incomingEdgeSet=[];
  incomingEdgeSet.push(eventSet.pop());//starts with the last node

  while(incomingEdgeSet!=null){
    var node=incomingEdgeSet.pop();

    //calculates beginning and end times, and adds as a property
    if(node.latestEnd===null)node.latestEnd=node.earliestEnd;//if not null, it was already added when checking for dependency
    node.latestStart=node.latestEnd-node.duration;

    calculatedNodes.push(node);


    //check for parent nodes
    for(m=0;m<eventSet.length;m++){
      for(i=0;i<node.dependencies.length;i++){
        if(node.dependencies[i]==eventSet[m].name){

          //case check, where more than one edge is found
          if(eventSet[m].latestEnd==null)eventSet[m].latestEnd=node.latestStart;
          else if(eventSet[m].latestEnd>node.latestStart)eventSet[m].latestStart=node.latestStart;//if the current node start earlier than the current node, replace the starting time

          delete eventSet[m].dependencies[node.name];//remove the edge
        }

        incomingEdgeSet.push(eventSet[node.dependencies[i]]);//add to list
      }
    }
  }

  //checks for loops/cycles, otherwise returns the same set of nodes with added properties
  for(i=0;i<eventSet.length;i++){
    if(eventSet[i].dependencies!=null)return 'wut';
    else return calculatedNodes;
  }
}

function checkForDependencies(nodeSet){
  var list=[];
  for(var i=0;i<nodeSet.length;i++){
    if(nodeSet[i].dependencies.length>=0){
      list.push(nodeSet[i]);
    }
  }
  return list;
}

function checkForNonDependencies(nodeSet){
  var list=[];
  for(var i=0;i<nodeSet.length;i++){
    if(nodeSet[i].dependencies.length===0){
      list.push(nodeSet[i]);
    }
  }
  return list;

}

console.log(forwardPassCalculation(exampleActivitySet));






























function findPaths(activitySet,beginningActivity,endingActivity){
  //base case
  if(beginningActivity==endingActivity){
    return beginningActivity;
  }


  //recursive case
  var candidatePathList=[];
  for(d=0;endingActivity["dependency"].length;d++){
    var currentActivity=activitySet[endingActivity["dependency"].name];

    candidatePathList.push(endingActivity);
    candidatePathList.unshift(findPaths(activitySet,beginningActivity,currentActivity));

    return candidatePathList;
  }
}
