import { BasePoint } from "./BasePoint";

export class RoutePoint extends BasePoint {
  wayIds: number[] = [];
  ways: RoutePoint[] = [];

  constructor(id: number, x: number, z: number, wayIds: number[] = []) {
    super(id, x, z);
    this.wayIds = wayIds;
  }

  addWay(point: RoutePoint) {
    this.ways.push(point);
  }
}
