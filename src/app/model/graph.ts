import { Node } from './node';
import { Edge } from './edge';
import {RouteElmt} from './routeElmt'
import { TmplAstTemplate } from '@angular/compiler';

export class Graph {
    nodes : Node[];
    edges  : Edge[];

    constructor(){
        this.nodes = []
        this.edges = [];
    }

    addNode(node : Node){
        this.nodes.push(node);
    }
    addEdge(edge : Edge){
        for(var i=0;i<this.edges.length;i++){
            if(this.edges[i] == edge ||(this.edges[i].node1 == edge.node2 && this.edges[i].node2 == edge.node1)){
                
                return;
            }
        }

        this.edges.push(edge);
    }
    getNodes(){
        return this.nodes;
    }
    getEdges(){
        return this.edges;
    }
    getAdjID(id : number){
        var temp = []
        for(var i = 0;i<this.edges.length;i++){
            if(this.edges[i].getNode1().id == id){
                temp.push(this.edges[i].getNode2());
            }
            if(this.edges[i].getNode2().id == id){
                temp.push(this.edges[i].getNode1());
            }
        }
        return temp;
    }

    getAdj(node : Node){
        var temp = []
        for(var i = 0;i<this.edges.length;i++){
            if(this.edges[i].getNode1() == node && this.edges[i].getNode2().visited == false){
                this.edges[i].getNode2().IDPrev = node.id;
                temp.push(this.edges[i].getNode2());
            }
            if(this.edges[i].getNode2() == node && this.edges[i].getNode1().visited == false){
                this.edges[i].getNode1().IDPrev = node.id;
                temp.push(this.edges[i].getNode1());
            }
        }
        return temp;
    }

    getNearestNode(node : Node){
        var min = this.nodes[0];
        var minval = Node.getDistance(node,this.nodes[0])
        for(var i = 0;i<this.nodes.length ;i++){
            if(minval > Node.getDistance(node,this.nodes[i])){
                minval = Node.getDistance(node,this.nodes[i])
                min = this.nodes[i]
            }
        }
        return min;
    }

    AStarByID(SrcID : number, DestID : number){
        var Src
        var Dest
        for(var i = 0;i<this.nodes.length;i++){
            if(this.nodes[i].id == SrcID && this.nodes[i].visited == false){
                Src = this.nodes[i]
            }
            if(this.nodes[i].id == DestID && this.nodes[i].visited == false ){
                Dest = this.nodes[i]
            }
        }
        this.AStar(Src,Dest)
    }




    AStar(Src : Node, Dest : Node){
        if(Src == Dest){
            console.log("SELECT DIFFERENT NODE")
            
            return
        }


        console.log("calling AStar")
        this.AStarUtilInit();
        var found = false;
        Src.currDistance = 0;
        Src.visited = true;
        for(var i = 0;i < this.nodes.length;i++){
            this.nodes[i].DistanceToTarget = this.nodes[i].GetDistance(Dest)
        }

        var ToBeVisited = this.getAdj(Src);
        
        var Iterated = Node.GetMinHeuristic(ToBeVisited);
        ToBeVisited = this.AStarUtilDeleteElmt(Iterated,ToBeVisited)
        Iterated.visited = true;
        // console.log("First Iterated.id",Iterated.id)
        // console.log("First ToBeVisited.length",ToBeVisited.length)
        // console.log("First Iterated.visited",Iterated.visited)

        while(ToBeVisited.length != 0 && Iterated != Dest){
            console.log("iterating", Iterated.id)
            var TempToBeVisited = this.getAdj(Iterated)
            for(var i = 0;i<TempToBeVisited.length;i++){
                TempToBeVisited[i].currDistance = Iterated.currDistance + Node.getDistance(TempToBeVisited[i],Iterated);
                ToBeVisited.push(TempToBeVisited[i])
            }
            
            Iterated = Node.GetMinHeuristic(ToBeVisited);
            
            ToBeVisited = this.AStarUtilDeleteElmt(Iterated,ToBeVisited)            
            // for(var i = 0;i<ToBeVisited.length;i++){
            //     console.log("ToBeVisited[i].id",ToBeVisited[i].id)
            // }
            Iterated.visited = true;



            if(Iterated == Dest){
                console.log("Reach Dest") 
                found = true;       
                break;
            }
        }
        if(found){
            console.log("printing Route")
            var curr = Dest.id;
            while(curr != Src.id){
                console.log("<<",curr)
                var temp = this.AStarUtilSearchByID(curr)
                
                curr = temp.IDPrev
            }
            console.log("<<",curr)



        }else{
            console.log("RouteNotFound")
        }


        console.log("calling Done")
    }


    AStarUtilDeleteElmt(visited : Node,arr : Node[] ){
        var out = []
        for(var i = 0;i<arr.length;i++){
            if(arr[i] != visited){
                // console.log("arr[i].id",arr[i].id)
                out.push(arr[i])
            }
        }
        return out
    }

    AStarUtilInit(){
        for(var i = 0; i<this.nodes.length;i++){
            this.nodes[i].visited = false;
            this.nodes[i].IDPrev = -1;
            this.nodes[i].currDistance = 999999999;
            this.nodes[i].DistanceToTarget = 999999999;
            this.nodes[i].visited = false;
        }
    }

    AStarUtilSearchByID(ID:number){
        var found = false
        for(var i = 0;i<this.nodes.length;i++){
            if(this.nodes[i].id == ID){
                return this.nodes[i]
            }
        }
        
    }

}