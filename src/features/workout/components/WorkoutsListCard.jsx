import workoutService from "../../../services/WorkoutServices/workoutService"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { PiBarbellLight, CiCircleCheck, FiCalendar, FaRegClock, GiWeight, RiFireLine } from "../../../assets/icons"
import "./WorkoutsListCard.scss"

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


const WorkoutsListCard = () => {

    const [workouts, setWorkouts] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        workoutService.getAll().then((response) => {
            setWorkouts(response.data.data);
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    const orderedWorkouts = useMemo(() => {
        const active = [];
        const completed = [];

        workouts.forEach((workout) => {
            const isActiveWorkout = !workout?.endTime && !workout?.end_time;
            if (isActiveWorkout) {
                active.push(workout);
                return;
            }

            completed.push(workout);
        });

        return [...active, ...completed];
    }, [workouts]);

    return (
        <>
            {orderedWorkouts.map((workout) => {
                const isActiveWorkout = !workout?.endTime && !workout?.end_time;
                const onWorkoutClick = () => {
                    if (isActiveWorkout) {
                        localStorage.setItem("activeWorkoutId", String(workout.workoutId));
                        navigate("/workout/session");
                        return;
                    }

                    navigate(`/workout/${workout.workoutId}`);
                };

                return (
                <div
                    key={workout.workoutId}
                    className={`workout-cont ${isActiveWorkout ? "active-workout" : ""}`}
                    onClick={onWorkoutClick}
                >
                    <div className="workout-left-cont">
                        <div className="workout-icon-cont">
                            <PiBarbellLight size={24} color="#3B82F6" />
                        </div>
                        <div className="workout-info-cont">
                            <div className="workout-label">
                                <span>{workout.workoutName}</span>
                                {!isActiveWorkout ? (
                                    <CiCircleCheck size={18} color="#10B981" className="completed-icon" />
                                ) : null}
                            </div>
                            <div className="workout-stat-cont">
                                <span className="workout-stat">
                                    <FiCalendar size={14} className="calendar-icon" />
                                    {new Date(workout.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="workout-stat">
                                    <FaRegClock size={14} className="clock-icon" />
                                    {getDuration(workout.startTime, workout.endTime) || '0 min'}
                                </span>
                                <span className="workout-stat">
                                    {workout.exerciseCount} exercises
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="workout-right-cont">
                        <span className="workout-stat">
                            <GiWeight size={18} className="weight-icon" />
                            {workout.totalTonnage} kg
                        </span>
                        <span className="workout-stat">
                            <RiFireLine size={18} className="calories-icon" color="#FF8904"/>
                            {workout.caloriesBurned} kcal
                        </span>
                    </div>
                </div>
            )})}
        </>
    )
}

export default WorkoutsListCard;