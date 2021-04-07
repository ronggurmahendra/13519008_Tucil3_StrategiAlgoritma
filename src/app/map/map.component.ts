
import 'ol/ol.css';
import OSM from 'ol/source/OSM' ;
import 'ol/ol.css';
import Tile from 'ol/layer/Tile' ;
import Map from 'ol/Map' ;
import Overlay from 'ol/Overlay';
import BingMaps from 'ol/source/BingMaps';
import { preserveWhitespacesDefault } from '@angular/compiler';
import { mapToMapExpression } from '@angular/compiler/src/render3/util';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { distance, toStringHDMS } from 'ol/coordinate.js';
import { toLonLat } from 'ol/proj.js';
import { fromLonLat } from 'ol/proj.js';
import View from 'ol/View';

import Feature from 'ol/Feature';
import sVector from 'ol/source/Vector';
import lVector from 'ol/layer/Vector';
import Point from 'ol/geom/Point';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import TileJSON from 'ol/source/TileJSON';
import VectorSource from 'ol/source/Vector';
import {Icon} from 'ol/style';

import {Draw, Modify, Snap} from 'ol/interaction';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import Intersects from 'ol/format/filter/Intersects';
import { LineString } from 'ol/geom'

import 'ol/ol.css';
import { Graph } from '../model/graph';
import { Edge } from '../model/edge';
import { Node } from '../model/node';
import { GraphService } from '../graph.service'
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public map;
  public Distance;  
  constructor(private graphService : GraphService
  ) {   }

  ngOnInit(): void {
    //this.graph = new Graph();
    this.graphService.getData();
    //this.graphService.dummyDataInit();
    var graph = this.graphService.getGraph();
    this.initilizeMap(graph);
    //renderGraphToMap()
  }

  initilizeMap(graph) {
    var GraphFeature = []
    var GraphSource = new VectorSource({
      features : GraphFeature
    });
    var GraphLayer = new VectorLayer({
      source : GraphSource
    })

    var tempFeature = []
    var tempSource  = new VectorSource({
      features : tempFeature
    });
    var tempLayer = new VectorLayer({
      source : tempSource
    })
    this.map = new Map({
      target: 'map',
      layers: [
        new Tile({
          source: new OSM()
        }),
        GraphLayer,
        tempLayer
      ],
      
      view: new View({
        center:fromLonLat([ 107.65513873446967,-6.955782680199824]),
        zoom: 15
      })
    });
    //renderGraphToMap()
    this.Distance = 0;
    var count = 0;
    var SrcNode
    var DestNode
    var Src
    var Dest
    this.map.on('singleclick', function (evt){ 
      var Coordinate = toLonLat(evt.coordinate); //coordinate openlayer to coordinate 
      var longitude = Coordinate[0];
      var latitude = Coordinate[1];
      //console.log("clicking at coor", longitude, ", ",latitude)
      //console.log(count)
      
      if(count ==  0){
        SrcNode = new Node(longitude,latitude)
        count++;
        this.distance = 0;

        var tempPoint = new Feature({
          geometry : new Point(fromLonLat([longitude,latitude]))
        })
        tempPoint.setStyle( new Style({
          image : new Icon(({
            color: '#000000',
            crossOrigin: 'anonymous',
            src: 'assets/vectorpoint.svg',
            imgSize: [60, 60],
            scale : 0.5
      
            }))
        }))
        tempSource.addFeature(tempPoint);

        Src =  graph.getNearestNode(SrcNode)
        this.distance += Node.getDistance(Src,SrcNode)*50000
        //gambar garis pembantu
        var lineCoordinate1 = fromLonLat([Src.longitude,Src.latitude])
        var lineCoordinate2 = fromLonLat([SrcNode.longitude,SrcNode.latitude])
        var line = new LineString(
          [lineCoordinate1,lineCoordinate2]
        )
        var templineFeature = new Feature({
          geometry : line
        });        
        templineFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: '#000000',
              width: 3
            })
          })
        );
        tempSource.addFeature(templineFeature);


      }else if(count == 1){
        DestNode = new Node(longitude,latitude)
        count++;

        var tempPoint = new Feature({
          geometry : new Point(fromLonLat([longitude,latitude]))
        })
        tempPoint.setStyle( new Style({
          image : new Icon(({
            color: '#000000',
            crossOrigin: 'anonymous',
            src: 'assets/vectorpoint.svg',
            imgSize: [60, 60],
            scale : 0.5
      
            }))
        }))
        tempSource.addFeature(tempPoint);

        Dest =  graph.getNearestNode(DestNode)
        this.distance += Node.getDistance(Dest,DestNode)*50000

        //gambar garis pembantu
        var lineCoordinate1 = fromLonLat([Dest.longitude,Dest.latitude])
        var lineCoordinate2 = fromLonLat([DestNode.longitude,DestNode.latitude])
        var line = new LineString(
          [lineCoordinate1,lineCoordinate2]
        )
        var templineFeature = new Feature({
          geometry : line
        });        
        templineFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: '#000000',
              width: 3
            })
          })
        );
        tempSource.addFeature(templineFeature);


        graph.AStar(Src,Dest);


        var curr = Dest.id;
        while(curr != Src.id){            
            var temp = graph.AStarUtilSearchByID(curr)

            var node1 = graph.AStarUtilSearchByID(curr)
            curr = temp.IDPrev
            //curr ama temp tuh nodenya
            //visualizer hasil AStar

            var node2 = graph.AStarUtilSearchByID(curr)
            this.distance += Node.getDistance(node1,node2)*50000



            var arrowCoordinate = [node1.longitude + (node2.longitude - node1.longitude)/2,node1.latitude + (node2.latitude - node1.latitude)/2]
            var arrow = new Point(fromLonLat(arrowCoordinate))
            var arrowFeature = new Feature({
              geometry : arrow
            })
            arrowFeature.setStyle(new Style({
              image : new Icon(({
              color: '#00FF2B',
              crossOrigin: 'anonymous',
              src: 'assets/arrow1.svg',
              imgSize: [400, 300],
              scale : 0.1,
              rotation : Math.atan2((node1.longitude - node2.longitude),(node1.latitude - node2.latitude))
              }))
            }));
            tempSource.addFeature(
              arrowFeature
            );

            var lineCoordinate1 = fromLonLat([node1.longitude,node1.latitude])
            var lineCoordinate2 = fromLonLat([node2.longitude,node2.latitude])
            var line = new LineString(
              [lineCoordinate1,lineCoordinate2]
            )
            var templineFeature = new Feature({
              geometry : line
            });        
            templineFeature.setStyle(
              new Style({
                stroke: new Stroke({
                  color: '#000000',
                  width: 3
                })
              })
            );


            tempSource.addFeature(
              templineFeature
            );
            //end of visualizer
        }
        console.log("DISTANCE : ",this.distance)

        
      }else if(count == 2){
        count = 0;
        this.distance = 0
        tempSource.clear();
      }


    })
    setInterval(()=> {
      renderGraphToMap()
    },1000)
    
    //
    //console.log("calling graph.AStarByID(1,5)")
    //graph.AStarByID(1,5)
    
    //console.log(graph.getAdjID(0).length)
    
    
    
    function renderGraphToMap(){
      //console.log("rendering")
      GraphFeature =[]
      var nodes = graph.getNodes();
      var edges = graph.getEdges();
      // console.log("edges.length",edges.length)
      // console.log("nodes.length",nodes.length)

      for(var i = 0;i < nodes.length;i++){
        // console.log(nodes[i].longitude,nodes[i].latitude)
        var tempPoint = new Feature({
          geometry : new Point(fromLonLat([nodes[i].longitude,nodes[i].latitude]))
        })
        tempPoint.setStyle( new Style({
          image : new Icon(({
            color: '#000000',
            crossOrigin: 'anonymous',
            src: 'assets/vectorpoint.svg',
            imgSize: [60, 60],
            scale : 0.5
      
            }))
        }))
        GraphFeature.push(tempPoint)
      }

      for(var i = 0 ; i<edges.length;i++){
        var lineCoordinate1 = fromLonLat([edges[i].getNode1().longitude,edges[i].getNode1().latitude])
        var lineCoordinate2 = fromLonLat([edges[i].getNode2().longitude,edges[i].getNode2().latitude])
        var line = new LineString(
          [lineCoordinate1,lineCoordinate2]
        )
        var templineFeature = new Feature({
          geometry : line
        });        
        templineFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: '#00FF2B',
              width: 3
            })
          })
        );
        GraphFeature.push(
          templineFeature
        );
      }


      GraphSource.clear()
      GraphSource.addFeatures(GraphFeature);
      // console.log(GraphFeature.length)
      GraphFeature = []
  
    }

  }

}
