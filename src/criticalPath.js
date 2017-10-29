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


//each node will need..
//name
//duration*
//description
//dependencies*
//assignees

//eventSet is a list/array of node objects

var nodeObjectExample={
  name:"name",
  duration:1,
  description:"asdf",
  dependencies:["a","b","c"],
  assignees:["aaa","bbb","ccc"],
}

function calculateStartEndtimes(eventSet){
  var forwardPass=forwardPassCalculation((eventSet));
  var backwardPass=backwardPassCalculation((forwardPass));

  return backwardPass;
}


//calculates the earliest an event can start
function forwardPassCalculation(eventSet) {
  var calculatedNodes=[];
  var noIncomingEdgeSet=[];
  noIncomingEdgeSet.push(eventSet.forEach(checkForDependencies()));

  while(noIncomingEdgeSet!=null){
    var node=noIncomingEdgeSet.pop()

    //calculates beginning and end times, and adds as a property
    if(node.earliestStart==null)node.earliestStart=0;//if not null, it was already added when checking for dependency
    node.earliestEnd=node.earliestStart+node.duration;

    calculatedNodes.push(node)


    //check node dependency and remove edges
    for(m=0;m<eventSet.length;m++){//scans for dependencies
      if (eventSet[m].dependencies[node.name]) {//if a node is found as a dependent...

        //case check, where more than one edge is found
        if(eventSet[m].earliestStart==null)eventSet[m].earliestStart=node.earliestEnd;
        else if(eventSet[m].earliestStart<node.earliestEnd)eventSet[m].earliestStart=node.earliestEnd;//if the current node start earlier than the current node, replace the starting time

        delete eventSet[m].dependencies[node.name];//remove the edge
        if (eventSet[m].dependencies == null) {//if m has no other incoming edges then
          noIncomingEdgeSet.push(eventSet[m])//insert m into noIncomingEdgeSet
        }
      }
    }
  }

  //checks for loops/cycles, otherwise returns the same set of nodes with added properties
  for(i=0;i<eventSet.length;i++){
    if(eventSet[i].dependencies!=null)return 'wut';
    else return calculatedNodes;
  }
}

//basically like the forward pass, but will go backwards going through child nodes first
function backwardPassCalculation(eventSet){
  var calculatedNodes=[];
  var incomingEdgeSet=[];
  incomingEdgeSet.push(eventSet.pop());//starts with the last node

  while(incomingEdgeSet!=null){
    var node=incomingEdgeSet.pop();

    //calculates beginning and end times, and adds as a property
    if(node.latestEnd==null)node.latestEnd=node.earliestEnd;//if not null, it was already added when checking for dependency
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




//why do i even need this
function KahnAlgorithm(eventSet){
  var L=[];//L ← Empty list that will contain the sorted elements

  var S=[];//S ← Set of all nodes with no incoming edge
  S.push(eventSet.forEach(checkForDependencies))


  while(S!=null) {//while S is non-empty do
    var node = S.pop()//remove a node n from S
    L.push(node)//add n to tail of L

    for (m = 0; m < eventSet.length; m++) {//for each node m with...
      if (eventSet[m].dependencies[node.name]) {// an edge e from n to m do...
        delete eventSet[m].dependencies[node.name];//remove edge e from the graph
        if (eventSet[m].dependencies == null) {//if m has no other incoming edges then
          S.push(eventSet[m])//insert m into S
        }
      }
    }
  }

  for(node=0;node<eventSet.length();node++){
    if(eventSet[node].dependencies!=null){//if graph has edges then
      return 'wut happened';//return error (graph has at least one cycle)
    }else{//else
      return L;//return L (a topologically sorted order)
    }
  }


}

function checkForDependencies(node){
 if(node.dependencies==null)return node;
}
