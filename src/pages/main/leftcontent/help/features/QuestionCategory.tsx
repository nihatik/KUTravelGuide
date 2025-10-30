import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./QuestionCategory.css";
import { Card } from "@/components/features/Card/Card";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

interface QuestionCategoryProps {
  category: string;
  onClick?: () => void;
}

export const QuestionCategory: React.FC<QuestionCategoryProps> = ({ onClick, category = "" }) => {

  return (
    <>
      <Card className="question-category-card" onClick={onClick} 
        key={"question-category-" + category}>
        <div className="question-category-card__content">
          <p>{category}</p>
        </div>
        <FontAwesomeIcon icon={faAngleRight} />
      </Card>
    </>
  );
};