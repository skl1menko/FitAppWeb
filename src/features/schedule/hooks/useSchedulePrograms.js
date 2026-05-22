import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import trainingProgramService from "../../../services/trainingProgramService";
import workoutService from "../../../services/WorkoutServices/workoutService";
import { showWorkoutAlert } from "../../workout/utils/workoutFeedback";
import { normalizeProgram } from "../utils/scheduleMappers";

const useSchedulePrograms = ({ role }) => {
    const [openPlans, setOpenPlans] = useState(new Set());
    const [activePlansView, setActivePlansView] = useState("personal");
    const [programs, setPrograms] = useState([]);
    const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
    const [programsError, setProgramsError] = useState("");
    const [creatingWorkoutPlanId, setCreatingWorkoutPlanId] = useState(null);
    const planWorkoutsRefs = useRef({});

    const loadPrograms = useCallback(async () => {
        setIsLoadingPrograms(true);
        setProgramsError("");

        try {
            const response = role === "trainer"
                ? await trainingProgramService.getMyCreated()
                : await trainingProgramService.getMy();
            const list = response?.data?.data || [];
            const detailed = await Promise.all(
                list.map((program) =>
                    trainingProgramService
                        .getById(program.programId)
                        .then((res) => normalizeProgram({ ...program, ...(res?.data?.data || {}) }))
                        .catch(() => normalizeProgram({ ...program, workouts: [] }))
                )
            );
            setPrograms(detailed);
        } catch {
            setProgramsError("Failed to load plans");
        } finally {
            setIsLoadingPrograms(false);
        }
    }, [role]);

    useEffect(() => {
        void loadPrograms();
    }, [loadPrograms]);

    const visiblePrograms = useMemo(() => {
        if (role !== "trainer") {
            return programs;
        }

        if (activePlansView === "clients") {
            return programs.filter((program) => program.assignedAthletesCount > 0);
        }

        return programs.filter((program) => program.assignedAthletesCount === 0);
    }, [activePlansView, programs, role]);

    const handleAddWorkoutToPlan = async (program) => {
        const programId = program?.programId;
        if (!programId || creatingWorkoutPlanId) {
            return;
        }

        const nextWorkoutNumber = (program.workouts?.length || 0) + 1;
        setCreatingWorkoutPlanId(programId);

        try {
            const response = await workoutService.create({
                program_id: programId,
                name: `Workout ${nextWorkoutNumber}`,
                is_started: false
            });

            const createdWorkout = response?.data?.data;
            if (createdWorkout) {
                setPrograms((prev) => prev.map((item) => (
                    item.programId === programId
                        ? {
                            ...item,
                            workouts: [...item.workouts, normalizeProgram({ workouts: [createdWorkout] }).workouts[0]]
                        }
                        : item
                )));
            }
        } catch (error) {
            showWorkoutAlert(error?.response?.data?.message || "Failed to add workout to plan");
        } finally {
            setCreatingWorkoutPlanId(null);
        }
    };

    const handleDeletePlan = async (programId) => {
        if (!programId) {
            return;
        }

        try {
            await trainingProgramService.delete(programId);
            await loadPrograms();
        } catch (error) {
            showWorkoutAlert(error?.response?.data?.message || "Failed to delete plan");
        }
    };

    const handleTogglePlan = (programId) => {
        const willOpen = !openPlans.has(programId);

        setOpenPlans((prev) => {
            const next = new Set(prev);
            if (next.has(programId)) {
                next.delete(programId);
            } else {
                next.add(programId);
            }
            return next;
        });

        if (willOpen) {
            requestAnimationFrame(() => {
                planWorkoutsRefs.current[programId]?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        }
    };

    const registerPlanWorkoutsRef = (programId, node) => {
        if (node) {
            planWorkoutsRefs.current[programId] = node;
        }
    };

    return {
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
    };
};

export default useSchedulePrograms;
