import type { DestinationPoint } from "@/types/point/DestinationPoints";
import BuildingService from "./BuildingService";

export default class DestinationService {
  public static points: DestinationPoint[] = [];

  public static async init() {
    await this.loadPoints();
  }

  public static async loadPoints(): Promise<void> {
    this.points = [];
    for (const building of BuildingService.getAll()) {
      if (building.keyPath) {
        const path = `/data/buildings/${building.keyPath}/destinations.json`;
        try {
          const res = await fetch(path);

          if (!res.ok) {
            if (res.status === 404) {
              building.planPoints = [];
              continue;
            } else {
              throw new Error(`Ошибка загрузки: ${res.statusText}`);
            }
          }

          const data: Record<string, DestinationPoint[]> = await res.json();


          for (const [floorStr, floorPoints] of Object.entries(data)) {
            const floorNum = Number(floorStr);

            const floorPointsWithFloor = floorPoints.map((cp: DestinationPoint) => ({
              ...cp,
              floor: floorNum,
              position: {
                x: cp.x,
                z: cp.z,
              },
            }));

            this.points.push(...floorPointsWithFloor);
          }

        } catch (err) {
          console.error("Ошибка загрузки чекпоинтов:", err, `→ Загруза путей: ${building.name}`);
        }
      }
    }
  }
}
