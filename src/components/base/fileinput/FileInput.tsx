import { useState, type ChangeEvent } from "react";
import "./FileInput.css";

interface FileInputProps {
    width?: string;
    name?: string;
    accept?: string;
    label?: string;
    onChange?: (file: File | null) => void;
}

export default function FileInput({
    width = "300px",
    name = "file",
    accept = "*/*",
    label = "Выберите файл",
    onChange,
}: FileInputProps) {
    const [fileName, setFileName] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFileName(file ? file.name : "");
        if (onChange) onChange(file);
    };

    return (
        <label className="input-file" style={{ width }}>
            <span className="input-file-text">{fileName || "Файл не выбран"}</span>
            <input
                type="file"
                name={name}
                accept={accept}
                onChange={handleChange}
            />
            <span className="input-file-btn">{label}</span>
        </label>
    );
}
