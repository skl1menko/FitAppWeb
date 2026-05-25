import "./MuscleSort.scss";
import { useTranslation } from "react-i18next";
import { getMuscleGroupTranslationKey } from "../constants/muscleGroups";

const MuscleSort = ({ groups = [], selectedGroup = "all", onChange }) => {
    const { t } = useTranslation();

    return (
        <div className="muscle-sort-cont">
            <div className="muscle-sort-item">
                <button
                    type="button"
                    className={`muscle-sort-button ${selectedGroup === "all" ? "active" : ""}`}
                    onClick={() => onChange?.("all")}
                    aria-label={t('exercises.filters.all')}
                >
                    <div className="muscle-sort-icon-wrap">
                        <span className="muscle-sort-fallback">ALL</span>
                    </div>
                </button>
                <span className="muscle-sort-group">{t('exercises.filters.all')}</span>
            </div>
            <div className="muscle-sort-item">
                <button
                    type="button"
                    className={`muscle-sort-button ${selectedGroup === "custom" ? "active" : ""}`}
                    onClick={() => onChange?.("custom")}
                    aria-label={t('exercises.filters.custom')}
                >
                    <div className="muscle-sort-icon-wrap">
                        <span className="muscle-sort-fallback">CUSTOM</span>
                    </div>
                </button>
                <span className="muscle-sort-group">{t('exercises.filters.custom')}</span>
            </div>

            {groups.map((group) => (
                (() => {
                    const translatedLabel = t(`exercises.muscleGroups.${getMuscleGroupTranslationKey(group.value)}`);

                    return (
                <div className="muscle-sort-item" key={group.value}>
                    <button
                        type="button"
                        className={`muscle-sort-button ${selectedGroup === group.value ? "active" : ""}`}
                        onClick={() => onChange?.(group.value)}
                        title={translatedLabel}
                        aria-label={translatedLabel}
                    >
                        <div className="muscle-sort-icon-wrap">
                            {group.imageUrl ? (
                                <img src={group.imageUrl} alt={translatedLabel} className="muscle-sort-icon" />
                            ) : (
                                <span className="muscle-sort-fallback">{translatedLabel.slice(0, 2).toUpperCase()}</span>
                            )}
                        </div>
                    </button>
                    <span className="muscle-sort-group">{translatedLabel}</span>
                </div>
                    );
                })()
            ))}
        </div>
    );
};

export default MuscleSort;
