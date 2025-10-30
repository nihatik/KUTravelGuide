import React, { useState } from "react";
import { Card } from "../../../../../components/features/Card/Card";
import "./BookmarkCard.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faXmark } from "@fortawesome/free-solid-svg-icons";

interface BookmarkCardProps {
    name: string;
    address: string;
    onClick?: () => void;
    onRemove?: () => void;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ name, address, onClick, onRemove }) => {
    const [imgSrc, setImgSrc] = useState(`/assets/buildings/${name}/preview.jpg`);

    return (
        <Card className="bookmark-card row" onClick={onClick}>
            <div className="bookmark-card-left">
                <img
                    className="bookmark-card-img"
                    src={imgSrc}
                    alt={name}
                />
            </div>
            <div className="bookmark-card-right">
                <div className="bookmark-card-header">
                    <p className="bookmark-card__title">{name}</p>
                    <p className="bookmark-card__address">{address}</p>
                </div>
                {onRemove && (
                    <button
                        className="bookmark-card-remove"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                    >
                        
                       <FontAwesomeIcon icon={faBookmark} />
                    </button>
                )}
            </div>
        </Card>
    );
};
