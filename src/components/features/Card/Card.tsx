import React from "react";
import "./Card.css";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = "", ...rest }) => {
  return (
    <div
      className={`card ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};