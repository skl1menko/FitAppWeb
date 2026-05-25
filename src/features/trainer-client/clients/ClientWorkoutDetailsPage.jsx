import {useLocation, useNavigate, useParams} from "react-router";
import {FiArrowLeft, FiClock, FiFileText, GiWeight, RiFireLine} from "../../../assets/icons";
import {FaDumbbell} from "react-icons/fa";
import useBodyClass from "../../../hooks/useBodyClass";
import {formatGroupedNumber} from "../../../utils/formatNumber";
import { normalizeTrainerClientInfo } from "../utils/normalizeTrainerClient";
import { formatWorkoutDuration } from "../utils/clientTrackingUtils";
import useClientWorkoutDetails from "../hooks/useClientWorkoutDetails";
import "./ClientWorkoutDetailsPage.scss";
import { useTranslation } from "react-i18next";
import { translateExerciseName } from "../../exercises/utils/translateExerciseName";
import { translateMuscleGroup } from "../../exercises/utils/translateMuscleGroup";

const ClientWorkoutDetailsPage = () => {
    const {clientId, workoutId} = useParams();
    const navigate = useNavigate();
    const {state} = useLocation();
    const { t } = useTranslation();
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
                    {t("trainer_clients.workoutDetails.backToClient")}
                </button>
            </div>

            {workoutError ? <p className="trainer-client-workout-error">{workoutError}</p> : null}

            {workout ? (
                <>
                    <div className="workout-header">
                        <div className="workout-title-row">
                            <div>
                                <h1>{workout.workoutName || t("trainer_clients.workoutDetails.workoutFallback")}</h1>
                                <p className="trainer-client-workout-owner">
                                    {clientInfo.clientName}
                                    {clientInfo.clientEmail ? ` · ${clientInfo.clientEmail}` : ""}
                                </p>
                            </div>
                            <span className="workout-badge">{t("trainer_clients.workoutDetails.sessionDetails")}</span>
                        </div>

                        <div className="workout-header-cont">
                            <div className="workout-header-cont stats">
                                <div className="wk-hd-cont-stats two">
                                    <span className="label">
                                        <GiWeight aria-hidden="true" /> {t("trainer_clients.workoutDetails.totalTonnage")}
                                    </span>
                                    <span>{formatGroupedNumber(workout.totalTonnage || 0)} kg</span>
                                </div>
                                <div className="wk-hd-cont-stats two">
                                    <span className="label">
                                        <RiFireLine aria-hidden="true" /> {t("trainer_clients.workoutDetails.calories")}
                                    </span>
                                    <span>{workout.caloriesBurned || 0} kcal</span>
                                </div>
                                <div className="wk-hd-cont-stats two">
                                    <span className="label">
                                        <FiClock aria-hidden="true" /> {t("trainer_clients.workoutDetails.duration")}
                                    </span>
                                    <span>{formatWorkoutDuration(workout.startTime, workout.endTime, t)}</span>
                                </div>
                            </div>
                        </div>

                        {workout.notes ? (
                            <p className="workout-notes">
                                <FiFileText aria-hidden="true" /> {t("trainer_clients.workoutDetails.notes")}: {workout.notes}
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
                                    fallback: t("trainer_clients.workoutDetails.general"),
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
                                    {t("trainer_clients.workoutDetails.exerciseTonnage")}: {formatGroupedNumber(exercise.exerciseTonnage || 0)} kg
                                </p>

                                <div className="sets-table-wrap">
                                    <table className="sets-table">
                                        <thead>
                                            <tr>
                                                <th>{t("trainer_clients.workoutDetails.set")}</th>
                                                <th>{t("trainer_clients.workoutDetails.weightKg")}</th>
                                                <th>{t("trainer_clients.workoutDetails.reps")}</th>
                                                <th>{t("trainer_clients.workoutDetails.rpe")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(exercise.sets || []).map((set, index) => (
                                                <tr key={set.setId}>
                                                    <td data-label={t("trainer_clients.workoutDetails.set")}>{index + 1}</td>
                                                    <td data-label={t("trainer_clients.workoutDetails.weightKg")}>{set.weightKg}</td>
                                                    <td data-label={t("trainer_clients.workoutDetails.reps")}>{set.reps}</td>
                                                    <td data-label={t("trainer_clients.workoutDetails.rpe")}>{set.rpe ?? "-"}</td>
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

export default ClientWorkoutDetailsPage;
