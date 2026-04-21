import { useEffect, useMemo, useRef, useState } from "react";
import "./MuscleGroupSelect.scss";

const MuscleGroupSelect = ({
    groups = [],
    value = "",
    onChange,
    placeholder = "Choose muscle group",
    includeAll = false,
    allLabel = "All muscle groups",
    className = "",
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef(null);

    const options = useMemo(() => {
        if (!includeAll) {
            return groups;
        }

        return [{ value: "all", label: allLabel }, ...groups];
    }, [allLabel, groups, includeAll]);

    const selectedOption = useMemo(() => {
        return options.find((option) => option.value === value) || null;
    }, [options, value]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!rootRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleSelect = (nextValue) => {
        onChange?.(nextValue);
        setIsOpen(false);
    };

    const wrapperClassName = ["muscle-group-select", className].filter(Boolean).join(" ");

    return (
        <div className={wrapperClassName} ref={rootRef}>
            <button
                type="button"
                className="muscle-group-select-trigger"
                onClick={() => setIsOpen((prev) => !prev)}
                disabled={disabled}
            >
                {selectedOption?.imageUrl ? (
                    <img src={selectedOption.imageUrl} alt={selectedOption.label} />
                ) : null}
                <span className={selectedOption ? "" : "placeholder"}>
                    {selectedOption?.label || placeholder}
                </span>
                <span className="chevron">v</span>
            </button>

            {isOpen ? (
                <div className="muscle-group-select-menu">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`muscle-group-select-option ${value === option.value ? "active" : ""}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.imageUrl ? <img src={option.imageUrl} alt={option.label} /> : null}
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default MuscleGroupSelect;
