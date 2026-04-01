import workoutService from "../../../services/WorkoutServices/workoutService"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { PiBarbellLight, CiCircleCheck, FiCalendar, FaRegClock, GiWeight, RiFireLine } from "../../../assets/icons"
import "./WorkoutsListCard.scss"

const getDuration = (start, end) => {
    if (!start || !end) return null;
    const mins = Math.round((new Date(end) - new Date(start)) / 60000);
    return mins > 0 ? mins : null;
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

    return (
        <>
            {workouts.map((workout) => (
                <div key={workout.workoutId} className="workout-cont" onClick={() => navigate(`/workout/${workout.workoutId}`)}>
                    <div className="workout-left-cont">
                        <div className="workout-icon-cont">
                            <PiBarbellLight size={24} color="#3B82F6" />
                        </div>
                        <div className="workout-info-cont">
                            <div className="workout-label">
                                <span>{workout.workoutName}</span>
                                <CiCircleCheck size={18} color="#10B981" className="completed-icon" />
                            </div>
                            <div className="workout-stat-cont">
                                <span className="workout-stat">
                                    <FiCalendar size={14} className="calendar-icon" />
                                    {new Date(workout.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="workout-stat">
                                    <FaRegClock size={14} className="clock-icon" />
                                    {getDuration(workout.startTime, workout.endTime) ? `${getDuration(workout.startTime, workout.endTime)} min` : '0 min'}
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
            ))}
        </>
    )
}

export default WorkoutsListCard;