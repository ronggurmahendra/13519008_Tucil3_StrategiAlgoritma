import { Injectable } from '@angular/core';
import { Graph } from './model/graph';
import { Edge } from './model/edge';
import { Node } from './model/node';
@Injectable({
  providedIn: 'root'
})
export class GraphService {
  public graph: Graph = new Graph();
  public srcFile
  constructor() {
    console.log("inizialing graph service")
   }
   getGraph(){
     return this.graph;
   }
   getData(){
    fetch("./assets/graph/input.txt")
    .then(response => response.text())
    .then(data => {
      // Do something with your data
      // console.log(data)
      this.srcFile = data
      console.log("READING : ",data)
      this.getData2()

    })
   }

   getData2(){
    fetch('./assets/graph/'.concat(this.srcFile))
    .then(response => response.text())
    .then(data => {
      // Do something with your data
      this.parseData(data)
      

    });
   }

   parseData(data){
    console.log("READING FILE")
    var splitted = data.split("\n");
    var len : number = +splitted[0]
    var nodes: Node[] = [];

    for(var i = 0;i<len;i++){
      var parsed : number[] = splitted[1+i].split(" ");
      nodes.push(new Node(parsed[1] ,parsed[0] ))
      // console.log(parsed[1],parsed[0])
    }
    var edges: Edge[] = [];
    for(var i = 0;i<len;i++){
      var parsed : number[] = splitted[1+len+i].split(" ");
      for(var j = 0;j < len;j++){
        if(parsed[j] == 1){
          edges.push(new Edge(nodes[i],nodes[j]))
        }
      }
    }
    console.log("nodes.length : ",nodes.length)
    console.log("edges.length : ",edges.length)
    for(var j = 0;j < nodes.length;j++){
      this.graph.addNode(nodes[j]);
    }

    for(var j = 0;j<edges.length;j++){
      this.graph.addEdge(edges[j])
    }


   }

   dummyDataInit(){
    console.log("iniziallizing dummy data")
    var nodes: Node[] = [];
    nodes.push(new Node(107.606223,-6.937540));
    nodes.push(new Node(107.609053,-6.937635));
    nodes.push(new Node(107.612766,-6.937765));
    nodes.push(new Node(107.609950,-6.940116));
    nodes.push(new Node(107.612811,-6.940128));
    nodes.push(new Node(107.608649,-6.946133));
    nodes.push(new Node(107.610575,-6.945537));
    nodes.push(new Node(107.612801,-6.945615));
    nodes.push(new Node(107.609396,-6.948308));
    nodes.push(new Node(107.612446,-6.948545));

    var edges: Edge[] = [];
    edges.push(new Edge(nodes[0],nodes[1]))
    edges.push(new Edge(nodes[0],nodes[5]))

    edges.push(new Edge(nodes[1],nodes[2]))
    edges.push(new Edge(nodes[1],nodes[3]))

    edges.push(new Edge(nodes[2],nodes[4]))

    edges.push(new Edge(nodes[3],nodes[4]))
    edges.push(new Edge(nodes[3],nodes[6]))

    edges.push(new Edge(nodes[4],nodes[7]))

    edges.push(new Edge(nodes[5],nodes[6]))
    edges.push(new Edge(nodes[5],nodes[7]))
    edges.push(new Edge(nodes[5],nodes[8]))

    edges.push(new Edge(nodes[6],nodes[7]))

    edges.push(new Edge(nodes[7],nodes[9]))

    edges.push(new Edge(nodes[8],nodes[9]))

    for(var i = 0;i < nodes.length;i++){
      this.graph.addNode(nodes[i]);
    }

    for(var i = 0;i<edges.length;i++){
      this.graph.addEdge(edges[i])
    }
  }
}
