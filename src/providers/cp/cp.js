var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
/*
  Generated class for the CpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var CpProvider = (function () {
    function CpProvider(http) {
        this.http = http;
        console.log('Hello CpProvider Provider');
    }
    // Takes in a list of nodes which are in order of the critical path
    CpProvider.prototype.calculateCritPathDuration = function (critPath) {
        var duration = 0;
        for (var i = 0; i < critPath.length; i++) {
            duration += critPath[i].duration;
        }
        return duration;
    };
    CpProvider.prototype.shortAndLong = function (tree, startNode) {
        var paths = [];
        function findAllPaths(startNode, currentCost) {
            //base case
            if (startNode.dependencies.length == 0) {
                //console.log('base case');
                paths.push(currentCost);
            }
            //recursive case
            for (var i = 0; i < startNode.dependencies.length; i++) {
                //console.log('recursive case');
                var child = startNode.dependencies[i];
                findAllPaths(startNode.dependencies[i], currentCost + child.duration);
            }
        } //end findAllPaths function
        findAllPaths(startNode, startNode.duration);
        return Math.max.apply(Math, paths);
    };
    //calculates the longest path
    CpProvider.prototype.longestPathDuration = function (startNode) {
        var paths = [];
        var names = [];
        function findAllPaths(startNode, currentCost) {
            //base case
            if (startNode.dependencies.length === 0) {
                //console.log('base case');
                paths.push(currentCost);
                names.push(startNode.name, 'end of path');
            }
            //recursive case
            //console.log('recursive case');
            for (var i = 0; i < startNode.dependencies.length; i++) {
                var child = startNode.dependencies[i];
                names.push(startNode.name);
                findAllPaths(startNode.dependencies[i], currentCost + child.duration); //recursively find the next node until base case is satisfied
            }
        } //end findAllPaths function
        findAllPaths(startNode, startNode.duration);
        //console.log(paths);
        //console.log(names);
        return Math.max.apply(Math, paths);
    };
    //calculate the shortest distance.
    CpProvider.prototype.shortestPathDuration = function (firstStartNode) {
        var paths = [];
        var names = [];
        function findAllPaths(startNode, currentCost) {
            //base case
            if (startNode.dependencies.length === 0) {
                //console.log('base case');
                paths.push(currentCost);
                names.push(startNode.name, 'end of path');
            }
            //recursive case
            //console.log('recursive case');
            for (var i = 0; i < startNode.dependencies.length; i++) {
                var child = startNode.dependencies[i];
                names.push(startNode.name);
                findAllPaths(child, currentCost + child.duration); //recursively find the next node until base case is satisfied
            }
        } //end findAllPaths function
        findAllPaths(firstStartNode, firstStartNode.duration);
        //console.log(paths);
        console.log(names);
        return Math.min.apply(Math, paths);
    };
    CpProvider.prototype.calculateTimes = function (topoEventSet) {
        var forwardPassResult = this.forwardPassCalculation(topoEventSet);
        var backwardPassResult = this.backwardPassCalculation(forwardPassResult);
        var finalResult = this.calculateFloatTimes(backwardPassResult);
        return finalResult;
    };
    //calculate float times
    //when given an activity set with calculated earliest/latest start/end times, it will return the same result with the float times
    CpProvider.prototype.calculateFloatTimes = function (activityList) {
        for (var i = 0; i < activityList.length; i++) {
            activityList[i].floatTime = activityList[i].latestEnd - activityList[i].earliestEnd;
        }
        return activityList;
    };
    //forward pass calculation, calculates the earliest times for each of the nodes, adding them as properties
    //forward pass calculation, calculates the earliest times for each of the nodes, adding them as properties
    CpProvider.prototype.forwardPassCalculation = function (topoEventSet) {
        function clone(src) {
            function mixin(dest, source, copyFunc) {
                var name, s, i, empty = {};
                for (name in source) {
                    // the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
                    // inherited from Object.prototype.	 For example, if dest has a custom toString() method,
                    // don't overwrite it with the toString() method that source inherited from Object.prototype
                    s = source[name];
                    if (!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))) {
                        dest[name] = copyFunc ? copyFunc(s) : s;
                    }
                }
                return dest;
            }
            if (!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]") {
                // null, undefined, any non-object, or function
                return src; // anything
            }
            if (src.nodeType && "cloneNode" in src) {
                // DOM Node
                return src.cloneNode(true); // Node
            }
            if (src instanceof Date) {
                // Date
                return new Date(src.getTime()); // Date
            }
            if (src instanceof RegExp) {
                // RegExp
                return new RegExp(src); // RegExp
            }
            var r, i, l;
            if (src instanceof Array) {
                // array
                r = [];
                for (i = 0, l = src.length; i < l; ++i) {
                    if (i in src) {
                        r.push(clone(src[i]));
                    }
                }
                // we don't clone functions for performance reasons
                //		}else if(d.isFunction(src)){
                //			// function
                //			r = function(){ return src.apply(this, arguments); };
            }
            else {
                // generic objects
                r = src.constructor ? new src.constructor() : {};
            }
            return mixin(r, src, clone);
        }
        var originalSet = clone(JSON.parse(JSON.stringify(topoEventSet))); //keeps an original record of dependencies
        var finishedNodes = [];
        var inProcessNodes = [];
        //initialize the first node
        inProcessNodes.push(originalSet.shift());
        while (inProcessNodes.length > 0) {
            var nodeU = inProcessNodes.shift();
            //case for the first node
            if (!nodeU.hasOwnProperty('earliestStart')) {
                nodeU.earliestStart = 1;
            }
            //calculate the earliest end time
            nodeU.earliestEnd = (nodeU.earliestStart - 1) + nodeU.duration;
            //console.log(nodeU);
            //console.log(inProcessNodes);
            for (var i = 0; i < originalSet.length; i++) {
                var nodeV = originalSet[i];
                //console.log(i);
                if (this.checkForDependencyMatch(nodeV, nodeU)) {
                    //calculate the earliest start times...
                    if (!nodeV.hasOwnProperty('earliestStart')) {
                        //console.log(nodeV);
                        nodeV.earliestStart = (nodeU.earliestEnd + 1); //calculate start time
                    }
                    else if (nodeU.earliestEnd > nodeV.earliestStart) {
                        nodeV.earliestStart = (nodeU.earliestEnd + 1);
                    }
                    //calculate the earliest end time...
                    nodeV.earliestEnd = (nodeV.earliestStart - 1) + nodeV.duration;
                    ///console.log(nodeV);
                    //remove the edge/dependency
                    var index = originalSet[i].dependencies.indexOf(nodeU);
                    originalSet[i].dependencies.splice(index, 1);
                    //push nodeV into inProcessNodes to turn into nodeU's
                    inProcessNodes.push(nodeV);
                }
            }
            //checks if node already has been calculated due to multiple dependencies, might have an updated earliestStart/earliestEnd
            if (this.contains(finishedNodes, nodeU)) {
                //console.log(nodeU);
                var index = finishedNodes.indexOf(nodeU);
                finishedNodes.splice(index, 1, nodeU);
                //console.log(finishedNodes);
            }
            else {
                finishedNodes.push(nodeU);
            }
            //console.log(inProcessNodes.length);
        }
        //console.log(finishedNodes);
        console.log('start');
        console.log(JSON.parse(JSON.stringify(topoEventSet)));
        console.log('end');
        //add calculated times to originalSet
        for (var i = 0; i < finishedNodes.length; i++) {
            //console.log(topoEventSet.length);
            //console.log(i);
            var temp = finishedNodes[i];
            //console.log(topoEventSet.length);
            for (var j = 0; j < topoEventSet.length; j++) {
                if (topoEventSet[j].name === temp.name) {
                    topoEventSet[j].earliestStart = temp.earliestStart;
                    topoEventSet[j].earliestEnd = temp.earliestEnd;
                    break;
                }
                else {
                    //console.log('not found');
                }
            }
            //console.log(node);
        }
        return topoEventSet;
    };
    //backward pass calculation, calculates the latest times for each of the nodes, adding them as properties
    CpProvider.prototype.backwardPassCalculation = function (forwardPassResult) {
        var finishedNodes = [];
        var inProcessNodes = [];
        //initialize the first node
        var startNode = forwardPassResult.pop();
        inProcessNodes.push(startNode);
        while (inProcessNodes.length > 0) {
            var nodeU = inProcessNodes.shift();
            //case for the first node
            if (!nodeU.hasOwnProperty('latestEnd')) {
                nodeU.latestEnd = nodeU.earliestEnd;
                nodeU.latestStart = (nodeU.latestEnd + 1) - nodeU.duration;
            }
            else {
                //calculate the latest start time
                nodeU.latestStart = (nodeU.latestEnd + 1) - nodeU.duration;
            }
            //console.log(nodeU);
            //console.log(inProcessNodes);
            for (var i = 0; i < forwardPassResult.length; i++) {
                var nodeV = forwardPassResult[i];
                //console.log(i);
                if (this.checkForDependencyMatch(nodeU, nodeV)) {
                    //calculate the earliest start times...
                    if (!nodeV.hasOwnProperty('latestStart')) {
                        //console.log(nodeV);
                        nodeV.latestEnd = (nodeU.latestStart - 1); //calculate start time
                    }
                    else if (nodeU.latestEnd > nodeV.latestStart) {
                        nodeV.latestEnd = (nodeU.latestStart - 1);
                    }
                    //calculate the latest start time...
                    nodeV.latestStart = (nodeV.latestEnd + 1) - nodeV.duration;
                    ///console.log(nodeV);
                    //remove the edge/dependency
                    var index = nodeU.dependencies.indexOf(nodeV);
                    nodeU.dependencies.splice(index, 1);
                    //console.log('start');
                    //console.log(nodeU);
                    //console.log('end');
                    //push nodeV into inProcessNodes to turn into nodeU's
                    inProcessNodes.push(nodeV);
                }
            }
            //checks if node already has been calculated due to multiple dependencies, might have an updated earliestStart/earliestEnd
            if (this.contains(finishedNodes, nodeU)) {
                //console.log(nodeU);
                var index = finishedNodes.indexOf(nodeU);
                finishedNodes.splice(index, 1, nodeU);
            }
            else {
                finishedNodes.push(nodeU);
            }
            //console.log(inProcessNodes.length);
        }
        return finishedNodes;
        /*
        //add calculated times to originalSet
        for(let i=0;i<finishedNodes.length;i++){
          //console.log(topoEventSet.length);
          //console.log(i);
          let temp=finishedNodes[i];
    
          //console.log(topoEventSet.length);
          for(let j=0;j<forwardPassResult.length;j++){
    
            if(forwardPassResult[j].name===temp.name){
              forwardPassResult[j].earliestStart=temp.earliestStart;
              forwardPassResult[j].earliestEnd=temp.earliestEnd;
              break;
            }else{
              //console.log('not found');
            }
          }
          //console.log(node);
        }
        return forwardPassResult;
        */
    };
    //given object1, checks if object2 exist in object1's dependency list
    CpProvider.prototype.checkForDependencyMatch = function (object1, object2) {
        for (var i = 0; i < object1.dependencies.length; i++) {
            //console.log('checking');
            //console.log(object1.dependencies[i]);
            if (object1.dependencies[i].name === object2.name)
                //console.log('match');
                return true;
        }
        return false;
    };
    //checks if an array has obj in it
    CpProvider.prototype.contains = function (a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return a[i];
            }
        }
        return false;
    };
    //weak comparison
    CpProvider.prototype.containsName = function (a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i].name === obj.name) {
                return a[i];
            }
        }
        return false;
    };
    //cloning objects
    //https://davidwalsh.name/javascript-clone
    CpProvider.prototype.clone = function (src) {
        function mixin(dest, source, copyFunc) {
            var name, s, i, empty = {};
            for (name in source) {
                // the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
                // inherited from Object.prototype.	 For example, if dest has a custom toString() method,
                // don't overwrite it with the toString() method that source inherited from Object.prototype
                s = source[name];
                if (!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))) {
                    dest[name] = copyFunc ? copyFunc(s) : s;
                }
            }
            return dest;
        }
        if (!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]") {
            // null, undefined, any non-object, or function
            return src; // anything
        }
        if (src.nodeType && "cloneNode" in src) {
            // DOM Node
            return src.cloneNode(true); // Node
        }
        if (src instanceof Date) {
            // Date
            return new Date(src.getTime()); // Date
        }
        if (src instanceof RegExp) {
            // RegExp
            return new RegExp(src); // RegExp
        }
        var r, i, l;
        if (src instanceof Array) {
            // array
            r = [];
            for (i = 0, l = src.length; i < l; ++i) {
                if (i in src) {
                    r.push(this.clone(src[i]));
                }
            }
            // we don't clone functions for performance reasons
            //		}else if(d.isFunction(src)){
            //			// function
            //			r = function(){ return src.apply(this, arguments); };
        }
        else {
            // generic objects
            r = src.constructor ? new src.constructor() : {};
        }
        return mixin(r, src, this.clone);
    };
    //given a list of activities with calculated earliest/latest start/end times, will return a longest path list
    CpProvider.prototype.longestPath = function (activityList) {
        var result = [];
        for (var i = 0; i < activityList.length; i++) {
            //console.log(i);
            var condition1 = activityList[i].earliestEnd - activityList[i].latestEnd === 0;
            var condition2 = activityList[i].earliestStart - activityList[i].latestStart === 0;
            if (condition1 && condition2) {
                result.push(activityList[i]);
            }
        }
        result.reverse();
        return result;
    };
    /* Helper method and Top Sort method */
    // Performs a basic top sort, returns an array of activity names in a top order
    CpProvider.prototype.removeEdge = function (adjacentVertex, node) {
        node.dependencies = node.dependencies.filter(function (vertex) { return vertex.name !== adjacentVertex; });
        return node;
    };
    CpProvider.prototype.topologicalSort = function (nodes) {
        console.log(nodes);
        var saved = JSON.parse(JSON.stringify(nodes));
        var hasIncomingEdges = function (node) { return node.dependencies.length; };
        var noIncomingEdges = function (node) { return !node.dependencies.length; };
        var noEdges = nodes.filter(noIncomingEdges), withEdges = nodes.filter(hasIncomingEdges), sorted = [];
        while (noEdges.length) {
            var node = noEdges.pop();
            sorted.push(node);
            withEdges = withEdges.map(this.removeEdge.bind(null, node.name));
            var newNoEdges = withEdges.filter(noIncomingEdges);
            noEdges = noEdges.concat(newNoEdges);
            withEdges = withEdges.filter(hasIncomingEdges);
        }
        // console.log(sorted);
        for (var x = 0; x < saved.length; x++) {
            for (var y = 0; y < sorted.length; y++) {
                if (sorted[y].name == saved[x].name) {
                    sorted[y].dependencies = saved[x].dependencies;
                }
            }
        }
        console.log("this is sorted with dependencies\n");
        console.log(sorted);
        return sorted;
    };
    return CpProvider;
}());
CpProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http])
], CpProvider);
export { CpProvider };
//# sourceMappingURL=cp.js.map