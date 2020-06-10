import { IEdge, Type } from "../Interfaces/IEdge";
import { INode } from '../Interfaces/INode'
import { Node } from './Node'

export class Edge implements IEdge {
    id: number
    n1: INode
    n2: INode
    dist: number
    type: Type

    constructor(
        id: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        dist: number,
        type: number
    ) {
        this.id = id
        this.n1 = new Node(x1, y1)
        this.n2 = new Node(x2, y2)
        this.dist = dist
        if (type == 1) {
            this.type = Type.Bike
        } else if (type == 2) {
            this.type = Type.Road
        } else {
            this.type = Type.NewBike
        }
    }
}