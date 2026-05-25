import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
    RiFireLine,
    FiArrowLeft,
    FiClock,
    FiFileText, GiWeight
} from "../../../assets/icons";
import { FaDumbbell } from "react-icons/fa";
import workoutService from "../../../services/WorkoutServices/workoutService";
import "./WorkoutDetails.scss";
import CustomBtn from "../../../components/CustomBtn";
import useBodyClass from "../../../hooks/useBodyClass";
import { formatGroupedNumber } from "../../../utils/formatNumber";
import { formatWorkoutDuration } from "../utils/workoutFormatters";
import { normalizeWorkout } from "../utils/normalizeWorkout";
import { useTranslation } from "react-i18next";
import { translateExerciseName } from "../../exercises/utils/translateExerciseName";
import { translateMuscleGroup } from "../../exercises/utils/translateMuscleGroup";

const WorkoutDetails = () => {
    const { workoutId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [workout, setWorkout] = useState(null);

    useBodyClass("workout-page-body");

    useEffect(() => {
        let active = true;

        const loadWorkout = async () => {
            try {
                const response = await workoutService.getById(workoutId);
                if (!active) return;
                setWorkout(normalizeWorkout(response?.data?.data));
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
            <div className="back-workout-cont">

                <CustomBtn icon={<FiArrowLeft />} text="Back to workouts" onClick={() => navigate("/workouts")} />
            </div>

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
                                    <span>{formatGroupedNumber(workout.totalTonnage || 0)} kg</span>
                                </div>
                                <div className="wk-hd-cont-stats two">
                                    <span className="label">
                                        <RiFireLine aria-hidden="true" /> Calories
                                    </span>
                                    <span>{workout.caloriesBurned || 0} kcal</span>
                                </div>
                                <div className="wk-hd-cont-stats two">
                                    <span className="label">
                                        <FiClock aria-hidden="true" /> Duration
                                    </span>
                                    <span>
                                        {formatWorkoutDuration(workout.startTime, workout.endTime, "-")}
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
                            (() => {
                                const exerciseName = translateExerciseName({
                                    exerciseName: exercise?.exerciseName,
                                    muscleGroup: exercise?.muscleGroup,
                                    t,
                                    fallback: t('exercises.statsModal.exerciseFallback'),
                                });
                                const muscleGroupLabel = translateMuscleGroup({
                                    muscleGroup: exercise?.muscleGroup,
                                    t,
                                    fallback: "General",
                                });

                                return (
                            <div key={exercise.id} className="exercise-card">
                                <div className="exercise-head-cont">
                                    <div className="exercise-img-cont">
                                        <img src={exercise.imageUrl} alt={exerciseName} />
                                    </div>
                                    <div className="exercise-head">
                                        <h1>{exerciseName}</h1>
                                        <span className="muscle-group-tag">
                                            <FaDumbbell aria-hidden="true" />
                                            {muscleGroupLabel}
                                        </span>
                                    </div>

                                </div>

                                <p className="exercise-tonnage">
                                    Exercise tonnage: {formatGroupedNumber(exercise.exerciseTonnage || 0)} kg
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
                                );
                            })()
                        ))}
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default WorkoutDetails;
