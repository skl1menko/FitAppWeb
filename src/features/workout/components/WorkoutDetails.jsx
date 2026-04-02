import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
    RiFireLine,
    FiArrowLeft,
    FiCalendar,
    FiClock,
    FiFileText, GiWeight
} from "../../../assets/icons";
import { FaDumbbell } from "react-icons/fa";
import workoutService from "../../../services/WorkoutServices/workoutService";
import "./WorkoutDetails.scss";


const fmtDuration = (startValue, endValue) => {
    if (!startValue || !endValue) return "-";

    const start = new Date(startValue).getTime();
    const end = new Date(endValue).getTime();

    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return "-";

    const totalMinutes = Math.floor((end - start) / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} h`;
    return `${hours} h ${minutes} min`;
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

    useEffect(() => {
        document.body.classList.add('workout-page-body');
        return () => document.body.classList.remove('workout-page-body');
    }, [])

    return (
        <div className="workout-details-page">
            <button className="back-btn" onClick={() => navigate("/workouts")}>
                <FiArrowLeft size={20} aria-hidden="true" />
                Back to workouts
            </button>

            {workout ? (
                <>
                    <div className="workout-header">
                        <div className="workout-title-row">
                            <h1>{workout.workoutName || "Workout"}</h1>
                            <span className="workout-badge">Session Details</span>
                        </div>

                        <div className="workout-header-cont">

                            <div className="workout-header-cont stats">
                                <div className="wk-hd-cont-stats two">
                                    <span className="label">
                                        <GiWeight aria-hidden="true" /> Total tonnage
                                    </span>
                                    <span>{workout.totalTonnage || 0} kg</span>
                                </div>
                                <div className="wk-hd-cont-stats two">
                                    <span className="label">
                                        <RiFireLine aria-hidden="true" /> Calories
                                    </span>
                                    <span>{workout.caloriesBurned || 0} kcal</span>
                                </div>
                                <div className="wk-hd-cont-stats">
                                    <span className="label">
                                        <FiClock aria-hidden="true" /> Duration
                                    </span>
                                    <span>
                                        {fmtDuration(workout.startTime, workout.endTime)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {workout.notes ? (
                            <p className="workout-notes">
                                <FiFileText aria-hidden="true" /> Notes: {workout.notes}
                            </p>
                        ) : null}
                    </div>

                    <div className="exercises-list">
                        {(workout.exercisesWithSets || []).map((exercise) => (
                            <div key={exercise.id} className="exercise-card">
                                <div className="exercise-head">
                                    <h1>{exercise.exerciseName}</h1>
                                    <span className="muscle-group-tag">
                                        <FaDumbbell aria-hidden="true" />
                                        {exercise.muscleGroup || "General"}
                                    </span>
                                </div>

                                <p className="exercise-tonnage">
                                    Exercise tonnage: {exercise.exerciseTonnage || 0} kg
                                </p>

                                <div className="sets-table-wrap">
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
                                                    <td data-label="Set">{index + 1}</td>
                                                    <td data-label="Weight (kg)">{set.weightKg}</td>
                                                    <td data-label="Reps">{set.reps}</td>
                                                    <td data-label="RPE">{set.rpe ?? "-"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default WorkoutDetails;