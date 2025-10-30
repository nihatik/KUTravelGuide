import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./KUTGSearch.css";
import { useState } from "react";

type KUTGSearchProps = {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string | null;
};

export default function KUTGSearch({ onChange, placeholder }: KUTGSearchProps) {
    const [value, setValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onChange?.(e);
    };

    const clearInput = () => {
        setValue("");
        onChange?.({ target: { value: "" } } as any);
    };

    return (
        <div className="kutg-search-wrapper">
            {!value && 
            <FontAwesomeIcon icon={faMagnifyingGlass} className="kutg-search-icon" />
            }
            <input
                className="kutg-search"
                type="search"
                value={value}
                onChange={handleChange}
                placeholder={placeholder ?? "Поиск..."}
            />
            {value && (
                <FontAwesomeIcon
                    icon={faXmark}
                    className="kutg-clear-icon"
                    onClick={clearInput}
                />
            )}
        </div>
    );
}