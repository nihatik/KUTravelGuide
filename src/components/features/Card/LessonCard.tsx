import React from "react";
import { Card } from "./Card";
import "./LessonCard.css";

type Lesson = {
  name: string;
  time: string;
  room?: string;
  teacher?: string;
};

interface LessonCardProps {
  lesson: Lesson;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  const { name, time, room, teacher } = lesson;

  return (
    <Card className="lesson-card">
      <div className="lesson-card__content">
        <div className="lesson-card__main">
          <h3 className="lesson-card__name">{name}</h3>
          <span className="lesson-card__time">{time}</span>
        </div>

        <div className="lesson-card__details">
          {room && (
            <div className="lesson-card__detail">
              <span className="lesson-card__label">Аудитория:</span>
              <span>{room}</span>
            </div>
          )}
          {teacher && (
            <div className="lesson-card__detail">
              <span className="lesson-card__label">Преподаватель:</span>
              <span>{teacher}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
