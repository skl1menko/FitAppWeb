import { useNavigate } from "react-router";
import {
    PiBarbellLight,
    CiCircleCheck,
    FiCalendar,
    FaRegClock,
    GiWeight,
    RiFireLine,
    MdOutlineEditCalendar
} from "../../../assets/icons";
import { formatGroupedNumber } from "../../../utils/formatNumber";
import { setActiveWorkoutId } from "../utils/activeWorkoutStorage";
import { formatScheduledTime, formatWorkoutDate, formatWorkoutDuration } from "../utils/workoutFormatters";
import { isWorkoutActive, isWorkoutScheduled } from "../utils/workoutStatus";
import "./WorkoutListItem.scss";

const WorkoutListItem = ({ workout, variant = "recent", onDeleteWorkout }) => {
    const navigate = useNavigate();
    const isActive = isWorkoutActive(workout);
    const isScheduled = isWorkoutScheduled(workout);

    const handleWorkoutClick = () => {
        if (isActive) {
            setActiveWorkoutId(workout.workoutId);
            navigate("/workout/session");
            return;
        }

        if (isScheduled) {
            navigate(`/workout/session?workoutId=${workout.workoutId}&mode=planned`);
            return;
        }

        navigate(`/workout/${workout.workoutId}`);
    };

    const handleDeleteClick = (event) => {
        onDeleteWorkout?.(event, workout.workoutId);
    };

    return (
        <div
            className={`workout-cont ${isActive ? "active-workout" : ""} ${isScheduled ? "scheduled-workout" : ""}`}
            onClick={handleWorkoutClick}
        >
            {variant === "recent" && !isActive ? (
                <button
                    type="button"
                    className="workout-delete-btn"
                    aria-label="Delete workout"
                    onClick={handleDeleteClick}
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
                        {isScheduled ? (
                            <MdOutlineEditCalendar size={18} color="#1696e5" className="scheduled-icon" />
                        ) : !isActive ? (
                            <CiCircleCheck size={18} color="#10B981" className="completed-icon" />
                        ) : null}
                    </div>
                    <div className="workout-stat-cont">
                        <span className="workout-stat">
                            {!isScheduled ? (
                                <>
                                    <FiCalendar size={14} className="calendar-icon" />
                                    {formatWorkoutDate(workout.startTime)}
                                </>
                            ) : (
                                <>
                                    <FiCalendar size={14} className="calendar-icon" />
                                    {formatScheduledTime(workout.startTime)}
                                </>
                            )}
                        </span>
                        <span className="workout-stat">
                            {!isScheduled ? (
                                <>
                                    <FaRegClock size={14} className="clock-icon" />
                                    {formatWorkoutDuration(workout.startTime, workout.endTime, "0 min")}
                                </>
                            ) : null}
                        </span>
                    </div>
                </div>
            </div>
            <div className="workout-right-cont">
                {!isScheduled ? (
                    <>
                        <span className="workout-stat">
                            <GiWeight size={18} className="weight-icon" />
                            {formatGroupedNumber(workout.totalTonnage || 0)} kg
                        </span>
                        <span className="workout-stat">
                            <RiFireLine size={18} className="calories-icon" color="#FF8904" />
                            {workout.caloriesBurned || 0} kcal
                        </span>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default WorkoutListItem;
