import "@/assets/styles/RightPanel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

type RightPanelProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onGetLocation: () => void;
};

export default function RightPanel({ onZoomIn, onZoomOut, onGetLocation }: RightPanelProps) {
  return (
    <div id="right-panel">
      <button onClick={onZoomIn}>
        <FontAwesomeIcon className="fa-big" icon={faPlus}/>
      </button>
      <button onClick={onZoomOut}>
        <FontAwesomeIcon className="fa-big" icon={faMinus}/>
      </button>
      <button onClick={onGetLocation}>
        <FontAwesomeIcon className="fa-big" icon={faLocationDot}/>
      </button>
    </div>
  );
}
