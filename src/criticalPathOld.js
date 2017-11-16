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
exampleActivitySet.push(activityB);
exampleActivitySet.push(activityC);
exampleActivitySet.push(activityD);
exampleActivitySet.push(activityE);
exampleActivitySet.push(activityF);
exampleActivitySet.push(activityG);
exampleActivitySet.push(activityH);
//console.log(exampleActivitySet);
//endregion



/*
1) Initialize dist[] = {NINF, NINF, ….} and dist[s] = 0 where s is the source vertex. Here NINF means negative infinite.
2) Create a toplogical order of all vertices.
3) Do following for every vertex u in topological order.
………..Do following for every adjacent vertex v of u
………………if (dist[v] < dist[u] + weight(u, v))
………………………dist[v] = dist[u] + weight(u, v)
 */
function longestPath(activityList){
  let result=[];
  for(let i=0;i<activityList.length;i++){

    let condition1=activityList[i].earliestEnd-activityList[i].latestEnd===0;
    let condition2=activityList[i].earliestStart-activityList[i].latestStart===0;


    if(condition1&&condition2){
      result.push(activityList[i]);
    }
  }
}
