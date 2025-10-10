import "./BuildingCard.css";
import type Building from "../../model/Building";
import { useState } from "react";
import BuildingService from "../../services/BuildingService";

type BuildingCardProps = {
  building: Building;
  shown?: boolean;
  active: boolean;
  onSelect?: (id: number) => void;
  onJoin?: (id: number) => void;
};

export default function BuildingCard({ building, shown, active, onSelect }: BuildingCardProps) {
  const [localActive, setLocalActive] = useState(false);
  const [imgSrc, setImgSrc] = useState(`/assets/buildings/${building.keyPath}/preview.jpg`);

  const isActive = active !== undefined ? active : localActive;

  const handleJoin = () => {
    console.log(`Вход в здание: ${building.name}`);
    BuildingService.setActiveById(building.id);
  };
  return (
    <li
      className={`building-card ${shown ? "show" : ""} ${isActive ? "active" : ""}`}
      onClick={() => {
        onSelect?.(building.id);
        if (active === undefined) setLocalActive(!localActive);
      }}
    >
      <img
        className="building-card-img"
        src={imgSrc}
        alt={building.name}
        onError={() => {
          if (!imgSrc.endsWith(".png")) {
            setImgSrc(`/assets/buildings/${building.keyPath}/preview.png`);
          }
        }}
      />
      <div className="building-card-text column">
        <p className="builing-card-text-head">{building.name}</p>
        <p className="builing-card-text-street">{building.street}</p>
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
        </div>
      )}
    </li>
  );
}
