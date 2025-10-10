import { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

type DropdownProps = {
  label?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  width?: string;
  onChange?: (value: string) => void;
};

export default function Dropdown({
  options,
  placeholder = "Select...",
  width = "300px",
  onChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt: { label: string; value: string }) => {
    setSelected(opt.label);
    setIsOpen(false);
    onChange?.(opt.value);
  };

  return (
    <div className="dropdown-container" style={{ width }} ref={dropdownRef}>
      <div
        className={`dropdown ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="select">
          <span>{selected || placeholder}</span>
          <i className={`chevron ${isOpen ? "open" : ""}`}>❮</i>
        </div>
        {isOpen && (
          <ul className="dropdown-menu">
            {options.map((opt) => (
              <li key={opt.value} onClick={() => handleSelect(opt)}>
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
