import Building from "@/types/building/Building";
import { BuildingType } from "@/types/building/BuildingType";
import Floor from "@/types/building/Floor";
import { PlanPoint } from "@/types/point/PlanPoint";


export default class BuildingService {

  public static activeBuilding: Building;
  public static activeFloor: Floor;

  public static buildings: Building[] = [
    new Building(0, "1 корпус", BuildingType.Campus, [54.8783257, 69.134562], "Абая Кунанбаева, 18", "", "1", [], 2),
    new Building(1, "2 корпус", BuildingType.Campus, [54.8776746, 69.132845], "", "", "2", [], 2),
    new Building(2, "4 корпус", BuildingType.Campus, [54.8761899, 69.131980], "", "", "4", [], 4),
    new Building(3, "5 корпус", BuildingType.Campus, [54.8753436, 69.133293], "", "", "5", [], 4),
    new Building(4, "6 корпус", BuildingType.Campus, [54.8751475, 69.134857], "", "", "6", [], 4),
    new Building(5, "10 корпус", BuildingType.Campus, [54.8769555, 69.133369], "", "", "", [], 0),
    new Building(6, "УЛК", BuildingType.Campus, [0, 0], "Александра Пушкина, 86Б", "", "ulk", [], 10),
    new Building(7, "Общежитие 1", BuildingType.Dormitory, [54.8779410, 69.130018], "", "", "", [], 1),
    new Building(8, "Winston | Столовая", BuildingType.Eatery, [54.8763896, 69.132708], "", "", "", [], 1)
  ];

  public static async init() {
    await this.loadData();
  }

  public static async loadData(): Promise<void> {
    for (const building of this.buildings) {
      if (!building.keyPath) continue;

      console.log(`→ Загрузка плана: ${building.name}`);

      const planPath = `/data/buildings/${building.keyPath}/plan.json`;

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


  public static setActive(building: Building) {
    this.activeBuilding = building;
    this.activeFloor = building.floors[0];

    console.log(this.buildings);
    console.log(this.activeBuilding, this.activeFloor);
  }

  public static getById(id: number): Building | null {
    return this.buildings.find(c => c.id === id) || null;
  }

  public static getByName(name: string): Building | null {
    return this.buildings.find(c => c.name === name) || null;
  }

  public static searchByValue(value: string): Building[] {
    return this.buildings.filter(c => c.name.toLowerCase().startsWith(value.toLowerCase()) || c.name.toLowerCase().includes(value.toLowerCase()));
  }

  public static getAll(): Building[] {
    return this.buildings;
  }


  public static getByCoordinates(lat: number, lng: number, tolerance: number = 0.0001): Building[] {
    return this.buildings.filter(c =>
      Math.abs(c.position[0] - lat) < tolerance &&
      Math.abs(c.position[1] - lng) < tolerance
    );
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
