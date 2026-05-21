import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router";
import {FiArrowLeft, FiClock, FiFileText, GiWeight, RiFireLine} from "../../../assets/icons";
import {FaDumbbell} from "react-icons/fa";
import trainerService from "../../../services/trainerService";
import useBodyClass from "../../../hooks/useBodyClass";
import {formatGroupedNumber} from "../../../utils/formatNumber";
import "./ClientWorkoutDetailsPage.scss";

const formatWorkoutDuration = (startValue, endValue) => {
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

const ClientWorkoutDetailsPage = () => {
    const {clientId, workoutId} = useParams();
    const navigate = useNavigate();
    const {state} = useLocation();

    const [clientInfo, setClientInfo] = useState({
        clientName: state?.clientName || "Client",
        clientEmail: state?.clientEmail || ""
    });
    const [workout, setWorkout] = useState(null);
    const [error, setError] = useState("");

    useBodyClass("workout-page-body");

    useEffect(() => {
        let active = true;

        const loadWorkout = async () => {
            setError("");

            try {
                const response = await trainerService.getClientWorkoutDetails(clientId, workoutId);
                if (!active) return;

                const workoutData = response?.data?.data?.workout ?? null;
                const clientData = response?.data?.data?.client ?? null;

                setWorkout(workoutData);
                if (clientData) {
                    setClientInfo({
                        clientName: clientData.clientName || state?.clientName || "Client",
                        clientEmail: clientData.clientEmail || state?.clientEmail || ""
                    });
                }
            } catch (loadError) {
                if (!active) return;
                setWorkout(null);
                setError(loadError?.response?.data?.message || "Failed to load client workout details.");
            }
        };

        loadWorkout();

        return () => {
            active = false;
        };
    }, [clientId, workoutId, state?.clientEmail, state?.clientName]);

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

            {error ? <p className="trainer-client-workout-error">{error}</p> : null}

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
