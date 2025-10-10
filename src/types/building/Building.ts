
import type { BuildingType } from "./BuildingType";
import type { DestinationPoint } from "@/point/DestinationPoints";
import type { PlanPoint } from "@/point/PlanPoint";
import type { RoutePoint } from "@/point/RoutePoint";

export default class Building {
  constructor(
    public id: number,
    public name: string,
    public type: BuildingType,
    public position: [number, number],
    public street: string,
    public description: string,
    public keyPath: string,
    public planPoints: PlanPoint[],
    public routePoints: RoutePoint[],
    public destinationPoints: DestinationPoint[],
    public floorCount: number | 0
  ) {
  }
}