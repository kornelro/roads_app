import { DataFrame } from 'dataframe-js'
import { Map } from 'leaflet'
import { IEdge } from './IEdge'
import { INode } from './INode'

export interface IController {
    // dataNodes: typeof DataFrame
    dataEdges: typeof DataFrame
    // nodes: [INode]
    edges: IEdge[]
    map: Map

    // readDataNodes: (file: File, separator: string) => void
    readDataEdges: (file: File, separator: string) => void
    drawEdges: () => void
}