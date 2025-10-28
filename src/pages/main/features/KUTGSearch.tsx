import "./KUTGSearch.css"

type KUTGSearchProps = {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string | null;
};



export default function KUTGSearch({ onChange, placeholder }: KUTGSearchProps) {
    return (
        <input
            className="buildingSearch"
            type="search"
            onChange={onChange}
            placeholder={placeholder ?? "Поиск..."}
        />
    );
}