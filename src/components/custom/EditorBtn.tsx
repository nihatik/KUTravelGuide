import "./EditorBtn.css";

export interface ConditionBtnProps {
    id: string;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

export default function ConditionBtn({ id, active, label, onClick }: ConditionBtnProps) {
    return (
        <>
            <button
                key={id}
                className={`editor-btn ${active ? "active" : ""}`}
                onClick={onClick}
                type="button"
            >
                {<img src={"/assets/editor/" + id + ".png"} alt="" className="tab-icon" />}
                <span>{label}</span>
            </button>
        </>
    );
}