import {useLocation, useNavigate, useParams} from "react-router";
import {FiArrowLeft, FiClock, FiFileText, GiWeight, RiFireLine} from "../../../assets/icons";
import {FaDumbbell} from "react-icons/fa";
import useBodyClass from "../../../hooks/useBodyClass";
import {formatGroupedNumber} from "../../../utils/formatNumber";
import { normalizeTrainerClientInfo } from "../utils/normalizeTrainerClient";
import { formatWorkoutDuration } from "../utils/clientTrackingUtils";
import useClientWorkoutDetails from "../hooks/useClientWorkoutDetails";
import "./ClientWorkoutDetailsPage.scss";

const ClientWorkoutDetailsPage = () => {
    const {clientId, workoutId} = useParams();
    const navigate = useNavigate();
    const {state} = useLocation();
    const optimisticClientInfo = normalizeTrainerClientInfo(state);
    const {
        clientInfo,
        workout,
        workoutError
    } = useClientWorkoutDetails({
        clientId,
        workoutId,
        optimisticClientInfo
    });

    useBodyClass("workout-page-body");

    return (
        <div className="workout-details-page">
            <div className="back-workout-cont">
                <button
                    type="button"
                    className="back-btn"
                    onClick={() => navigate(`/clients/${clientId}/tracking`, {state: clientInfo})}
                >
                    <FiArrowLeft />
                    Back to client
                </button>
            </div>

            {workoutError ? <p className="trainer-client-workout-error">{workoutError}</p> : null}

            {workout ? (
                <>
                    <div className="workout-header">
                        <div className="workout-title-row">
                            <div>
                                <h1>{workout.workoutName || "Workout"}</h1>
                                <p className="trainer-client-workout-owner">
                                    {clientInfo.clientName}
                                    {clientInfo.clientEmail ? ` · ${clientInfo.clientEmail}` : ""}
                                </p>
                            </div>
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
                                    <span>{formatWorkoutDuration(workout.startTime, workout.endTime)}</span>
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
                                <div className="exercise-head-cont">
                                    <div className="exercise-img-cont">
                                        <img src={exercise.imageUrl} alt={exercise.exerciseName} />
                                    </div>
                                    <div className="exercise-head">
                                        <h1>{exercise.exerciseName}</h1>
                                        <span className="muscle-group-tag">
                                            <FaDumbbell aria-hidden="true" />
                                            {exercise.muscleGroup || "General"}
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
                        ))}
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default ClientWorkoutDetailsPage;
