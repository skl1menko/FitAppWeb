import "./ExerciseCard.scss";

const getMuscleGroupClass = (muscleGroup) => {
    const value = (muscleGroup || "general").toLowerCase();

    if (value.includes("chest")) return "badge-chest";
    if (value.includes("lats") || value.includes("upper back")) return "badge-back";
    if (value.includes("shoulder")) return "badge-shoulders";
    if (value.includes("biceps")  || value.includes("triceps") || value.includes("forearm")) return "badge-arms";
    if (value.includes("leg") || value.includes("quad") || value.includes("hamstring") || value.includes("glute") || value.includes("calves")) return "badge-legs";
    if (value.includes("abs") || value.includes("core")) return "badge-core";

    return "badge-general";
};

const ExerciseCard = ({ exercises = [] }) => {
    return (
        <div className="exercise-card-cont">
            {exercises.map((exercise) => (
                <div className="exercise-card-content" key={exercise?._id || exercise?.id || exercise?.exerciseName}>
                    <div className="exercise-img-cont">
                        <div className="exercise-muscle-cont">
                            <span className={`exercise-badge ${getMuscleGroupClass(exercise?.muscleGroup)}`}>
                                {exercise?.muscleGroup || "General"}
                            </span>
                        </div>
                        <div className="exercise-img">
                            <img src={exercise.imageUrl} alt="" />
                        </div>
                    </div>
                    <div className="exercise-name-cont">
                        <h1>{exercise?.exerciseName || "No exercises found"}</h1>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExerciseCard;