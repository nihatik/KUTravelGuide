import "./BuildingCard.css";
import { useRef, useState } from "react";
import BuildingService from "@/services/api/BuildingService";
import { Card } from "../../../../../components/features/Card/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Utils } from "@/utils/Utils";
import type { ServerBuildingDTO } from "@/services/api/BuildingsHttp";




const LOCAL_STORAGE_KEY = "bookmarks";

type BuildingCardProps = {
  building: ServerBuildingDTO;
  shown?: boolean;
  active: boolean;
  onSelect?: (id: number) => void;
  onJoin?: (id: number) => void;
};

export default function BuildingCard({ building, shown, active, onSelect }: BuildingCardProps) {
  const mapRef = useRef<any>(null);
  const [localActive, setLocalActive] = useState(false);
  const [imgSrc, setImgSrc] = useState(`/assets/buildings/${building.name}/preview.jpg`);

  const isActive = active !== undefined ? active : localActive;

  const handleJoin = () => {
    console.log(`Вход в здание: ${building.name}`);
    BuildingService.setActiveById(building.id);
  };

  const handleBookmark = () => {
    const storedBookmarks = localStorage.getItem(LOCAL_STORAGE_KEY);
    let bookmarks: { id: number; name: string; address: string }[] = storedBookmarks ? JSON.parse(storedBookmarks) : [];

    if (!bookmarks.find(b => b.id === building.id)) {
      bookmarks = [
        { id: building.id, name: building.name, address: building.street || "" },
        ...bookmarks
      ].slice(0, 20);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookmarks));
      console.log(`Здание добавлено в закладки: ${building.name}`);
    } else {
      console.log(`Здание уже в закладках: ${building.name}`);
    }
  };

  return (
    <>
      <Card className={`building-card ${shown ? "show" : ""} ${isActive ? "active" : ""}`}
        onClick={() => {
          onSelect?.(building.id);
          if (active === undefined) setLocalActive(!localActive);
        }}>
        <img
          className="building-card-img"
          src={imgSrc}
          alt={building.name}
          onError={() => {
            if (!imgSrc.endsWith(".png")) {
              setImgSrc(`/assets/buildings/${building.name}/preview.png`);
            }
          }}
        />
        <div className="building-card-right column">
          <div>
            <span className="building-card-text-head">
              <p>{building.name}</p>
              <img src={"/assets/type" + building.buildingType.toLowerCase() + ".png"}></img>
            </span>
            <p className="building-card-text-street">{building.street}</p>
          </div>
          <div className="row gap8 building-card-right-bottom">
            <span className="building-card-floor-count">
              <svg width={"16px"} viewBox="-32 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path fill="gray" d="M9.625 157.797C6.125 156.046 3.64583 154.15 2.1875 152.108C0.729167 150.066 0 147.294 0 143.793C0 140.292 0.729167 137.521 2.1875 135.478C3.64583 133.436 6.125 131.54 9.625 129.789L195.417 37.0152C203 33.3198 212.528 31.6666 224 32.0556C235.472 31.6666 245 33.3198 252.583 37.0152L438.375 129.789C441.875 131.54 444.354 133.436 445.812 135.478C447.271 137.521 448 140.292 448 143.793C448 147.294 447.271 150.066 445.812 152.108C444.354 154.15 441.875 156.046 438.375 157.797L252.583 250.571C245 254.266 235.472 255.919 224 255.531C212.528 255.919 203 254.266 195.417 250.571L9.625 157.797ZM9.625 382.439C6.125 380.688 3.64583 378.792 2.1875 376.75C0.729167 374.707 0 371.936 0 368.435C0 364.934 0.729167 362.162 2.1875 360.12C3.64583 358.078 6.125 356.182 9.625 354.431L56.2917 331.092L195.417 400.527C203.194 404.222 212.722 405.778 224 405.195C235.278 405.778 244.806 404.222 252.583 400.527L391.708 331.092L438.375 354.431C441.875 356.182 444.354 358.078 445.812 360.12C447.271 362.162 448 364.934 448 368.435C448 371.936 447.271 374.707 445.812 376.75C444.354 378.792 441.875 380.688 438.375 382.439L252.583 475.213C244.806 478.908 235.278 480.464 224 479.881C212.722 480.464 203.194 478.908 195.417 475.213L9.625 382.439ZM9.625 270.409C6.125 268.659 3.64583 266.763 2.1875 264.72C0.729167 262.678 0 259.907 0 256.406C0 252.905 0.729167 250.133 2.1875 248.091C3.64583 246.049 6.125 244.153 9.625 242.402L56.2917 219.063L195.417 288.497C203.194 292.193 212.722 293.749 224 293.165C235.278 293.749 244.806 292.193 252.583 288.497L391.708 219.063L438.375 242.402C441.875 244.153 444.354 246.049 445.812 248.091C447.271 250.133 448 252.905 448 256.406C448 259.907 447.271 262.678 445.812 264.72C444.354 266.763 441.875 268.659 438.375 270.409L252.583 363.184C244.806 366.879 235.278 368.435 224 367.851C212.722 368.435 203.194 366.879 195.417 363.184L9.625 270.409Z">
                  </path>
                </g>
              </svg> {building.floors && building.floors.length + " / " + building.floors.length}
            </span>
            <span className="building-card-working-hours">
              <FontAwesomeIcon icon={faClock} style={{ color: 'gray' }} />
              13:00 - 18:00
            </span>
          </div>
        </div>
        {isActive && (
          <div className="building-card-active">
            <button
              className="join-button"
              onClick={(e) => {
                e.stopPropagation();
                handleJoin();
              }}
            >
              Войти в здание
            </button>

            <button
              className="bookmark-button"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark();
              }}
            >
              Добавить в закладки
            </button>

            {BuildingService.activeFloor && BuildingService.activeFloor.routePoints && BuildingService.activeFloor.routePoints.map((cp) => (
              <div
                className="final-point"
                key={cp.id}
                onClick={(e) => {
                  e.stopPropagation();
                  mapRef.current?.focusToCheckpoint(cp.id);
                }}
              >
                <p>
                  Чекпоинт {cp.id}: ({Utils.toFixedNumber(cp.x)}, {Utils.toFixedNumber(cp.z)})
                </p>
              </div>
            ))}
          </div>
        )}

      </Card>
    </>
  );
}
