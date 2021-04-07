export class Node {
    static currID : number = 0;

    public id: number;
    public longitude: number;
    public latitude: number;

    public IDPrev: number;
    public currDistance:number;
    public DistanceToTarget:number;

    public visited : boolean;

    constructor(templongitude: number, templatitude: number){
        this.id = Node.currID;
        Node.currID++;
        this.longitude = templongitude;
        this.latitude = templatitude;
        this.IDPrev = -1;
        this.currDistance = 999999999;
        this.DistanceToTarget = 999999999;
        this.visited = false;
    }
    getLong(){
        return this.longitude;
    }
    getLat(){
        return this.latitude;
    }
    print(){
        console.log("id : ",this.id ,"lon : ", this.longitude,"lat : ", this.latitude)
    }

    GetDistance(node : Node){
        var tempLat = this.getLat() - node.getLat()
        var tempLong = this.getLong() - node.getLong()
        return Math.sqrt(tempLat*tempLat + tempLong*tempLong );
    }
    GetHeuristic(){
        return this.DistanceToTarget + this.currDistance;
    }

    static GetMinHeuristic(nodes : Node[]){
        var min = nodes[0];
        for(var i = 0;i<nodes.length; i++){
            if(min.GetHeuristic() > nodes[i].GetHeuristic()){
                min = nodes[i];
            }
        }
        return min 

    }
    static getDistance(node1 : Node, node2:Node) {
        var tempLat = node1.getLat() - node2.getLat()
        var tempLong = node1.getLong() - node2.getLong()
        return Math.sqrt(tempLat*tempLat + tempLong*tempLong );
    }
}