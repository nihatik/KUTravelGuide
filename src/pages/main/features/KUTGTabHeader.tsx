import "./KUTGTabHeader.css"

type KUTGTabHeaderProps = {
    title?: string;
};

export default function KUTGTabHeader({ title }: KUTGTabHeaderProps) {
    return (
        <div className="kutg-tab-header">
            {title && <span>{title}</span>}
        </div>
    )
}