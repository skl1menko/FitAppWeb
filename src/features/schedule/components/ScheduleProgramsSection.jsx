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
    role
}) => {
    return (
        <div className="schedule-page-block right">
            <div className="block-header">
                <div className="header-icon right">
                    <MdOutlineEditCalendar size={32} color="rgb(0, 157, 255)" />
                </div>
                <div className="header-label">
                    <h1>Upcoming plans</h1>
                    <p>Each plan contains multiple workouts ready to edit or start.</p>
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
                                    My plans
                                </button>
                                <button
                                    type="button"
                                    className={`plans-view-switch-btn ${activePlansView === "clients" ? "active" : ""}`}
                                    onClick={() => onSetActivePlansView?.("clients")}
                                >
                                    Client plans
                                </button>
                            </div>
                        ) : null}

                        {isLoadingPrograms ? (
                            <div className="plans-feedback">Loading plans...</div>
                        ) : programsError ? (
                            <div className="plans-feedback error">{programsError}</div>
                        ) : programs.length === 0 ? (
                            <div className="plans-feedback">
                                {role === "trainer" && activePlansView === "clients"
                                    ? "No client plans yet. Assign any of your plans to a client first."
                                    : "No plans yet."}
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
