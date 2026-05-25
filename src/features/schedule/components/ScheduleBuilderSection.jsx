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
    workouts = [],
    t
}) => {
    return (
        <div className={`schedule-page-block left ${isBuilderOpen ? "" : "is-collapsed"}`}>
            <div className="block-header create-plan-header">
                <div className="header-icon">
                    <MdSportsGymnastics size={32} color="rgb(240, 170, 41)" />
                </div>
                <div className="header-title-row">
                    <div className="header-label">
                        <h1>{t('schedule.builder.title')}</h1>
                    </div>
                    <div className="mobile-toggle-row">
                        <button
                            type="button"
                            className="mobile-toggle-btn"
                            onClick={onToggleBuilder}
                        >
                            {isBuilderOpen ? t('schedule.builder.hide') : t('schedule.builder.show')}
                        </button>
                    </div>
                </div>
            </div>

            <form className="block-content left" onSubmit={onCreateProgram}>
                <div className="plan-name-cont">
                    <span>{t('schedule.builder.planName')}</span>
                    <input
                        type="text"
                        className="schedule-input"
                        placeholder={t('schedule.builder.planNamePlaceholder')}
                        value={programName}
                        onChange={(event) => setProgramName?.(event.target.value)}
                    />
                    <button
                        type="button"
                        className="optional-toggle-btn"
                        onClick={onToggleDescription}
                    >
                        {showDescription ? t('schedule.builder.removeDescription') : t('schedule.builder.addDescription')}
                    </button>
                </div>

                {showDescription ? (
                    <div className="plan-name-cont">
                        <span>{t('schedule.builder.description')}</span>
                        <textarea
                            className="schedule-input schedule-textarea"
                            placeholder={t('schedule.builder.descriptionPlaceholder')}
                            value={programDescription}
                            onChange={(event) => setProgramDescription?.(event.target.value)}
                        />
                    </div>
                ) : null}

                <div className="add-workout-list">
                    <div className="add-workout-header">
                        <h1>{t('schedule.builder.workoutsTitle')}</h1>
                        <span>{t('schedule.builder.workoutsSubtitle')}</span>
                    </div>

                    {workouts.map((workout, index) => (
                        <div className="add-workout-cont" key={workout.id}>
                            <div className="add-workout-row-header">
                                <span>{t('schedule.builder.workoutLabel', { index: index + 1 })}</span>
                                <button
                                    type="button"
                                    className="delete-workout"
                                    onClick={() => onRemoveWorkout?.(workout.id)}
                                    disabled={workouts.length === 1}
                                >
                                    {t('schedule.builder.removeWorkout')}
                                </button>
                            </div>

                            <div className="workout-input-grid">
                                <input
                                    type="text"
                                    className="schedule-input"
                                    placeholder={t('schedule.builder.workoutNamePlaceholder')}
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
                                    {workout.showDate ? t('schedule.builder.removeDate') : t('schedule.builder.addDate')}
                                </button>
                            </div>
                        </div>
                    ))}

                    <button type="button" className="add-workout-btn" onClick={onAddWorkout}>
                        <FaPlus size={10} /> {t('schedule.builder.addWorkout')}
                    </button>
                </div>

                {formError ? <div className="form-feedback error">{formError}</div> : null}
                {formSuccess ? <div className="form-feedback success">{formSuccess}</div> : null}

                <CustomBtn
                    icon={<FaPlus />}
                    text={isSubmitting ? t('schedule.builder.saving') : t('schedule.builder.createPlan')}
                    className="create-plan-btn"
                    type="submit"
                    disabled={isSubmitting}
                />
            </form>
        </div>
    );
};

export default ScheduleBuilderSection;
