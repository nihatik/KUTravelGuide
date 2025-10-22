import type { Vector3 } from "three";
import BuildingService from "@/services/api/BuildingService";
import { RoutePoint } from "@/types/point/RoutePoint";
import Floor from "@/types/building/Floor";


export default class RoutesService {
  public static offsetX = 20.2;
  public static offsetZ = 14.9;

  public static async init() {
    await this.loadData();
  }

  public static async loadData(): Promise<void> {
    for (const building of BuildingService.getAll()) {
      if (building.keyPath !== "" && building.name != "УЛК") {
        const planPath = `/data/buildings/${building.keyPath}/routes.json`;
        try {
          const res = await fetch(planPath);

          if (!res.ok) {
            if (res.status === 404) {
              continue;
            } else {
              throw new Error(`Ошибка загрузки: ${res.statusText}`);
            }
          }

          const data: Record<string, any[]> = await res.json();

          for (const [floorStr, floorPoints] of Object.entries(data)) {
            const floorNum = Number(floorStr);

            const floorPointsWithFloor = floorPoints.map((cp) =>
              new RoutePoint(
                cp.id,
                cp.x / 1 - this.offsetX,
                cp.z / 1 - this.offsetZ,
                cp.wayIds
              )
            );

            const floorIndex = floorNum - 1;
            if (building.floors[floorIndex] == null) {
              building.floors[floorIndex] = new Floor(floorNum, [], [], [], []);
            } 
            building.floors[floorIndex].routePoints.push(...floorPointsWithFloor);
          }
        } catch (err) {
          console.error("Ошибка загрузки чекпоинтов:", err, `→ Загруза путей: ${building.name}`);
        }
      }
    }
  }

  public static findPath(start: Vector3, target: RoutePoint): RoutePoint[] | null {
    let path: RoutePoint[] = [];

    const closestCP = this.findClosestCheckpoint(start);
    if (closestCP) path.push(closestCP)

    let safetyCounter = 0;
    while (target.id !== path[path.length - 1].id && safetyCounter < 2000) {
      const newRoutePoint = this.findClosestPoint(path[path.length - 1], target);
      if (!newRoutePoint) break;
      path.push(newRoutePoint);
      safetyCounter++;
    }

    return path;
  }
  private static findClosestCheckpoint(start: Vector3): RoutePoint | undefined {

    const startRoutePoint: RoutePoint = new RoutePoint(-1, start.x, start.z, [])

    let closest: RoutePoint | undefined;
    let minDiff = Infinity;


    for (const cp of BuildingService.activeFloor.routePoints) {
      const diff = this.getDifference(cp, startRoutePoint);
      if (diff < minDiff) {
        minDiff = diff;
        closest = cp;
      }
    }
    return closest;
  }
  private static findClosestPoint(from: RoutePoint, target: RoutePoint): RoutePoint | undefined {
    const candidates = from.ways

    let closest: RoutePoint | undefined;
    let minDiff = Infinity;


    for (const cp of candidates) {
      const diff = this.getDifference(cp, target);
      if (diff < minDiff) {
        minDiff = diff;
        closest = cp;
      }
    }
    return closest;
  }

  private static getDifference(from: RoutePoint, target: RoutePoint): number {
    return Math.abs(from.x - target.x) +
      Math.abs(from.z - target.z);
  }
}
