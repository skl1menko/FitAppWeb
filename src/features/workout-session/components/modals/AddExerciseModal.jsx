import { useEffect, useMemo, useState } from "react";
import MuscleGroupSelect from "../../../../components/MuscleGroupSelect";
import exercisesService from "../../../../services/exercisesService";
import "./AddExerciseModal.scss";

const AddExerciseModal = ({ isOpen, onClose, onConfirm, muscleGroups = [] }) => {
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

                setLoadError("Could not load exercises");
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
    }, [isOpen]);

    const filteredExercises = useMemo(() => {
        const normalizedSearch = searchValue.trim().toLowerCase();

        return exercises.filter((exercise) => {
            const exerciseName = (exercise?.exerciseName || exercise?.name || "").toLowerCase();
            const exerciseGroup = (exercise?.muscleGroup || exercise?.muscle_group || "").toLowerCase();

            const groupMatches = selectedGroup === "all" || exerciseGroup.includes(selectedGroup.toLowerCase());
            const searchMatches = !normalizedSearch || exerciseName.includes(normalizedSearch);

            return groupMatches && searchMatches;
        });
    }, [exercises, searchValue, selectedGroup]);

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
                    <h2 id="add-exercise-title">Add exercise</h2>
                    <button type="button" className="close-btn" onClick={handleClose} aria-label="Close add exercise modal">
                        x
                    </button>
                </div>

                <div className="find-exercise-cont">
                    <input
                        type="text"
                        placeholder="Find exercise"
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                    <MuscleGroupSelect
                        groups={muscleGroups}
                        value={selectedGroup}
                        onChange={setSelectedGroup}
                        includeAll
                        className="muscle-filter"
                        allLabel="All muscle groups"
                    />
                </div>


                {loadError ? <p className="add-exercise-error">{loadError}</p> : null}

                <div className="exercise-options-list">
                    {isLoading ? <p className="hint-text">Loading exercises...</p> : null}

                    {!isLoading && filteredExercises.length === 0 ? (
                        <p className="hint-text">No exercises found for selected filters</p>
                    ) : null}

                    {!isLoading && filteredExercises.map((exercise) => {
                        const exerciseId = exercise?.exerciseId || exercise?.id;
                        const exerciseImage = exercise?.imageUrl || exercise?.image_url || "";
                        const isSelected = selectedExerciseIds.includes(exerciseId);

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
                                            <span className="exercise-icon-fallback">IMG</span>
                                        )}
                                    </div>
                                    <div className="exercise-info">
                                        <p className="exercise-name">{exercise?.exerciseName || exercise?.name || "Unnamed exercise"}</p>
                                        <p className="exercise-group">{exercise?.muscleGroup || "No group"}</p>
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
                        Cancel
                    </button>
                    <button type="button" className="submit-btn" onClick={handleAddSelected} disabled={isSubmitting || selectedExerciseIds.length === 0}>
                        {isSubmitting ? "Adding..." : `Add selected (${selectedExerciseIds.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddExerciseModal;