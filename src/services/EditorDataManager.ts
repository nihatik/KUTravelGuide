import { RoutePoint } from "@/types/point/RoutePoint";
import type { DestinationPoint } from "@/types/point/DestinationPoints";
import { PlanPoint } from "@/types/point/PlanPoint";
import type { BasePoint } from "@/types/point/BasePoint";
import RoutesService from "./api/RoutesService";
import { Utils } from "@/utils/Utils";

export default class EditorDataManager {
    public static activeData: BasePoint[] = [];
    private static planData: PlanPoint[] = [];
    private static routesData: RoutePoint[] = [];
    private static destinationsData: DestinationPoint[] = [];

    public static init() {
    }

    public static getPlanData(): PlanPoint[] {
        return this.planData;
    }

    public static removePointNear(x: number, z: number, tolerance: number): void {
        this.activeData = this.activeData.filter(
            (p) => Math.abs(p.x - x) > tolerance || Math.abs(p.z - z) > tolerance
        );
    }

    public static setActiveData(data: BasePoint[]): BasePoint[] {
        if (!data || !data.length) {
            this.activeData = [];
            return this.activeData;
        }

        const first = data[0] as any;
        if (first instanceof RoutePoint || (first && (first as any).hasOwnProperty('someRouteSpecificProp'))) {
            this.activeData = data.map((p: any) => ({
                ...p,
                x: Utils.toFixedNumber((p.x + (RoutesService.offsetX ?? 0)) * 100),
                z: Utils.toFixedNumber((p.z + (RoutesService.offsetZ ?? 0)) * 100),
            }));
        } else {
            this.activeData = data.map((p: any) => ({
                ...p,
                x: Utils.toFixedNumber((p.x ?? p.position?.x ?? 0) * 10),
                z: Utils.toFixedNumber((p.z ?? p.position?.z ?? 0) * 10)
            }));
        }

        return this.activeData;
    }

    public static updatePoint(id: number, x: number, z: number): void {
        const point = this.routesData.find(p => p.id === id);
        if (!point) return;
        point.x = x;
        point.z = z;
    }

    public static getDestinationData(): DestinationPoint[] {
        return this.destinationsData;
    }

    public static setRoutesData(): RoutePoint[] {
        return this.routesData;
    }

    public static addPlanPoint(point: PlanPoint): void {
        this.planData.push(point);
    }
    public static addRoutePoint(point: PlanPoint): void {
        this.planData.push(point);
    }

    public static removePlanPoint(id: number): void {
        this.planData = this.planData.filter((p) => p.id !== id);
    }

    public static clear(): void {
        this.planData = [];
        this.routesData = [];
        this.destinationsData = [];
    }
}
