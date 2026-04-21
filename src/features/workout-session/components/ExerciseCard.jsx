import "./ExerciseCard.scss";
import useWorkoutSession from "../hooks/useWorkoutSession"

const ExerciseCard = () => {
    const { workoutExercises } = useWorkoutSession();
    return (
        <>
            {workoutExercises.map((exercise) => (
                <div className="exercise-list-item" key={exercise?.id || exercise?.exerciseId}>
                    <div className="exercise-card-header">
                        <div className="exercise-icon-cont">
                            <img src={exercise?.imageUrl} alt="" />
                        </div>
                        <div className="exercise-info-cont">
                            <p className="exercise-list-name">{exercise?.exerciseName || "Unnamed exercise"}</p>
                            <span className="exercise-list-group">{exercise?.muscleGroup || "General"}</span>
                        </div>
                    </div>
                    <div className="divider"></div>

                    <div className="exercise-card-body">
                        <div className="set-cont">
                            <span className="id-set-cont">1</span>
                            <div className="set-value-cont">
                                <span className="set-label">WEIGHT KG</span>
                                <input className="set-value" type="text" placeholder="KG" />
                            </div>
                            <div className="set-value-cont">

                                <span className="set-label">REPS</span>
                                <input className="set-value" type="text" placeholder="REPS" />
                            </div>
                            <div className="set-value-cont">
                                <span className="set-label">RPE</span>
                                <input className="set-value" type="text" placeholder="RPE" />
                            </div>
                            <div className="check-box-cont">
                                <input type="checkbox" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default ExerciseCard;