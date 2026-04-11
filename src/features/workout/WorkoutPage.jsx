import { useEffect, useState } from "react";
import { FaPlus } from "../../assets/icons";
import "./WorkoutPage.scss";
import WorkoutsListCard from "./components/WorkoutsListCard.jsx";

const WorkoutPage = () => {


    useEffect(() =>{
        document.body.classList.add('workout-page-body');
        return () => document.body.classList.remove('workout-page-body');
    }, [])

    return(
        <div className="workout-page-cont">
            <div className="workout-page-content">
                <div className="create-workout-cont">
                    <button className="create-workout-btn"> <FaPlus/>Create New Workout</button>
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