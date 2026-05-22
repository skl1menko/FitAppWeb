import { FaPlus, MdSportsGymnastics } from "../../../assets/icons";
import CustomBtn from "../../../components/CustomBtn";
import DatePickerCustom from "../../../components/DatePickerCustom";
import { normalizePlannedDate } from "../utils/scheduleFormatters";
import "./ScheduleBuilderSection.scss";

const ScheduleBuilderSection = ({
    formError = "",
    formSuccess = "",
    isBuilderOpen = true,
    isSubmitting = false,
    onCreateProgram = null,
    onToggleBuilder = null,
    onToggleDescription = null,
    onAddWorkout = null,
    onRemoveWorkout = null,
    onWorkoutChange = null,
    onToggleWorkoutDate = null,
    programDescription = "",
    programName = "",
    setProgramDescription = null,
    setProgramName = null,
    showDescription = false,
    workouts = []
}) => {
    return (
        <div className={`schedule-page-block left ${isBuilderOpen ? "" : "is-collapsed"}`}>
            <div className="block-header create-plan-header">
                <div className="header-icon">
                    <MdSportsGymnastics size={32} color="rgb(240, 170, 41)" />
                </div>
                <div className="header-title-row">
                    <div className="header-label">
                        <h1>Create a workout plan</h1>
                    </div>
                    <div className="mobile-toggle-row">
                        <button
                            type="button"
                            className="mobile-toggle-btn"
                            onClick={onToggleBuilder}
                        >
                            {isBuilderOpen ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>
            </div>

            <form className="block-content left" onSubmit={onCreateProgram}>
                <div className="plan-name-cont">
                    <span>Plan name</span>
                    <input
                        type="text"
                        className="schedule-input"
                        placeholder="Enter plan name"
                        value={programName}
                        onChange={(event) => setProgramName?.(event.target.value)}
                    />
                    <button
                        type="button"
                        className="optional-toggle-btn"
                        onClick={onToggleDescription}
                    >
                        {showDescription ? "Remove description" : "Add description"}
                    </button>
                </div>

                {showDescription ? (
                    <div className="plan-name-cont">
                        <span>Description</span>
                        <textarea
                            className="schedule-input schedule-textarea"
                            placeholder="Short description"
                            value={programDescription}
                            onChange={(event) => setProgramDescription?.(event.target.value)}
                        />
                    </div>
                ) : null}

                <div className="add-workout-list">
                    <div className="add-workout-header">
                        <h1>Workouts inside the plan</h1>
                        <span>Fill in the workout name and optional start time.</span>
                    </div>

                    {workouts.map((workout, index) => (
                        <div className="add-workout-cont" key={workout.id}>
                            <div className="add-workout-row-header">
                                <span>Workout {index + 1}</span>
                                <button
                                    type="button"
                                    className="delete-workout"
                                    onClick={() => onRemoveWorkout?.(workout.id)}
                                    disabled={workouts.length === 1}
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="workout-input-grid">
                                <input
                                    type="text"
                                    className="schedule-input"
                                    placeholder="Enter workout name"
                                    value={workout.name}
                                    onChange={(event) => onWorkoutChange?.(workout.id, "name", event.target.value)}
                                />
                            </div>

                            {workout.showDate ? (
                                <div className="workout-date-row">
                                    <DatePickerCustom
                                        value={workout.startTime}
                                        onChange={(date) => onWorkoutChange?.(workout.id, "startTime", normalizePlannedDate(date))}
                                    />
                                </div>
                            ) : null}

                            <div className="workout-optional-row">
                                <button
                                    type="button"
                                    className="optional-toggle-btn"
                                    onClick={() => onToggleWorkoutDate?.(workout.id)}
                                >
                                    {workout.showDate ? "Remove date" : "Add date"}
                                </button>
                            </div>
                        </div>
                    ))}

                    <button type="button" className="add-workout-btn" onClick={onAddWorkout}>
                        <FaPlus size={10} /> Add workout
                    </button>
                </div>

                {formError ? <div className="form-feedback error">{formError}</div> : null}
                {formSuccess ? <div className="form-feedback success">{formSuccess}</div> : null}

                <CustomBtn
                    icon={<FaPlus />}
                    text={isSubmitting ? "Saving..." : "Create plan"}
                    className="create-plan-btn"
                    type="submit"
                    disabled={isSubmitting}
                />
            </form>
        </div>
    );
};

export default ScheduleBuilderSection;
