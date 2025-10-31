import Floor from "@/types/building/Floor";
import { PlanPoint } from "@/types/point/PlanPoint";
import { BuildingsHttp, type ServerBuildingDTO } from "./BuildingsHttp";


export default class BuildingService {

  public static activeBuilding: ServerBuildingDTO | null = null;
  public static activeFloor: Floor;

  public static buildings: ServerBuildingDTO[] = [];

  public static async init() {
    this.buildings = await BuildingsHttp.list();
    console.log(this.buildings)
    await this.loadData();
  }

  public static async loadData(): Promise<void> {
    for (const building of this.buildings) {
      if (!building.name) continue;

      console.log(`→ Загрузка плана: ${building.name}`);

      const planPath = `/data/buildings/${building.name}/plan.json`;

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

          const floorPointsWithFloor = floorPoints.map(
            (cp) =>
              new PlanPoint(
                Number(cp.id),
                cp.position?.x,
                cp.position?.z,
                Number(cp.parentId) ?? 0,
                floorNum
              )
          );

          console.log("LOADING: ", building.name, floorNum);

          const floorIndex = floorNum - 1;
          if (building.floors[floorIndex] == null) {
            building.floors[floorIndex] = new Floor(floorNum, [], [], [], []);
          }
          building.floors[floorIndex].planPoints.push(...floorPointsWithFloor);
        }
      } catch (err) {
        console.error(`Ошибка загрузки точек (${building.name}):`, err);
      }
    }
  }

  public static setActiveById(id: number) {
    const building = this.getById(id);
    if (building) {
      this.setActive(building);
    }
  }


  public static setActive(building: ServerBuildingDTO) {
    this.activeBuilding = building;
    this.activeFloor = building.floors[0];

    console.log(this.buildings);
    console.log(this.activeBuilding, this.activeFloor);
  }

  public static clearActive() {
    this.activeBuilding = null;
  }

  public static getById(id: number): ServerBuildingDTO | null {
    return this.buildings.find(c => c.id === id) || null;
  }

  public static getByName(name: string): ServerBuildingDTO | null {
    return this.buildings.find(c => c.name === name) || null;
  }

  public static searchByValue(value: string): ServerBuildingDTO[] {
    return this.buildings.filter(c => c.name.toLowerCase().startsWith(value.toLowerCase()) || c.name.toLowerCase().includes(value.toLowerCase()));
  }

  public static getAll(): ServerBuildingDTO[] {
    return this.buildings;
  }


  public static getByCoordinates(
    lat: number,
    lng: number,
    tolerance: number = 0.0001
  ): ServerBuildingDTO[] {
    return this.buildings.filter(c => {
      if (!c.position || c.position == null) return false;

      const buildingLat = Array.isArray(c.position) ? c.position[0] : c.position.latitude;
      const buildingLng = Array.isArray(c.position) ? c.position[1] : c.position.longitude;
      return Math.abs(buildingLat - lat) <= tolerance &&
        Math.abs(buildingLng - lng) <= tolerance;
    });
  }

  public static removeCampusById(id: number): boolean {
    const index = this.buildings.findIndex(c => c.id === id);
    if (index >= 0) {
      this.buildings.splice(index, 1);
      return true;
    }
    return false;
  }
}
