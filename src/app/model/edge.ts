import { Node } from './node';

export class Edge {
    public node1: Node;
    public node2: Node;

    constructor(temp1 : Node , temp2 : Node){
        this.node1 = temp1;
        this.node2 = temp2;
    }

    getDistance(){
        var tempLat = this.node1.getLat() - this.node2.getLat()
        var tempLong = this.node1.getLong() - this.node2.getLong()
        return Math.sqrt(tempLat*tempLat + tempLong*tempLong );
    }

    print(){
        console.log("edges : ")
        this.node1.print()
        this.node2.print()
    }
    getNode1(){
        return this.node1
    }
    getNode2(){
        return this.node2
    }
}