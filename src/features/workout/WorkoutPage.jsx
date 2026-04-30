import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { FaPlus, RxLapTimer } from "../../assets/icons";
import "./WorkoutPage.scss";
import WorkoutsListCard from "./components/WorkoutsListCard.jsx";
import CustomBtn from "../../components/CustomBtn.jsx";
import useBodyClass from "../../hooks/useBodyClass";
import workoutService from "../../services/WorkoutServices/workoutService.js";
import { isWorkoutActive } from "./utils/workoutStatus.js";

const ACTIVE_WORKOUT_ID_KEY = "activeWorkoutId";

const WorkoutPage = () => {

    const navigate = useNavigate();
    const [isCreatingScheduledWorkout, setIsCreatingScheduledWorkout] = useState(false);
    const [workoutsRefreshKey, setWorkoutsRefreshKey] = useState(0);
    const [hasActiveWorkout, setHasActiveWorkout] = useState(false);

    useBodyClass("workout-page-body");

    useEffect(() => {
        let isMounted = true;

        const syncActiveWorkoutState = async () => {
            const savedId = Number(localStorage.getItem(ACTIVE_WORKOUT_ID_KEY));
            const hasLocalActiveWorkout = Number.isFinite(savedId) && savedId > 0;

            try {
                const allResponse = await workoutService.getAll();
                const activeWorkout = (allResponse?.data?.data || []).find((workout) => isWorkoutActive(workout));
                const nextHasActiveWorkout = Boolean(activeWorkout?.workoutId);

                if (nextHasActiveWorkout) {
                    localStorage.setItem(ACTIVE_WORKOUT_ID_KEY, String(activeWorkout.workoutId));
                } else if (!hasLocalActiveWorkout) {
                    localStorage.removeItem(ACTIVE_WORKOUT_ID_KEY);
                }

                if (isMounted) {
                    setHasActiveWorkout(hasLocalActiveWorkout || nextHasActiveWorkout);
                }
            } catch {
                if (isMounted) {
                    setHasActiveWorkout(hasLocalActiveWorkout);
                }
            }
        };

        const handleVisibilitySync = () => {
            if (!document.hidden) {
                syncActiveWorkoutState();
            }
        };

        const handleStorageSync = (event) => {
            if (!event.key || event.key === ACTIVE_WORKOUT_ID_KEY || event.key === "workoutSessionStartAt") {
                syncActiveWorkoutState();
            }
        };

        syncActiveWorkoutState();
        window.addEventListener("focus", syncActiveWorkoutState);
        window.addEventListener("storage", handleStorageSync);
        document.addEventListener("visibilitychange", handleVisibilitySync);

        return () => {
            isMounted = false;
            window.removeEventListener("focus", syncActiveWorkoutState);
            window.removeEventListener("storage", handleStorageSync);
            document.removeEventListener("visibilitychange", handleVisibilitySync);
        };
    }, []);

    const handleStartWorkout = async () => {
        try {
            const savedId = Number(localStorage.getItem(ACTIVE_WORKOUT_ID_KEY));
            if (Number.isFinite(savedId) && savedId > 0) {
                try {
                    const existing = await workoutService.getById(savedId);
                    const workout = existing?.data?.data;
                    if (isWorkoutActive(workout)) {
                        alert("You have an active workout session. Please finish or cancel it before starting a new one.");
                        navigate("/workout/session");
                        return;
                    }
                    localStorage.removeItem(ACTIVE_WORKOUT_ID_KEY);
                } catch (error) {
                    localStorage.removeItem(ACTIVE_WORKOUT_ID_KEY);
                }
            }

            const allResponse = await workoutService.getAll();
            const activeWorkout = (allResponse?.data?.data || []).find((workout) => isWorkoutActive(workout));
            if (activeWorkout?.workoutId) {
                localStorage.setItem(ACTIVE_WORKOUT_ID_KEY, String(activeWorkout.workoutId));
                alert("You have an active workout session. Please finish or cancel it before starting a new one.");
                navigate("/workout/session");
                return;
            }

            const response = await workoutService.create();
            const createdWorkoutId = response?.data?.data?.workoutId;
            if (createdWorkoutId) {
                localStorage.setItem(ACTIVE_WORKOUT_ID_KEY, String(createdWorkoutId));
            }
            navigate("/workout/session?new=1");
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to create workout";
            console.error("Create workout failed:", error?.response?.data || error);
            alert(message);
        }
    };

    const handleCreateScheduledWorkout = async () => {
        if (hasActiveWorkout) {
            return false;
        }

        setIsCreatingScheduledWorkout(true);

        try {
            const response = await workoutService.create({
                is_started: false
            });
            const createdWorkoutId = response?.data?.data?.workoutId;
            setWorkoutsRefreshKey((prev) => prev + 1);
            if (createdWorkoutId) {
                navigate(`/workout/session?workoutId=${createdWorkoutId}&mode=planned`);
            }
            return true;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to create scheduled workout";
            console.error("Create scheduled workout failed:", error?.response?.data || error);
            alert(message);
            return false;
        } finally {
            setIsCreatingScheduledWorkout(false);
        }
    };

    const handleWorkoutDeleted = () => {
        setWorkoutsRefreshKey((prev) => prev + 1);
    };

    return (
        <div className="workout-page-cont">
            <div className="workout-page-content">
                <div className="start-workout-cont">
                    <CustomBtn icon={<RxLapTimer />} className="start-workout-btn" text="Start New Workout" onClick={handleStartWorkout} />
                    <CustomBtn
                        icon={<FaPlus />}
                        className="create-workout-btn"
                        text={isCreatingScheduledWorkout ? "Creating..." : "Create New Workout"}
                        onClick={handleCreateScheduledWorkout}
                        disabled={hasActiveWorkout || isCreatingScheduledWorkout}
                    />
                </div>
                <div className="workout-lists-grid">
                    <div className="workout-list-cont">
                        <div className="workouts-card-header">
                            <h2>Recent Workouts</h2>
                        </div>
                        <div className="workout-list">
                            <WorkoutsListCard
                                refreshKey={workoutsRefreshKey}
                                variant="recent"
                                onWorkoutDeleted={handleWorkoutDeleted}
                            />
                        </div>
                    </div>
                    <div className="workout-list-cont">
                        <div className="workouts-card-header">
                            <h2>Planned Workouts</h2>
                        </div>
                        <div className="workout-list">
                            <WorkoutsListCard refreshKey={workoutsRefreshKey} variant="planned" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutPage;
