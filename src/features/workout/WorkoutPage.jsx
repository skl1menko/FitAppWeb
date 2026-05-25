import { useNavigate } from "react-router";
import { FaPlus, RxLapTimer } from "../../assets/icons";
import "./WorkoutPage.scss";
import WorkoutsListCard from "./components/WorkoutsListCard.jsx";
import CustomBtn from "../../components/CustomBtn.jsx";
import useBodyClass from "../../hooks/useBodyClass";
import { startNewWorkoutSession } from "./services/workoutSessionManager.js";
import { showActiveWorkoutExistsAlert, showWorkoutAlert } from "./utils/workoutFeedback.js";
import useWorkoutList from "./hooks/useWorkoutList.js";
import useActiveWorkoutStatus from "./hooks/useActiveWorkoutStatus.js";
import {useTranslation} from "react-i18next";

const WorkoutPage = () => {
    const navigate = useNavigate();
    useBodyClass("workout-page-body");
    const {
        workouts,
        isLoadingWorkouts,
        workoutsError,
        isCreatingScheduledWorkout,
        createScheduledWorkout,
        deleteWorkout
    } = useWorkoutList();
    const { hasActiveWorkout } = useActiveWorkoutStatus();

    const handleStartWorkout = async () => {
        try {
            const result = await startNewWorkoutSession();

            if (result.status === "active_exists") {
                showActiveWorkoutExistsAlert();
                navigate("/workout/session");
                return;
            }

            navigate("/workout/session?new=1");
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to create workout";
            console.error("Create workout failed:", error?.response?.data || error);
            showWorkoutAlert(message);
        }
    };

    const handleCreateScheduledWorkout = async () => {
        const createdWorkoutId = await createScheduledWorkout({ hasActiveWorkout });

        if (createdWorkoutId) {
            navigate(`/workout/session?workoutId=${createdWorkoutId}&mode=planned`);
        }
    };

    const { t } = useTranslation();

    return (
        <div className="workout-page-cont">
            <div className="workout-page-content">
                <div className="start-workout-cont">
                    <CustomBtn icon={<RxLapTimer />} className="start-workout-btn" text={t('workout.button.startNewWorkout')} onClick={handleStartWorkout} />
                    <CustomBtn
                        icon={<FaPlus />}
                        className="create-workout-btn"
                        text={isCreatingScheduledWorkout ? "Creating..." : t('workout.button.createNewWorkout')}
                        onClick={handleCreateScheduledWorkout}
                        disabled={hasActiveWorkout || isCreatingScheduledWorkout}
                    />
                </div>
                <div className="workout-lists-grid">
                    <div className="workout-list-cont">
                        <div className="workouts-card-header">
                            <h2>{t('workout.recentWorkout.header')}</h2>
                        </div>
                        <div className="workout-list">
                            <WorkoutsListCard
                                workouts={workouts}
                                variant="recent"
                                isLoading={isLoadingWorkouts}
                                errorMessage={workoutsError}
                                onDeleteWorkout={deleteWorkout}
                                t = {t}
                            />
                        </div>
                    </div>
                    <div className="workout-list-cont">
                        <div className="workouts-card-header">
                            <h2>{t('workout.plannedWorkout.header')}</h2>
                        </div>
                        <div className="workout-list">
                            <WorkoutsListCard
                                workouts={workouts}
                                variant="planned"
                                isLoading={isLoadingWorkouts}
                                errorMessage={workoutsError}
                                t = {t}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutPage;
