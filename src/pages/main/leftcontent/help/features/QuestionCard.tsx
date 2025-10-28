import React, { useState } from "react";
import { Card } from "../../../../../components/features/Card/Card";
import "./QuestionCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

interface QuestionCardProps {
  question: string;
  answer: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card
      className={`question-card column ${open ? "open" : ""}`}
      onClick={() => setOpen((prev) => !prev)}
    >
      <div className="question-card__content">
        <p className="question-card__question">{question}</p>
        <FontAwesomeIcon
          className={`question-card__icon ${open ? "rotated" : ""}`}
          icon={faAngleDown}
        />
      </div>
      <div className={`question-card__answer ${open ? "visible" : ""}`}>
        <p>{answer}</p>
      </div>
    </Card>
  );
};
