import { BasePoint } from "./BasePoint";
import type { RoutePoint } from "./RoutePoint";

export class DestinationPoint extends BasePoint {
  name: string;
  linkedRoutePoint: RoutePoint;

  constructor(id: number, x: number, z: number, name: string, linkedRoutePoint: RoutePoint) {
    super(id, x, z);
    this.name = name;
    this.linkedRoutePoint = linkedRoutePoint;
  }
}