import { IController } from '../Interfaces/IController'
import { DataFrame } from 'dataframe-js'
import { Map } from 'leaflet'
import { IEdge } from '../Interfaces/IEdge'
import { Edge } from '../Graph/Edge'
var L = require('leaflet')


export class Controller implements IController {
    dataEdges: Promise<typeof DataFrame>
    edges: IEdge[]
    map: Map

    constructor() {
        // let target_nodes = document.getElementById('dragdrop_nodes');
        // let fileInput_nodes = document.getElementById("fileinput_nodes");
        // target_nodes.addEventListener('click', () => {
        //     fileInput_nodes.click()
        // });
        // fileInput_nodes.onchange = () => {
        //     var x = document.getElementById("fileinput_nodes") as HTMLInputElement;
        //     if (x['files']['length'] != 1) {
        //         var file = x['files'][0]
        //         this.readData(file, ',')
        //     }
        // };
        let target_edges = document.getElementById('dragdrop_edges');
        let fileInput_edges = document.getElementById("fileinput_edges");
        target_edges.addEventListener('click', () => {
            fileInput_edges.click()
        });
        fileInput_edges.onchange = () => {
            var x = document.getElementById("fileinput_edges") as HTMLInputElement;
            if (x['files']['length'] == 1) {
                var file = x['files'][0]
                this.readDataEdges(file, ',')
            }
        };

        this.edges = []

        this.map = L.map('map', {
            center: [51.15347, 16.85904],
            zoom: 13
        });

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 18
        }).addTo(this.map)
    }

    readDataEdges(file: File, separator: string) {
        this.dataEdges = DataFrame.fromDSV(file, separator, true)
        this.dataEdges.then(data => {
            data.withColumn('id', (row: any) => {
                var edge = new Edge(
                    parseInt(row.get('id')),
                    parseFloat(row.get('y1')),
                    parseFloat(row.get('x1')),
                    parseFloat(row.get('y2')),
                    parseFloat(row.get('x2')),
                    parseInt(row.get('type'))
                )
                this.edges.push(edge)
            })
        })
        .then(() => {
            this.drawEdges()
        })
    }

    drawEdges() {
        this.edges.forEach(edge => {
            L.polyline([[edge.n1.x, edge.n1.y], [edge.n2.x, edge.n2.y]]).addTo(this.map)
        })
    }
}