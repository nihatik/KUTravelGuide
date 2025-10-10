import { BasePoint } from "./BasePoint";

export class PlanPoint extends BasePoint {
    parentId: number | null;
    floor: number;

    constructor(id: number, x: number, z: number, parentId: number | null = null, floor: number = 1) {
        super(id, x, z);

        console.log("CPX  | ", x);
        this.parentId = parentId;
        this.floor = floor;
    }
}