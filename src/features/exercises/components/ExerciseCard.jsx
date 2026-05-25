import "./ExerciseCard.scss";
import { useTranslation } from "react-i18next";
import { getMuscleGroupTranslationKey } from "../constants/muscleGroups";
import { translateExerciseName } from "../utils/translateExerciseName";

const getMuscleGroupClass = (muscleGroup) => {
    const value = (muscleGroup || "general").toLowerCase();

    if (value.includes("chest")) return "badge-chest";
    if (value.includes("lats") || value.includes("upper back")) return "badge-back";
    if (value.includes("shoulder")) return "badge-shoulders";
    if (value.includes("biceps")  || value.includes("triceps") || value.includes("forearm")) return "badge-arms";
    if (value.includes("leg") || value.includes("quad") || value.includes("hamstring") || value.includes("glute") || value.includes("calves")) return "badge-legs";
    if (value.includes("abs") || value.includes("core")) return "badge-core";

    return "badge-general";
};

const ExerciseCard = ({ exercises = [], showDelete = false, onDelete, onSelect }) => {
    const { t } = useTranslation();
    return (
        <div className="exercise-card-cont">
            {exercises.map((exercise) => (
                (() => {
                    const exerciseName = translateExerciseName({
                        exerciseName: exercise?.name,
                        muscleGroup: exercise?.muscleGroup,
                        t,
                        fallback: t('exercises.card.noName'),
                    });
                    const muscleGroupLabel = t(`exercises.muscleGroups.${getMuscleGroupTranslationKey(exercise?.muscleGroup)}`);
                    return (
                <div
                    className="exercise-card-content"
                    key={exercise?.id || exercise?.name}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelect?.(exercise)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onSelect?.(exercise);
                        }
                    }}
                    aria-label={t('exercises.card.openStatsFor', { name: exerciseName })}
                >
                    {showDelete ? (
                        <button
                            type="button"
                            className="exercise-delete-btn"
                            onClick={(event) => {
                                event.stopPropagation();
                            onDelete?.(exercise);
                            }}
                            aria-label={t('exercises.card.deleteExercise', { name: exerciseName })}
                            title={t('exercises.card.deleteCustomTitle')}
                        >
                            x
                        </button>
                    ) : null}
                    <div className="exercise-img-cont">
                        <div className="exercise-muscle-cont">
                            <span className={`exercise-badge ${getMuscleGroupClass(exercise?.muscleGroup)}`}>
                                {muscleGroupLabel}
                            </span>
                        </div>
                        <div className="exercise-img">
                            <img src={exercise.imageUrl} alt="" />
                        </div>
                    </div>
                    <div className="exercise-name-cont">
                        <h1>{exerciseName}</h1>
                    </div>
                </div>
                    );
                })()
            ))}
        </div>
    );
};

export default ExerciseCard;
