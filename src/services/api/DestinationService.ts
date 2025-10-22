import type { DestinationPoint } from "@/types/point/DestinationPoints";
import BuildingService from "./BuildingService";

export default class DestinationService {
  public static points: DestinationPoint[] = [];

  public static async init() {
    await this.loadData();
  }

  public static async loadData(): Promise<void> {
    this.points = [];
    for (const building of BuildingService.getAll()) {
      if (building.keyPath) {
        const path = `/data/buildings/${building.keyPath}/destinations.json`;
        try {
          const res = await fetch(path);

          if (!res.ok) {
            if (res.status === 404) {
              continue;
            } else {
              throw new Error(`Ошибка загрузки: ${res.statusText}`);
            }
          }

          const data: Record<string, DestinationPoint[]> = await res.json();


          for (const [floorStr, floorPoints] of Object.entries(data)) {
          const floorNum = Number(floorStr) - 1;

            const floorPointsWithFloor = floorPoints.map((cp: DestinationPoint) => ({
              ...cp,
              floor: floorNum,
              x: cp.x,
              z: cp.z,
            }));
          }

        } catch (err) {
          console.error("Ошибка загрузки чекпоинтов:", err, `→ Загруза путей: ${building.name}`);
        }
      }
    }
  }
}
