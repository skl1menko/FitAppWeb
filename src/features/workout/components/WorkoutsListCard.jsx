import { useMemo } from "react";
import "./WorkoutsListCard.scss";
import { isWorkoutActive, isWorkoutScheduled } from "../utils/workoutStatus";
import WorkoutListItem from "./WorkoutListItem.jsx";

const WorkoutsListCard = ({
    workouts = [],
    variant = "recent",
    isLoading = false,
    errorMessage = "",
    onDeleteWorkout,
    t
}) => {
    const filteredWorkouts = useMemo(() => {
        const active = [];
        const scheduled = [];
        const completed = [];

        workouts.forEach((workout) => {
            if (isWorkoutActive(workout)) {
                active.push(workout);
                return;
            }

            if (isWorkoutScheduled(workout)) {
                scheduled.push(workout);
                return;
            }

            completed.push(workout);
        });

        if (variant === "planned") {
            return scheduled.filter((workout) => !workout.programId);
        }

        return [...active, ...completed];
    }, [variant, workouts]);

    return (
        <>
            {isLoading ? (
                <div className="workouts-empty-state">Loading workouts...</div>
            ) : null}
            {!isLoading && errorMessage ? (
                <div className="workouts-empty-state">{errorMessage}</div>
            ) : null}
            {!isLoading && !errorMessage && filteredWorkouts.length === 0 ? (
                <div className="workouts-empty-state">
                    {variant === "planned"
                        ? t('workout.plannedWorkout.noWorkouts')
                        : t('workout.recentWorkout.noWorkouts') }
                </div>
            ) : null}
            {filteredWorkouts.map((workout) => (
                <WorkoutListItem
                    key={workout.workoutId}
                    workout={workout}
                    variant={variant}
                    onDeleteWorkout={onDeleteWorkout}
                />
            ))}
        </>
    );
};

export default WorkoutsListCard;
