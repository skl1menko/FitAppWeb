import { MdOutlineEditCalendar } from "../../../assets/icons";
import ProgramCard from "./ProgramCard";
import "./ScheduleProgramsSection.scss";

const ScheduleProgramsSection = ({
    activePlansView = "personal",
    actions = {},
    creatingWorkoutPlanId = null,
    isLoadingPrograms = false,
    onSetActivePlansView = null,
    openPlans = new Set(),
    programs = [],
    programsError = "",
    registerPlanWorkoutsRef = null,
    role,
    t
}) => {
    return (
        <div className="schedule-page-block right">
            <div className="block-header">
                <div className="header-icon right">
                    <MdOutlineEditCalendar size={32} color="rgb(0, 157, 255)" />
                </div>
                <div className="header-label">
                    <h1>{t('schedule.programs.title')}</h1>
                    <p>{t('schedule.programs.subtitle')}</p>
                </div>
            </div>

            <div className="block-content right">
                <div className="workout-list">
                    <div className="workout-list-body">
                        {role === "trainer" ? (
                            <div className="plans-view-switch">
                                <button
                                    type="button"
                                    className={`plans-view-switch-btn ${activePlansView === "personal" ? "active" : ""}`}
                                    onClick={() => onSetActivePlansView?.("personal")}
                                >
                                    {t('schedule.programs.myPlans')}
                                </button>
                                <button
                                    type="button"
                                    className={`plans-view-switch-btn ${activePlansView === "clients" ? "active" : ""}`}
                                    onClick={() => onSetActivePlansView?.("clients")}
                                >
                                    {t('schedule.programs.clientPlans')}
                                </button>
                            </div>
                        ) : null}

                        {isLoadingPrograms ? (
                            <div className="plans-feedback">{t('schedule.programs.loading')}</div>
                        ) : programsError ? (
                            <div className="plans-feedback error">{programsError}</div>
                        ) : programs.length === 0 ? (
                            <div className="plans-feedback">
                                {role === "trainer" && activePlansView === "clients"
                                    ? t('schedule.programs.emptyClients')
                                    : t('schedule.programs.empty')}
                            </div>
                        ) : (
                            <div className="plans-list">
                                {programs.map((program) => (
                                    <ProgramCard
                                        actions={actions}
                                        key={program.programId}
                                        isCreatingWorkout={creatingWorkoutPlanId === program.programId}
                                        isOpen={openPlans.has(program.programId)}
                                        program={program}
                                        registerPlanWorkoutsRef={registerPlanWorkoutsRef}
                                        t={t}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleProgramsSection;
