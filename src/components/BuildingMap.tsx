import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Line, Billboard } from "@react-three/drei";
import "../styles/BuildingMap.css";
import RoutesService from "../services/RoutesService";
import type { Vector3 } from "three";
import type { RoutePoint } from "../model/RoutePoint";
import type { PlanPoint } from "../model/PlanPoint";
import BuildingService from "../services/BuildingService";
import GeoService from "../services/GeoService";

type BuildingMapProps = { points?: PlanPoint[]; onAddPointByClick?: (point: PlanPoint) => void };

function WallBetweenPoints({ start, end }: { start: PlanPoint; end: PlanPoint }) {
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);

  return (
    <mesh
      position={[start.x + dx / 2 - 20.35, 1.5, start.z + dz / 2 - 15]}
      rotation={[0, -angle, 0]}
    >
      <boxGeometry args={[length, 6, 0.2]} />
      <meshStandardMaterial color="lightgray" />
    </mesh>
  );
}

const BuildingMap = forwardRef(({ points: controlledPoints, onAddPointByClick }: BuildingMapProps, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [currentPos, setCurrentPos] = useState<{ x: number; z: number } | null>(null);

  const [points, setPoints] = useState<PlanPoint[]>(controlledPoints ?? []);

  const [startPos, setStartPos] = useState<Vector3>();

  const [selectedCheckpoint, setSelectedCheckpoint] = useState<number | null>(null);
  const controlsRef = React.useRef<any>(null);

  useEffect(() => {
    GeoService.getCurrentPosition()
      .then(pos => setCurrentPos({ x: pos.longitude, z: pos.latitude }))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    BuildingService.init().then(() =>
      RoutesService.init().then(() => setIsLoaded(true))
    );
  }, [RoutesService]);

  const handleCheckpointClick = (id: number) => {
    setSelectedCheckpoint(id);
  };

  const handleMapRightClick = (point: Vector3) => {
  };

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (controlsRef.current) controlsRef.current.object.position.multiplyScalar(0.8);
    },
    zoomOut: () => {
      if (controlsRef.current) controlsRef.current.object.position.multiplyScalar(1.2);
    },
    setCameraPosition: (x: number, y: number, z: number) => {
      if (controlsRef.current) {
        controlsRef.current.object.position.set(x, y, z);
        controlsRef.current.update();
      }
    },
  }));

  const initialCameraPos = [50, 150, 50];

  useEffect(() => {
    if (controlsRef.current) {
    }
  }, [points]);



  let routePoints: [number, number, number][] = [];
  let path: RoutePoint[] | null;

  if (selectedCheckpoint && startPos) {
    const target = BuildingService.activeBuilding.routePoints.find(c => c.id === selectedCheckpoint);
    if (target) {
      path = RoutesService.findPath(startPos, target);

      console.log("Путь", path)
      if (path) {
        routePoints = path.map(p => [p.x, 0.5, p.z]);
      }
    }
  }

  useEffect(() => {
    const building = BuildingService.activeBuilding;
    if (!building || !building.routePoints) return; {

      const cp = building.routePoints.find(
        c => c.id === selectedCheckpoint
      );
      if (cp) setSelectedCheckpoint(cp.id);
    }
  }, [selectedCheckpoint, BuildingService.activeBuilding]);

  return (
    <>
      <div className="marshrut">
        <p>Пункт назначения: {startPos ? startPos.x + " | " + startPos.z : null}</p>
        <br></br>
        <p>Ваше местоположение: {selectedCheckpoint ?? 0}</p>

      </div>
      <Canvas id="map" className="campus-map-canvas" camera={{ position: [0, 2000, 100], fov: 10 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} onPointerDown={(e) => {
          if (e.button === 2) {
            e.stopPropagation();
            setStartPos(e.point);
          }
        }}>
          <planeGeometry args={[400, 400]} />
          <meshStandardMaterial color="gray" />
        </mesh>

        {!isLoaded ? (
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
            rotation={[-Math.PI / 2, 0, 0]}
          >
            Загрузка...
          </Text>
        ) : (

          <>
            {isLoaded && BuildingService.activeBuilding && BuildingService.activeBuilding.planPoints
              ? BuildingService.activeBuilding.planPoints.map((p) =>
                p.parentId ? (
                  <WallBetweenPoints
                    key={p.id}
                    start={BuildingService.activeBuilding.planPoints.find((pt) => pt.id === p.parentId)!}
                    end={p}
                  />
                ) : null
              )
              : null}
            {isLoaded && BuildingService.activeBuilding && BuildingService.activeBuilding.routePoints &&
              BuildingService.activeBuilding.routePoints.map((cp) => (
                <mesh
                  key={cp.id}
                  position={[cp.x, 0.5, cp.z]}
                  onClick={() => handleCheckpointClick(cp.id)}
                >
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshStandardMaterial color={cp.id === selectedCheckpoint ? "red" : "yellow"} />
                  <Billboard>
                    <Text
                      position={[0.3, 0.5, 0]}
                      fontSize={0.4}
                      color="white"
                      anchorX="center"
                      anchorY="middle"
                    >
                      {cp.id}
                    </Text>
                  </Billboard>

                </mesh>
              ))
            }
          </>
        )}

        {routePoints.length > 1 && (
          <Line points={routePoints} color="#22ab01" lineWidth={3} dashed={false} />
        )}

        <OrbitControls
          enableDamping
          dampingFactor={0.04}
          minDistance={50}
          maxDistance={500}
          ref={controlsRef}
          enablePan={false}
        />
      </Canvas >
    </>
  );
});

export default BuildingMap;
