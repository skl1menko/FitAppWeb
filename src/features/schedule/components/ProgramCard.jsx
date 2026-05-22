import { BsChevronDown, FaPlus } from "../../../assets/icons";
import { formatPlanDate, formatWorkoutDateTime, isWorkoutCompleted } from "../utils/scheduleFormatters";
import "./ProgramCard.scss";

const ProgramCard = ({
    actions = {},
    isCreatingWorkout = false,
    isOpen = false,
    program,
    registerPlanWorkoutsRef = null
}) => {
    return (
        <div className="plan-card" key={program.programId}>
            <div className="plan-card-header">
                <div className="plan-title">
                    <h2>{program.programName}</h2>
                    {program.description ? <p>{program.description}</p> : null}
                    {program.isAssigned ? (
                        <span className="plan-assigned-by">
                            Assigned by trainer: {program.assignedByName || "trainer"}
                        </span>
                    ) : null}
                    <span>{program.workouts.length} workouts</span>
                </div>
                <div className="plan-meta">
                    <span>{formatPlanDate(program.createdAt)}</span>
                    {!program.isAssigned ? (
                        <button
                            type="button"
                            className="plan-delete-btn"
                            onClick={() => actions.deletePlan?.(program.programId)}
                        >
                            Delete plan
                        </button>
                    ) : null}
                </div>
            </div>

            {isOpen ? (
                <div
                    className="plan-workouts"
                    id={`plan-workouts-${program.programId}`}
                    ref={(node) => registerPlanWorkoutsRef?.(program.programId, node)}
                >
                    {program.workouts.map((workout) => {
                        const completed = isWorkoutCompleted(workout);
                        return (
                            <div
                                className={`plan-workout-item ${completed ? "is-completed" : ""}`}
                                key={workout.workoutId}
                            >
                                <div className="plan-workout-info">
                                    <h3>{workout.workoutName}</h3>
                                    <span>{formatWorkoutDateTime(workout.startTime)}</span>
                                    {completed ? <span className="workout-status">Completed</span> : null}
                                </div>
                                <div className="plan-workout-actions">
                                    <button
                                        type="button"
                                        className="workout-btn edit"
                                        onClick={() => actions.editWorkout?.(workout.workoutId)}
                                    >
                                        Edit workout
                                    </button>
                                    <button
                                        type="button"
                                        className="workout-btn start"
                                        onClick={() => actions.startWorkout?.(workout.workoutId)}
                                        disabled={completed}
                                    >
                                        Start now
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        type="button"
                        className="add-workout-btn"
                        onClick={() => actions.addWorkoutToPlan?.(program)}
                        disabled={isCreatingWorkout || program.isAssigned}
                    >
                        <FaPlus size={10} />
                        {isCreatingWorkout ? "Adding..." : ""}
                    </button>
                </div>
            ) : null}

            <button
                type="button"
                className="plan-toggle-btn"
                onClick={() => actions.togglePlan?.(program.programId)}
                aria-expanded={isOpen}
                aria-controls={`plan-workouts-${program.programId}`}
            >
                <span>{isOpen ? "Hide workouts" : "Show workouts"}</span>
                <BsChevronDown className={`plan-toggle-icon ${isOpen ? "open" : ""}`} />
            </button>
        </div>
    );
};

export default ProgramCard;
