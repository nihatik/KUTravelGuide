import type { ReactNode } from "react";
import "./TabsBox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface TabProps {
    id: string;
    label: string;
    icon?: IconDefinition;
    isActive?: boolean;
    onSelect?: () => void;
    children?: ReactNode;
}

export default function Tab({ id, label, icon, isActive, onSelect }: TabProps) {
    const handleClick = () => {
        onSelect?.();
    };
    return (
        <button
            key={id}
            className={`tab-btn ${isActive ? "active" : ""}`}
            onClick={handleClick}
            id= {id + "-tab-btn" }
            type="button"
        >
            {icon && <FontAwesomeIcon className="fa-big" icon={icon} style={{ color: 'var(--kutg-color)' }} />}
            <span className={isActive && id === "main" ? "active" : ""}>{label}</span>
        </button>
    );
}