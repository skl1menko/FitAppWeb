import { useState } from "react";
import { FaPlus } from "../../assets/icons";
import "./WorkoutPage.scss";
import WorkoutsListCard from "./components/WorkoutsListCard.jsx";
import CustomBtn from "../../components/CustomBtn.jsx";
import useBodyClass from "../../hooks/useBodyClass";
const WorkoutPage = () => {

    useBodyClass("workout-page-body");

    return(
        <div className="workout-page-cont">
            <div className="workout-page-content">
                <div className="create-workout-cont">
                    <CustomBtn icon={<FaPlus />} text="Create New Workout" />
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