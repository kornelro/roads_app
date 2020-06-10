import { IController } from '../Interfaces/IController'
import { DataFrame } from 'dataframe-js'
import { Map } from 'leaflet'
import { IEdge, Type } from '../Interfaces/IEdge'
import { Edge } from '../Graph/Edge'
import { resources } from '../Resources'
import { writeHeapSnapshot } from 'v8'
var L = require('leaflet')


export class Controller implements IController {
    dataEdges: Promise<typeof DataFrame>
    edges: IEdge[]
    map: Map
    sum: number
    _sumElement: HTMLElement

    constructor() {
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

        this.sum = 0
        this._sumElement = document.getElementById('sum')
        this._updateSum()
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
                    parseFloat(row.get('dist')),
                    parseInt(row.get('type'))
                )
                this.edges.push(edge)
                if (edge.type == Type.NewBike) {
                    this.sum += edge.dist
                }
            })
            this._updateSum()
        })
        .then(() => {
            this.drawEdges()
        })
    }

    drawEdges() {
        this.edges.forEach(edge => {
            var color = resources.lineStyle.bike.color
            var opacity = resources.lineStyle.bike.opacity
            var dashArray = null
            var dashOffset = null
            if (edge.type == Type.NewBike) {
                color = resources.lineStyle.newBike.color
            } else if (edge.type == Type.Road) {
                color = resources.lineStyle.road.color
                opacity = resources.lineStyle.road.opacity
                dashArray = resources.lineStyle.road.dashArray
                dashOffset = resources.lineStyle.road.dashOffset
            }

            L.polyline(
                [[edge.n1.x, edge.n1.y], [edge.n2.x, edge.n2.y]],
                {
                    color: color,
                    opacity: opacity,
                    dashArray: dashArray,
                    dashOffset: dashOffset
                }
            )
            .addTo(this.map)
            .on('click', (e: any) => {
                if (edge.type == Type.NewBike) {
                    edge.type = Type.Road
                    e.target.setStyle({
                        color: resources.lineStyle.road.color,
                        opacity: resources.lineStyle.road.opacity,
                        dashArray: resources.lineStyle.road.dashArray,
                        dashOffset: resources.lineStyle.road.dashOffset
                    })
                    this.sum -= edge.dist
                    this._updateSum()
                } else if (edge.type == Type.Road) {
                    edge.type = Type.NewBike
                    e.target.setStyle({
                        color: resources.lineStyle.newBike.color,
                        opacity: resources.lineStyle.newBike.opacity,
                        dashArray: resources.lineStyle.newBike.dashArray,
                        dashOffset: resources.lineStyle.newBike.dashOffset
                    })
                    this.sum += edge.dist
                    this._updateSum()
                }
            })
        })
    }

    _updateSum() {
        this._sumElement.innerHTML = this.sum.toString()
    }
}