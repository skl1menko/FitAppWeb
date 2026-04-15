import "./MuscleSort.scss";

const MuscleSort = ({ groups = [], selectedGroup = "all", onChange }) => {
    return (
        <div className="muscle-sort-cont">
            <div className="muscle-sort-item">
                <button
                    type="button"
                    className={`muscle-sort-button ${selectedGroup === "all" ? "active" : ""}`}
                    onClick={() => onChange?.("all")}
                    aria-label="All"
                >
                    <div className="muscle-sort-icon-wrap">
                        <span className="muscle-sort-fallback">ALL</span>
                    </div>
                </button>
                <span className="muscle-sort-group">All</span>
            </div>
            <div className="muscle-sort-item">
                <button
                    type="button"
                    className={`muscle-sort-button ${selectedGroup === "custom" ? "active" : ""}`}
                    onClick={() => onChange?.("custom")}
                    aria-label="Custom"
                >
                    <div className="muscle-sort-icon-wrap">
                        <span className="muscle-sort-fallback">CUSTOM</span>
                    </div>
                </button>
                <span className="muscle-sort-group">Custom</span>
            </div>

            {groups.map((group) => (
                <div className="muscle-sort-item" key={group.value}>
                    <button
                        type="button"
                        className={`muscle-sort-button ${selectedGroup === group.value ? "active" : ""}`}
                        onClick={() => onChange?.(group.value)}
                        title={group.label}
                        aria-label={group.label}
                    >
                        <div className="muscle-sort-icon-wrap">
                            {group.imageUrl ? (
                                <img src={group.imageUrl} alt={group.label} className="muscle-sort-icon" />
                            ) : (
                                <span className="muscle-sort-fallback">{group.label.slice(0, 2).toUpperCase()}</span>
                            )}
                        </div>
                    </button>
                    <span className="muscle-sort-group">{group.label}</span>
                </div>
            ))}
        </div>
    );
};

export default MuscleSort;