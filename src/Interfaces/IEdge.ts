import { INode } from './INode'

export interface IEdge {
    id: number
    n1: INode
    n2: INode
    dist: number
    type: Type
}

export enum Type {
    Bike = 1,
    Road = 2,
    NewBike = 3
}