import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import workoutService from "../../../services/WorkoutServices/workoutService";
import "./WorkoutDetails.scss";

const fmtDateTime = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const WorkoutDetails = () => {
    const { workoutId } = useParams();
    const navigate = useNavigate();

    const [workout, setWorkout] = useState(null);

    useEffect(() => {
        let active = true;

        const loadWorkout = async () => {
            try {
                const response = await workoutService.getById(workoutId);
                if (!active) return;
                setWorkout(response?.data?.data ?? null);
            } catch {
                if (!active) return;
                setWorkout(null);
            }
        };

        loadWorkout();

        return () => {
            active = false;
        };
    }, [workoutId]);

    return (
        <div className="workout-details-page">
            <button className="back-btn" onClick={() => navigate("/workouts")}>
                Back to workouts
            </button>

            {workout ? (
                <>
                    <div className="workout-header">
                        <h1>{workout.workoutName || "Workout"}</h1>
                        <p>Start: {fmtDateTime(workout.startTime)}</p>
                        <p>End: {fmtDateTime(workout.endTime)}</p>
                        <p>Total tonnage: {workout.totalTonnage || 0} kg</p>
                        <p>Calories: {workout.caloriesBurned || 0} kcal</p>
                        {workout.notes ? <p>Notes: {workout.notes}</p> : null}
                    </div>

                    <div className="exercises-list">
                        {(workout.exercisesWithSets || []).map((exercise) => (
                            <div key={exercise.id} className="exercise-card">
                                <h3>{exercise.exerciseName}</h3>
                                <p>Muscle group: {exercise.muscleGroup}</p>
                                <p>Exercise tonnage: {exercise.exerciseTonnage || 0} kg</p>

                                <table className="sets-table">
                                    <thead>
                                        <tr>
                                            <th>Set</th>
                                            <th>Weight (kg)</th>
                                            <th>Reps</th>
                                            <th>RPE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(exercise.sets || []).map((set, index) => (
                                            <tr key={set.setId}>
                                                <td>{index + 1}</td>
                                                <td>{set.weightKg}</td>
                                                <td>{set.reps}</td>
                                                <td>{set.rpe ?? "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default WorkoutDetails;