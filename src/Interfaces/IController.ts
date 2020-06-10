import { DataFrame } from 'dataframe-js'
import { Map } from 'leaflet'
import { IEdge } from './IEdge'
import { INode } from './INode'

export interface IController {
    dataEdges: typeof DataFrame
    edges: IEdge[]
    map: Map
    sum: number

    readDataEdges: (file: File, separator: string) => void
    drawEdges: () => void
}