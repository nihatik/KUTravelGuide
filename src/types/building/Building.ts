
import type { DestinationPoint, PlanPoint, RoutePoint } from "../point";
import type { BuildingType } from "./BuildingType";
import type Floor from "./Floor";

export default class Building {
  constructor(
    public id: number,
    public name: string,
    public type: BuildingType,
    public position: [number, number],
    public address: string,
    public description: string,
    public keyPath: string,
    public floors: Floor[],
    public floorCount: number | 0
  ) {
  }

  getFloorByNumber(floorNum: number): Floor | null {
    return this.floors.find(f => f.number === floorNum) || null;
  }
}