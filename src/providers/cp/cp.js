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
    CpProvider.prototype.removeEdge = function (adjacentVertex, node) {
        node.dependencies = node.dependencies.filter(function (vertex) { return vertex !== adjacentVertex; });
        return node;
    };
    CpProvider.prototype.topologicalSort = function (nodes) {
        console.log(nodes);
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
        return sorted.map(function (node) { return node.name; });
    };
    return CpProvider;
}());
CpProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http])
], CpProvider);
export { CpProvider };
//# sourceMappingURL=cp.js.map