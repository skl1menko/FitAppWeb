import { useState } from "react";
import useBodyClass from "../../hooks/useBodyClass";
import authService from "../../services/authService";
import ScheduleBuilderSection from "./components/ScheduleBuilderSection";
import ScheduleProgramsSection from "./components/ScheduleProgramsSection";
import useScheduleBuilder from "./hooks/useScheduleBuilder";
import useSchedulePrograms from "./hooks/useSchedulePrograms";
import useScheduleWorkoutActions from "./hooks/useScheduleWorkoutActions";
import "./SchedulePage.scss";

const SchedulePage = () => {
    const role = authService.getUser()?.role;
    const [isBuilderOpen, setIsBuilderOpen] = useState(true);
    const {
        activePlansView,
        creatingWorkoutPlanId,
        isLoadingPrograms,
        openPlans,
        programsError,
        visiblePrograms,
        loadPrograms,
        registerPlanWorkoutsRef,
        setActivePlansView,
        handleAddWorkoutToPlan,
        handleDeletePlan,
        handleTogglePlan
    } = useSchedulePrograms({ role });
    const {
        editPlannedWorkout,
        startPlannedWorkout
    } = useScheduleWorkoutActions();
    const programActions = {
        addWorkoutToPlan: handleAddWorkoutToPlan,
        deletePlan: handleDeletePlan,
        editWorkout: editPlannedWorkout,
        startWorkout: startPlannedWorkout,
        togglePlan: handleTogglePlan
    };
    const {
        programName,
        programDescription,
        showDescription,
        workouts,
        isSubmitting,
        formError,
        formSuccess,
        setProgramName,
        setProgramDescription,
        handleAddWorkout,
        handleRemoveWorkout,
        handleWorkoutChange,
        handleToggleWorkoutDate,
        handleToggleDescription,
        handleCreateProgram
    } = useScheduleBuilder({
        onProgramCreated: loadPrograms
    });

    useBodyClass("schedule-page-body");

    return (
        <div className="schedule-page-cont">
            <ScheduleBuilderSection
                formError={formError}
                formSuccess={formSuccess}
                isBuilderOpen={isBuilderOpen}
                isSubmitting={isSubmitting}
                onAddWorkout={handleAddWorkout}
                onCreateProgram={handleCreateProgram}
                onRemoveWorkout={handleRemoveWorkout}
                onToggleBuilder={() => setIsBuilderOpen((prev) => !prev)}
                onToggleDescription={handleToggleDescription}
                onToggleWorkoutDate={handleToggleWorkoutDate}
                onWorkoutChange={handleWorkoutChange}
                programDescription={programDescription}
                programName={programName}
                setProgramDescription={setProgramDescription}
                setProgramName={setProgramName}
                showDescription={showDescription}
                workouts={workouts}
            />
            <ScheduleProgramsSection
                activePlansView={activePlansView}
                actions={programActions}
                creatingWorkoutPlanId={creatingWorkoutPlanId}
                isLoadingPrograms={isLoadingPrograms}
                onSetActivePlansView={setActivePlansView}
                openPlans={openPlans}
                programs={visiblePrograms}
                programsError={programsError}
                registerPlanWorkoutsRef={registerPlanWorkoutsRef}
                role={role}
            />
        </div>
    );
};

export default SchedulePage;
