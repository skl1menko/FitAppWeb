import { useEffect, useMemo, useState } from "react";
import MuscleGroupSelect from "../../../../components/MuscleGroupSelect";
import exercisesService from "../../../../services/exercisesService";
import "./AddExerciseModal.scss";
import { useTranslation } from "react-i18next";
import { translateExerciseName } from "../../../exercises/utils/translateExerciseName";
import { translateMuscleGroup } from "../../../exercises/utils/translateMuscleGroup";

const AddExerciseModal = ({ isOpen, onClose, onConfirm, muscleGroups = [] }) => {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("all");
    const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [selectedExerciseIds, setSelectedExerciseIds] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        let isMounted = true;
        setIsLoading(true);
        setLoadError("");

        exercisesService
            .getAll()
            .then((response) => {
                if (!isMounted) {
                    return;
                }

                setExercises(response?.data?.data || []);
            })
            .catch(() => {
                if (!isMounted) {
                    return;
                }

                setLoadError(t('workout_session.addExerciseModal.errors.loadExercises'));
                setExercises([]);
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [isOpen, t]);

    const filteredExercises = useMemo(() => {
        const normalizedSearch = searchValue.trim().toLowerCase();

        return exercises.filter((exercise) => {
            const originalExerciseName = String(exercise?.exerciseName || exercise?.name || "");
            const translatedExerciseName = translateExerciseName({
                exerciseName: originalExerciseName,
                muscleGroup: exercise?.muscleGroup || exercise?.muscle_group,
                t,
                fallback: "",
            });
            const exerciseName = originalExerciseName.toLowerCase();
            const localizedExerciseName = translatedExerciseName.toLowerCase();
            const exerciseGroup = (exercise?.muscleGroup || exercise?.muscle_group || "").toLowerCase();

            const groupMatches = selectedGroup === "all" || exerciseGroup.includes(selectedGroup.toLowerCase());
            const searchMatches = !normalizedSearch
                || exerciseName.includes(normalizedSearch)
                || localizedExerciseName.includes(normalizedSearch);

            return groupMatches && searchMatches;
        });
    }, [exercises, searchValue, selectedGroup, t]);

    const handleClose = () => {
        setSearchValue("");
        setSelectedGroup("all");
        setLoadError("");
        setSelectedExerciseIds([]);
        setIsSubmitting(false);
        onClose?.();
    };

    const toggleExerciseSelection = (exerciseId) => {
        if (!exerciseId || isSubmitting) {
            return;
        }

        setSelectedExerciseIds((prev) => {
            if (prev.includes(exerciseId)) {
                return prev.filter((id) => id !== exerciseId);
            }

            return [...prev, exerciseId];
        });
    };

    const handleAddSelected = async () => {
        if (isSubmitting || selectedExerciseIds.length === 0) {
            return;
        }

        const selectedExercises = selectedExerciseIds
            .map((selectedId) => {
                return exercises.find((exercise) => {
                    const exerciseId = exercise?.exerciseId || exercise?.id;
                    return exerciseId === selectedId;
                });
            })
            .filter(Boolean);

        if (selectedExercises.length === 0) {
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await onConfirm?.(selectedExercises);
            if (result === false) {
                return;
            }

            handleClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="add-exercise-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-exercise-title"
        >
            <div className="add-exercise-backdrop" onClick={handleClose} />

            <div className="add-exercise-card">
                <div className="add-exercise-head">
                    <h2 id="add-exercise-title">{t('workout_session.addExerciseModal.title')}</h2>
                    <button type="button" className="close-btn" onClick={handleClose} aria-label={t('workout_session.addExerciseModal.closeAria')}>
                        x
                    </button>
                </div>

                <div className="find-exercise-cont">
                    <input
                        type="text"
                        placeholder={t('workout_session.addExerciseModal.searchPlaceholder')}
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                    <MuscleGroupSelect
                        groups={muscleGroups}
                        value={selectedGroup}
                        onChange={setSelectedGroup}
                        includeAll
                        className="muscle-filter"
                        allLabel={t('workout_session.addExerciseModal.allMuscleGroups')}
                    />
                </div>


                {loadError ? <p className="add-exercise-error">{loadError}</p> : null}

                <div className="exercise-options-list">
                    {isLoading ? <p className="hint-text">{t('workout_session.addExerciseModal.loading')}</p> : null}

                    {!isLoading && filteredExercises.length === 0 ? (
                        <p className="hint-text">{t('workout_session.addExerciseModal.empty')}</p>
                    ) : null}

                    {!isLoading && filteredExercises.map((exercise) => {
                        const exerciseId = exercise?.exerciseId || exercise?.id;
                        const exerciseImage = exercise?.imageUrl || exercise?.image_url || "";
                        const isSelected = selectedExerciseIds.includes(exerciseId);
                        const exerciseName = translateExerciseName({
                            exerciseName: exercise?.exerciseName || exercise?.name,
                            muscleGroup: exercise?.muscleGroup || exercise?.muscle_group,
                            t,
                            fallback: t('workout_session.exerciseCard.unnamedExercise'),
                        });
                        const muscleGroupLabel = translateMuscleGroup({
                            muscleGroup: exercise?.muscleGroup || exercise?.muscle_group,
                            t,
                            fallback: t('workout_session.addExerciseModal.noGroup'),
                        });

                        return (
                            <button
                                type="button"
                                className={`exercise-option-item ${isSelected ? "selected" : ""}`}
                                key={exerciseId}
                                onClick={() => toggleExerciseSelection(exerciseId)}
                                disabled={isSubmitting}
                            >
                                <div className="exercise-main">
                                    <div className="exercise-icon" aria-hidden="true">
                                        {exerciseImage ? (
                                            <img src={exerciseImage} alt="" />
                                        ) : (
                                            <span className="exercise-icon-fallback">{t('workout_session.addExerciseModal.imageFallback')}</span>
                                        )}
                                    </div>
                                    <div className="exercise-info">
                                        <p className="exercise-name">{exerciseName}</p>
                                        <p className="exercise-group">{muscleGroupLabel}</p>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    className="exercise-select-checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleExerciseSelection(exerciseId)}
                                    onClick={(event) => event.stopPropagation()}
                                    disabled={isSubmitting}
                                />
                            </button>
                        );
                    })}
                </div>

                <div className="add-exercise-actions">
                    <button type="button" className="cancel-btn" onClick={handleClose} disabled={isSubmitting}>
                        {t('workout_session.common.cancel')}
                    </button>
                    <button type="button" className="submit-btn" onClick={handleAddSelected} disabled={isSubmitting || selectedExerciseIds.length === 0}>
                        {isSubmitting
                            ? t('workout_session.addExerciseModal.adding')
                            : t('workout_session.addExerciseModal.addSelected', { count: selectedExerciseIds.length })}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddExerciseModal;
