import { Node } from './node';

export class RouteElmt {
    public curr : Node;
    public prev : Node;
    public HeuristicVal  : number; 

    constructor(curr: Node,prev:Node,HeuristicVal:Number){
        this.curr = curr;
        this.prev = prev;
        this.HeuristicVal;
    }
}