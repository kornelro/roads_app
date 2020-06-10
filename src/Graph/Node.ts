import { INode } from "../Interfaces/INode";

export class Node implements INode {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}