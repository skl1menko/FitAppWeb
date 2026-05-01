import "./ExercisesPage.scss"
import { FaPlus } from "../../assets/icons"
import CustomBtn from "../../components/CustomBtn";
import ExerciseCard from "./components/ExerciseCard.jsx";
import MuscleSort from "./components/MuscleSort.jsx";
import CreateExerciseModal from "./components/CreateExerciseModal.jsx";
import ExerciseStatsModal from "./components/ExerciseStatsModal.jsx";
import useBodyClass from "../../hooks/useBodyClass";
import { useEffect, useMemo, useState } from "react";
import exerciseService from "../../services/exercisesService";
import workoutService from "../../services/WorkoutServices/workoutService";
import { MUSCLE_GROUPS } from "./constants/muscleGroups";

const HISTORY_LIMIT = 60;

const getExerciseId = (exercise) => {
    const value = exercise?.exerciseId ?? exercise?.exercise_id ?? exercise?.id;
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
};

const getWorkoutDate = (workout) => {
    return workout?.startTime || workout?.start_time || workout?.createdAt || workout?.created_at || null;
};

const getSetWeight = (set) => Number(set?.weightKg ?? set?.weight_kg ?? 0) || 0;

const getSetReps = (set) => Number(set?.reps ?? 0) || 0;

const formatChartDate = (dateValue) => {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
};

const ExercisesPage = () => {
    const [exercises, setExercises] = useState([]);
    const [customExercises, setCustomExercises] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("all");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [exerciseStats, setExerciseStats] = useState({ chartData: [] });
    const [isStatsLoading, setIsStatsLoading] = useState(false);
    const [statsError, setStatsError] = useState("");

    
    useBodyClass("exercise-page-body");

    useEffect(() => {
        exerciseService.getAll().then((response) => {
            setExercises(response?.data?.data ?? []);
        }).catch(() => {
            setExercises([]);
        });

    }, []);

    const handleGroupChange = (group) => {
        setSelectedGroup(group);

        if (group === "custom") {
            exerciseService.getMyCustomExercise().then((response) => {
                setCustomExercises(response?.data?.data ?? []);
            }).catch(() => {
                setCustomExercises([]);
            });
        }
    };

    const handleCreatedExercise = (created) => {
        setExercises((prev) => [created, ...prev]);
        setCustomExercises((prev) => [created, ...prev]);
        setSelectedGroup("custom");
        setIsCreateOpen(false);
    };

    const handleDeleteCustomExercise = (exercise) => {
        const exerciseId = exercise?.exerciseId;
        if (!exerciseId) return;

        exerciseService.deleteExercise(exerciseId).then(() => {
            setCustomExercises((prev) => prev.filter((item) => item?.exerciseId !== exerciseId));
            setExercises((prev) => prev.filter((item) => item?.exerciseId !== exerciseId));
        })
    };

    const handleOpenExerciseStats = (exercise) => {
        if (!exercise) {
            return;
        }

        setSelectedExercise(exercise);
    };

    const handleCloseExerciseStats = () => {
        setSelectedExercise(null);
        setExerciseStats({ chartData: [] });
        setStatsError("");
        setIsStatsLoading(false);
    };

    useEffect(() => {
        if (!selectedExercise) {
            return;
        }

        let isMounted = true;

        const loadExerciseStats = async () => {
            setIsStatsLoading(true);
            setStatsError("");

            try {
                const selectedExerciseId = getExerciseId(selectedExercise);
                if (!selectedExerciseId) {
                    throw new Error("Exercise id is missing");
                }

                const workoutsResponse = await workoutService.getAll();
                const workouts = Array.isArray(workoutsResponse?.data?.data) ? workoutsResponse.data.data : [];

                const recentWorkouts = workouts
                    .filter((workout) => getWorkoutDate(workout))
                    .sort((left, right) => new Date(right.startTime || right.start_time || 0) - new Date(left.startTime || left.start_time || 0))
                    .slice(0, HISTORY_LIMIT);

                const workoutDetails = await Promise.allSettled(
                    recentWorkouts.map((workout) => workoutService.getById(workout.workoutId))
                );

                const points = [];
                let maxWeight = 0;
                let maxReps = 0;
                let maxVolume = 0;

                workoutDetails.forEach((result, index) => {
                    if (result.status !== "fulfilled") {
                        return;
                    }

                    const workout = recentWorkouts[index];
                    const detail = result.value?.data?.data;
                    const exerciseEntry = Array.isArray(detail?.exercisesWithSets)
                        ? detail.exercisesWithSets.find((item) => getExerciseId(item) === selectedExerciseId)
                        : null;

                    if (!exerciseEntry) {
                        return;
                    }

                    const sets = Array.isArray(exerciseEntry.sets) ? exerciseEntry.sets : [];
                    const workoutWeight = sets.reduce((peak, set) => Math.max(peak, getSetWeight(set)), 0);
                    const workoutReps = sets.reduce((peak, set) => Math.max(peak, getSetReps(set)), 0);
                    const workoutVolume = Number(exerciseEntry.exerciseTonnage ?? 0) || sets.reduce((sum, set) => sum + (getSetWeight(set) * getSetReps(set)), 0);
                    const workoutDate = getWorkoutDate(workout);

                    points.push({
                        workoutId: workout.workoutId,
                        workoutName: workout.workoutName || workout.name || "Workout",
                        dateValue: workoutDate,
                        label: formatChartDate(workoutDate),
                        weightKg: workoutWeight,
                        reps: workoutReps,
                        volumeKg: workoutVolume
                    });

                    maxWeight = Math.max(maxWeight, workoutWeight);
                    maxReps = Math.max(maxReps, workoutReps);
                    maxVolume = Math.max(maxVolume, workoutVolume);
                });

                points.sort((left, right) => new Date(left.dateValue) - new Date(right.dateValue));

                if (!isMounted) {
                    return;
                }

                setExerciseStats({
                    chartData: points,
                    trackedWorkouts: points.length,
                    maxWeight,
                    maxReps,
                    maxVolume
                });
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setStatsError(error?.message || "Failed to load exercise stats");
                setExerciseStats({ chartData: [] });
            } finally {
                if (isMounted) {
                    setIsStatsLoading(false);
                }
            }
        };

        loadExerciseStats();

        return () => {
            isMounted = false;
        };
    }, [selectedExercise]);

    const filteredExercises = useMemo(() => {
        if (selectedGroup === "all") return exercises;
        if (selectedGroup === "custom") return customExercises;

        return exercises.filter((exercise) => {
            const group = (exercise?.muscleGroup || "").toLowerCase();
            return group.includes(selectedGroup);
        });
    }, [customExercises, exercises, selectedGroup]);

    return(
        <div className="exercise-page-cont">
            <div className="exercise-page-content">
                <div className="create-exercise-cont">
                    <CustomBtn
                        icon={<FaPlus />}
                        text="Create New Exercise"
                        onClick={() => {
                            setIsCreateOpen(true);
                        }}
                    />
                </div>
                <MuscleSort
                    groups={MUSCLE_GROUPS}
                    selectedGroup={selectedGroup}
                    onChange={handleGroupChange}
                />
                <div className="exercise-list-cont">
                    <ExerciseCard
                        exercises={filteredExercises}
                        showDelete={selectedGroup === "custom"}
                        onDelete={handleDeleteCustomExercise}
                        onSelect={handleOpenExerciseStats}
                    />
                </div>
            </div>
            <CreateExerciseModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreated={handleCreatedExercise}
                muscleGroups={MUSCLE_GROUPS}
            />
            <ExerciseStatsModal
                isOpen={Boolean(selectedExercise)}
                exercise={selectedExercise}
                stats={exerciseStats}
                isLoading={isStatsLoading}
                error={statsError}
                onClose={handleCloseExerciseStats}
            />
        </div>
    )
}

export default ExercisesPage;