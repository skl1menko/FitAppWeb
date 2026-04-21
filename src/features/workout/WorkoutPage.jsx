import { useNavigate } from "react-router";
import { FaPlus } from "../../assets/icons";
import "./WorkoutPage.scss";
import WorkoutsListCard from "./components/WorkoutsListCard.jsx";
import CustomBtn from "../../components/CustomBtn.jsx";
import useBodyClass from "../../hooks/useBodyClass";
import workoutService from "../../services/WorkoutServices/workoutService.js";

const ACTIVE_WORKOUT_ID_KEY = "activeWorkoutId";

const WorkoutPage = () => {

    const navigate = useNavigate();

    useBodyClass("workout-page-body");

    const handleCreateWorkout = async () => {
        try {
            const savedId = Number(localStorage.getItem(ACTIVE_WORKOUT_ID_KEY));
            if (Number.isFinite(savedId) && savedId > 0) {
                try {
                    const existing = await workoutService.getById(savedId);
                    const workout = existing?.data?.data;
                    if (workout && !workout.endTime && !workout.end_time) {
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
            const activeWorkout = (allResponse?.data?.data || []).find((w)=> !w.endTime && !w.end_time);
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
    }

    

    return(
        <div className="workout-page-cont">
            <div className="workout-page-content">
                <div className="create-workout-cont">
                    <CustomBtn icon={<FaPlus />} text="Create New Workout" onClick={handleCreateWorkout} />
                </div>
                <div className="workout-list-cont">
                    <div className="workouts-card-header">
                        <h2>Recent Workouts</h2>
                    </div>
                    <div className="workout-list">
                        <WorkoutsListCard onClick={() => {
                            
                        }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkoutPage;