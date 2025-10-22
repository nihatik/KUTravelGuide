import { useEffect, useRef, useState } from "react";
import FileInput from "@/components/ui/FileInput/FileInput";
import "@/assets/styles/EditorMenu.css";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import EditorBtn from "@/components/features/Admin/EditorBtn";
import BuildingService from "@/services/api/BuildingService";
import { RoutePoint } from "@/types/point/RoutePoint";
import { PlanPoint } from "@/types/point/PlanPoint";
import TableInner from "@/components/features/Data/DataTable";
import Building from "@/types/building/Building";
import type { BasePoint } from "@/types/point/BasePoint";
import EditorDataManager from "@/services/EditorDataManager";
import RoutesService from "@/services/api/RoutesService";
import type Floor from "@/types/building/Floor";

const CELL_SIZE = 3;

const images = import.meta.glob("@/assets/images/buildings/*.{png,jpg,jpeg,webp}", { eager: true });
const imagePaths = Object.values(images).map((img: any) => img.default);

export default function EditorPage() {
    const [showData, setShowData] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(BuildingService.buildings?.[0] ?? null);
    const [selectedFloor, setSelectedFloor] = useState<Floor | null>(BuildingService.buildings?.[0].floors[0] ?? null);

    const [activeData, setActiveData] = useState<BasePoint[]>(() => EditorDataManager.activeData.slice());
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        BuildingService.init().then(() =>
            RoutesService.init().then(() => setIsLoaded(true))
        );
    }, [RoutesService]);

    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const [highlightedIds] = useState<number[]>([]);
    const [draggedNode, setDraggedNode] = useState<BasePoint | null>(null);

    const [mode, setMode] = useState<"plan" | "routes" | "points">("plan");

    const conditionButtons = [
        { id: "add", label: "Добавить", condition: true },
        { id: "remove", label: "Убрать", condition: true },
        { id: "edit", label: "Изменить", condition: true },
        { id: "drag", label: "Переместить", condition: true },
        { id: "point", label: "Добавить пункт назначения", condition: true },
        { id: "sortData", label: "Отсортировать данные", condition: false },
        { id: "showData", label: "Отображение данныъ", condition: false },
        { id: "saveData", label: "Сохранить данные", condition: false },
    ];

    useEffect(() => {
        if (!selectedFloor) return;
        console.log(selectedFloor)

        if (mode === "plan") {
            const arr = EditorDataManager.setActiveData(selectedFloor.planPoints ?? []);
            setActiveData(EditorDataManager.activeData.slice());
        } else if (mode === "routes") {
            const arr = EditorDataManager.setActiveData(selectedFloor.routePoints ?? []);
            setActiveData(EditorDataManager.activeData.slice());
        } else if (mode === "points") {
            const arr = EditorDataManager.setActiveData(selectedFloor.destinationPoints ?? []);
            setActiveData(EditorDataManager.activeData.slice());
        }
        setActiveId(null);
    }, [mode, selectedBuilding]);

    useEffect(() => {
        if (!selectedBuilding) return;
        const key = `${selectedBuilding.keyPath}_${selectedFloor?.number}`;
        const found = imagePaths.find((value) => (value as string).includes(key));
        setImgSrc(found ?? null);
    }, [selectedBuilding, selectedFloor]);

    const editorBtnClick = (btn: any) => {
        if (btn.condition) {
            setActiveId(btn.id);
        } else {
            switch (btn.id) {
                case "saveData":
                    exportData();
                    break;
                case "showData":
                    setShowData((s) => !s);
                    break;
            }
        }
    };

    const selectBuilding = (e: any) => {
        const selectValue = e.target.value;
        const result: Building | undefined = BuildingService.buildings.find((building) => String(building.keyPath) === String(selectValue));
        if (result) {
            BuildingService.setActive(result);
            setSelectedBuilding(result);
            setSelectedFloor(result.floors[0]);
            setTimeout(() => {
                if (mode === "plan") EditorDataManager.setActiveData(selectedFloor?.planPoints ?? []);
                if (mode === "routes") EditorDataManager.setActiveData(selectedFloor?.routePoints ?? []);
                setActiveData(EditorDataManager.activeData.slice());
            }, 0);
        }
    };
    const selectBuildingFloor = (e: any) => {
        const selectValue = Number(e.target.value);
        if (selectedBuilding) {
            setSelectedFloor(selectedBuilding.floors[selectValue]);
            console.log(selectedFloor)
        }
    };

    const handleImage = (img: any) => {
        setImgSrc(img);
    };
    const handleImageFile = (file: File | null) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setImgSrc(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        const xClick = e.clientX - rect.left;
        const zClick = e.clientY - rect.top;

        const xCell = Math.floor(xClick / CELL_SIZE);
        const zCell = Math.floor(zClick / CELL_SIZE);
        const tolerance = 1;
        if (activeId === "add") {
            let newValue: any = null;
            if (mode === "routes") {
                newValue = new RoutePoint(EditorDataManager.activeData.length, xCell, zCell, []);
            } else if (mode === "plan") {
                newValue = new PlanPoint(EditorDataManager.activeData.length, xCell, zCell, EditorDataManager.activeData.length - 1, selectedFloor?.number ?? 0);
            } else if (mode === "points") {
                newValue = {
                    id: EditorDataManager.activeData.length,
                    x: xCell,
                    z: zCell,
                };
            }
            if (newValue) {
                EditorDataManager.activeData.push(newValue);
                setActiveData(EditorDataManager.activeData.slice());
            }
        } else if (activeId === "remove") {
            EditorDataManager.removePointNear(xCell, zCell, tolerance);
            setActiveData(EditorDataManager.activeData.slice());
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggedNode || !imgRef.current || activeId !== "drag") return;

        const rect = imgRef.current.getBoundingClientRect();
        const xClick = e.clientX - rect.left;
        const zClick = e.clientY - rect.top;

        const xCell = Math.floor(xClick / CELL_SIZE);
        const zCell = Math.floor(zClick / CELL_SIZE);

        EditorDataManager.updatePoint(draggedNode.id, xCell, zCell);
        setActiveData(EditorDataManager.activeData.slice());
    };

    const handleMouseUp = () => {
        setDraggedNode(null);
    };

    const exportData = () => {
        const shifted = activeData.map((cp: any) => ({
            ...cp,
            x: (cp.x ?? (cp.position?.x ?? 0)) / 10,
            z: (cp.z ?? (cp.position?.z ?? 0)) / 10,
        }));

        const blob = new Blob([JSON.stringify(shifted, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${mode}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <div className="redact-content">
                {!imgSrc && (
                    <>
                        <h2 style={{ margin: "6px 0" }}>Выберите план</h2>
                        <div className="image-gallery center">
                            {imagePaths.map((src, i) => (
                                <div key={i} onClick={() => handleImage(src)}>
                                    <img src={src} alt={`building-${i + 1}`} />
                                    <div className="shadow"></div>
                                    <span>{src}</span>
                                </div>
                            ))}
                            <FileInput
                                width="355px"
                                name="image"
                                accept="image/*"
                                label="Загрузить план"
                                onChange={handleImageFile}
                            />
                        </div>
                    </>
                )}

                {imgSrc && (
                    <>
                        {showData && activeData != null && activeData.length > 0 && (
                            <TableInner
                                id="routes"
                                headValues={Object.keys(activeData[0])}
                                values={activeData.map(node =>
                                    Object.keys(node).map(key => {
                                        const value = (node as any)[key];
                                        if (typeof value === "object") return JSON.stringify(value);
                                        return value;
                                    })
                                )}
                            />
                        )}
                        <div className="column" style={{ height: "100vh", width: "100%" }}>
                            <div className="top-panel">
                                <select id="floor-select" onChange={selectBuildingFloor} value={String(selectedFloor != null ? selectedFloor?.number : 1)}>
                                    {selectedBuilding
                                        ? Array.from({ length: selectedBuilding.floorCount }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1} этаж
                                            </option>
                                        ))
                                        : <option>1 этаж</option>}
                                </select>
                                <select id="building-select" onChange={selectBuilding} value={selectedBuilding?.keyPath ?? ""}>
                                    {BuildingService.buildings.map(building => (
                                        <option key={building.id} value={building.keyPath}>{building.name}</option>
                                    ))}
                                </select>
                                {conditionButtons.map(btn => (
                                    <EditorBtn
                                        key={btn.id}
                                        id={btn.id}
                                        label={btn.label}
                                        active={activeId === btn.id}
                                        onClick={() => editorBtnClick(btn)}
                                    />
                                ))}
                                <div className="row gap12 center">
                                    <Dropdown
                                        width="240px"
                                        options={[
                                            { label: "План здания", value: "plan" },
                                            { label: "Маршруты", value: "routes" },
                                            { label: "Пункт назначения", value: "points" },
                                        ]}
                                        onChange={(val) => setMode(val as any)}
                                    />
                                </div>
                            </div>
                            <div className="redact-panel-container">
                                <div className="centerX redact-panel">

                                    <div
                                        style={{
                                            position: "relative",
                                        }}
                                        onClick={handleClick}
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                    >
                                        <img
                                            ref={imgRef}
                                            src={imgSrc}
                                            alt="floor plan"
                                            style={{
                                                height: "auto",
                                                width: "100%",
                                                display: "block",
                                                cursor: draggedNode ? "grabbing" : (activeId === "drag" ? "grab" : "crosshair"),
                                            }}
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
                                                backgroundImage:
                                                    "linear-gradient(to right, rgba(0,0,0,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.2) 1px, transparent 1px)",
                                                pointerEvents: "none",
                                            }}
                                        />
                                        {isLoaded && activeData.map((node) => (
                                            <div
                                                key={node.id}
                                                className="node"
                                                onMouseDown={() => setDraggedNode(node)}
                                                style={{
                                                    position: "absolute",
                                                    left: (node.x ?? node.x ?? 0) * CELL_SIZE,
                                                    top: (node.z ?? node.z ?? 0) * CELL_SIZE,
                                                    width: 8,
                                                    height: 8,
                                                    transform: highlightedIds.includes(node.id) ? "scale(1.5)" : undefined,
                                                    borderRadius: "50%",
                                                    background: highlightedIds.includes(node.id)
                                                        ? "green"
                                                        : mode === "plan"
                                                            ? "red"
                                                            : mode === "routes"
                                                                ? "blue"
                                                                : "green",
                                                    cursor: "grab",
                                                }}
                                            >
                                                <span style={{ color: "#000", position: 'relative', fontSize: "10px", left: "-8px", top: "-12px" }}>
                                                    {node.id}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div >
        </>
    );
}
