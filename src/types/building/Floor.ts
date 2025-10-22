import type { DestinationPoint, PlanPoint, RoutePoint } from "../point";

export default class Floor {
  constructor(
    public number: number,
    public rooms: number[],
    public routePoints: RoutePoint[],
    public destinationPoints: DestinationPoint[],
    public planPoints: PlanPoint[],
  ) {
  }
}