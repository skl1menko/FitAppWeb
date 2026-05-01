import workoutService from "../../../services/WorkoutServices/workoutService"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { PiBarbellLight, CiCircleCheck, FiCalendar, FaRegClock, GiWeight, RiFireLine, MdOutlineEditCalendar } from "../../../assets/icons"
import "./WorkoutsListCard.scss"
import { isWorkoutActive, isWorkoutScheduled } from "../utils/workoutStatus";
import { formatGroupedNumber } from "../../../utils/formatNumber";

const getDuration = (start, end) => {
    if (!start || !end) return null;
    const time = Math.round((new Date(end) - new Date(start)) / 60000);
    if (time <= 0) return null;


    const hours = Math.floor(time / 60);
    const minutes = time % 60;

    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} h`;
    return `${hours} h ${minutes} min`;
};

const formatScheduledTime = (dateValue) => {
    if (!dateValue) return "Starts when launched";

    return new Date(dateValue).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const WorkoutsListCard = ({ refreshKey = 0, variant = "recent", onWorkoutDeleted }) => {

    const [workouts, setWorkouts] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        workoutService.getAll().then((response) => {
            setWorkouts(response.data.data);
        }).catch((error) => {
            console.log(error);
        })
    }, [refreshKey])

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

    const handleDeleteWorkout = async (event, workoutId) => {
        event.stopPropagation();

        if (!workoutId) {
            return;
        }

      

        try {
            await workoutService.delete(workoutId);
            setWorkouts((prev) => prev.filter((workout) => workout.workoutId !== workoutId));
            onWorkoutDeleted?.(workoutId);
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to delete workout";
            alert(message);
        }
    };

    return (
        <>
            {filteredWorkouts.length === 0 ? (
                <div className="workouts-empty-state">
                    {variant === "planned"
                        ? "No planned workouts yet."
                        : "No recent workouts yet."}
                </div>
            ) : null}
            {filteredWorkouts.map((workout) => {
                const isActiveWorkout = isWorkoutActive(workout);
                const isScheduledWorkout = isWorkoutScheduled(workout);

                const handleStartScheduledWorkout = async () => {
                    const currentActiveWorkout = workouts.find((item) => isWorkoutActive(item));
                    if (currentActiveWorkout?.workoutId && currentActiveWorkout.workoutId !== workout.workoutId) {
                        localStorage.setItem("activeWorkoutId", String(currentActiveWorkout.workoutId));
                        alert("You already have an active workout session. Please finish or cancel it before starting another one.");
                        navigate("/workout/session");
                        return;
                    }

                    const shouldStart = window.confirm("Start this scheduled workout now?");
                    if (!shouldStart) {
                        return;
                    }

                    try {
                        await workoutService.update(workout.workoutId, {
                            start_time: new Date().toISOString(),
                            is_started: true
                        });

                        localStorage.setItem("activeWorkoutId", String(workout.workoutId));
                        navigate("/workout/session");
                    } catch (error) {
                        const message = error?.response?.data?.message || "Failed to start scheduled workout";
                        console.error("Start scheduled workout failed:", error?.response?.data || error);
                        alert(message);
                    }
                };

                const onWorkoutClick = () => {
                    if (isActiveWorkout) {
                        localStorage.setItem("activeWorkoutId", String(workout.workoutId));
                        navigate("/workout/session");
                        return;
                    }

                    if (isScheduledWorkout) {
                        navigate(`/workout/session?workoutId=${workout.workoutId}&mode=planned`);
                        return;
                    }

                    navigate(`/workout/${workout.workoutId}`);
                };

                return (
                <div
                    key={workout.workoutId}
                    className={`workout-cont ${isActiveWorkout ? "active-workout" : ""} ${isScheduledWorkout ? "scheduled-workout" : ""}`}
                    onClick={onWorkoutClick}
                >
                    {variant === "recent" && !isActiveWorkout ? (
                        <button
                            type="button"
                            className="workout-delete-btn"
                            aria-label="Delete workout"
                            onClick={(event) => handleDeleteWorkout(event, workout.workoutId)}
                        >
                            X
                        </button>
                    ) : null}
                    <div className="workout-left-cont">
                        <div className="workout-icon-cont">
                            <PiBarbellLight size={24} color="#3B82F6" />
                        </div>
                        <div className="workout-info-cont">
                            <div className="workout-label">
                                <span>{workout.workoutName || "Workout"}</span>
                                {isScheduledWorkout ? (
                                    <MdOutlineEditCalendar size={18} color="#1696e5" className="scheduled-icon" />
                                ) : !isActiveWorkout ? (
                                    <CiCircleCheck size={18} color="#10B981" className="completed-icon" />
                                ) : null}
                               
                            </div>
                            <div className="workout-stat-cont">
                                <span className="workout-stat">
                                    {!isScheduledWorkout ? (
                                        <>
                                                <FiCalendar size={14} className="calendar-icon" />
                                                {new Date(workout.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </>
                                    ) : null}
                                </span>
                                <span className="workout-stat">
                                    {!isScheduledWorkout ? (
                                        <>
                                                <FaRegClock size={14} className="clock-icon" />
                                                { getDuration(workout.startTime, workout.endTime) || '0 min' }
                                        </>
                                    ) : null}
                                </span>
                                <span className="workout-stat">
                                    {workout.exerciseCount} exercises
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="workout-right-cont">
                            {!isScheduledWorkout ? (
                            <>
                                <span className="workout-stat">
                                    <GiWeight size={18} className="weight-icon" />
                                    {formatGroupedNumber(workout.totalTonnage || 0)} kg
                                </span>
                                <span className="workout-stat">
                                    <RiFireLine size={18} className="calories-icon" color="#FF8904"/>
                                    {workout.caloriesBurned || 0} kcal
                                </span>
                            </>
                        ) : null}

                    </div>
                </div>
            )})}
        </>
    )
}

export default WorkoutsListCard;
