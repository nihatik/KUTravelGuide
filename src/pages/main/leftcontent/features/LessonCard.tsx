import React from "react";
import { Card } from "../../../../components/features/Card/Card";
import "./LessonCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faClock, faUser } from "@fortawesome/free-solid-svg-icons";

type Lesson = {
  name: string;
  startTime: string;
  endTime: string;
  room?: string;
  teacher?: string;
};

interface LessonCardProps {
  lesson: Lesson;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  const { name, startTime, endTime, room, teacher } = lesson;

  return (
    <Card className="lesson-card">
      <div className="lesson-card__top">
        <span className="lesson-card__name">{name}</span>
        <span className="lesson-card__teacher">
          <FontAwesomeIcon
            icon={faUser}
          />{teacher}</span>
      </div>
      <div className="lesson-card__bottom">
        <span className="lesson-card__room">
          <FontAwesomeIcon
            icon={faBuilding}
          /> {room}</span>
        <div>
          <span className="lesson-card__time">
            <FontAwesomeIcon icon={faClock} style={{ color: 'gray' }} />{startTime} - {endTime}</span>
        </div>
      </div>
    </Card>
  );
};
