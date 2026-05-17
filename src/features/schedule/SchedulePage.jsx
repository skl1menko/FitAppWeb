import { useEffect, useMemo, useRef, useState } from "react";
import useBodyClass from "../../hooks/useBodyClass";
import "./SchedulePage.scss";
import { MdSportsGymnastics, MdOutlineEditCalendar, BsChevronDown, FaPlus } from "../../assets/icons";
import CustomBtn from "../../components/CustomBtn";
import trainingProgramService from "../../services/trainingProgramService";
import DatePickerCustom from "../../components/DatePickerCustom";
import workoutService from "../../services/WorkoutServices/workoutService";
import { useNavigate } from "react-router";
import authService from "../../services/authService";

const createWorkoutId = () => {
    if (typeof crypto !== "undefined") {
        if (typeof crypto.randomUUID === "function") {
            return crypto.randomUUID();
        }

        if (typeof crypto.getRandomValues === "function") {
            const bytes = new Uint8Array(16);
            crypto.getRandomValues(bytes);
            return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
        }
    }

    return `workout-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createWorkoutRow = () => ({
    id: createWorkoutId(),
    name: "",
    startTime: null,
    showDate: false
});

const normalizePlannedDate = (value) => {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        return null;
    }

    const normalized = new Date(value);
    // Keep planned workouts anchored to the selected calendar day.
    normalized.setHours(12, 0, 0, 0);
    return normalized;
};

const SchedulePage = () => {
    const navigate = useNavigate();
    const role = authService.getUser()?.role;
    const [openPlans, setOpenPlans] = useState(new Set());
    const [activePlansView, setActivePlansView] = useState("personal");
    const [isBuilderOpen, setIsBuilderOpen] = useState(true);
    const [programName, setProgramName] = useState("");
    const [programDescription, setProgramDescription] = useState("");
    const [showDescription, setShowDescription] = useState(false);
    const [workouts, setWorkouts] = useState([createWorkoutRow()]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [programs, setPrograms] = useState([]);
    const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
    const [programsError, setProgramsError] = useState("");
    const [creatingWorkoutPlanId, setCreatingWorkoutPlanId] = useState(null);
    const planWorkoutsRefs = useRef({});

    const formatPlanDate = (value) => {
        if (!value) return "";
        return new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    const formatWorkoutDateTime = (value) => {
        if (!value) return "Starts when launched";
        return new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    const isWorkoutCompleted = (workout) => {
        const endValue = workout?.endTime || workout?.end_time;
        return Boolean(endValue);
    };

    const loadPrograms = async () => {
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
                        .then((res) => ({...program, ...(res?.data?.data || {})}))
                        .catch(() => ({...program, workouts: []}))
                )
            );
            setPrograms(detailed);
        } catch (error) {
            setProgramsError("Failed to load plans");
        } finally {
            setIsLoadingPrograms(false);
        }
    };

    useEffect(() => {
        loadPrograms();
    }, [role]);

    const visiblePrograms = useMemo(() => {
        if (role !== "trainer") {
            return programs;
        }

        if (activePlansView === "clients") {
            return programs.filter((program) => (Number(program.assignedAthletesCount) || 0) > 0);
        }

        return programs.filter((program) => (Number(program.assignedAthletesCount) || 0) === 0);
    }, [activePlansView, programs, role]);

    const handleAddWorkout = () => {
        setWorkouts((prev) => [...prev, createWorkoutRow()]);
    };

    const handleRemoveWorkout = (workoutId) => {
        setWorkouts((prev) => prev.filter((workout) => workout.id !== workoutId));
    };

    const handleWorkoutChange = (workoutId, field, value) => {
        setWorkouts((prev) => prev.map((workout) => (
            workout.id === workoutId ? { ...workout, [field]: value } : workout
        )));
    };

    const handleToggleWorkoutDate = (workoutId) => {
        setWorkouts((prev) => prev.map((workout) => (
            workout.id === workoutId ? { ...workout, showDate: !workout.showDate } : workout
        )));
    };

    const handleCreateProgram = async (event) => {
        event.preventDefault();
        setFormError("");
        setFormSuccess("");

        const payloadWorkouts = workouts
            .map((workout) => ({
                name: workout.name.trim(),
                startTime: workout.startTime ? normalizePlannedDate(workout.startTime)?.toISOString() : null,
            }))
            .filter((workout) => workout.name.length > 0);

        if (!programName.trim()) {
            setFormError("Plan name is required");
            return;
        }

        if (payloadWorkouts.length === 0) {
            setFormError("At least one workout with a name is required");
            return;
        }

        setIsSubmitting(true);

        try {
            await trainingProgramService.createWithWorkouts({
                name: programName.trim(),
                description: programDescription.trim() || null,
                workouts: payloadWorkouts,
            });

            setProgramName("");
            setProgramDescription("");
            setShowDescription(false);
            setWorkouts([createWorkoutRow()]);
            setFormSuccess("Plan created successfully");
            loadPrograms();
        } catch (error) {
            setFormError(error?.response?.data?.message || "Failed to create plan");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditWorkout = (workoutId) => {
        navigate(`/workout/session?workoutId=${workoutId}&mode=planned`, {
            state: { returnTo: "/schedule" }
        });
    };

    const handleAddWorkoutToPlan = async (program) => {
        const programId = program?.programId;
        if (!programId || creatingWorkoutPlanId) return;

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
                setPrograms((prev) => prev.map((item) => {
                    if (item.programId !== programId) {
                        return item;
                    }

                    return {
                        ...item,
                        workouts: [...(item.workouts || []), createdWorkout]
                    };
                }));
            }

        } catch (error) {
            const message = error?.response?.data?.message || "Failed to add workout to plan";
            alert(message);
        } finally {
            setCreatingWorkoutPlanId(null);
        }
    };

    const handleStartWorkout = async (workoutId) => {
        if (!workoutId) return;

        try {
            await workoutService.update(workoutId, {
                start_time: new Date().toISOString(),
                is_started: true
            });
            localStorage.setItem("activeWorkoutId", String(workoutId));
            navigate("/workout/session");
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to start workout";
            alert(message);
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

    const handleDeletePlan = async (programId) => {
        if (!programId) return;

        try {
            await trainingProgramService.delete(programId);
            loadPrograms();
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to delete plan";
            alert(message);
        }
    };

    useBodyClass("schedule-page-body");
    return (
        <div className="schedule-page-cont">
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
                                onClick={() => setIsBuilderOpen((prev) => !prev)}
                            >
                                {isBuilderOpen ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    <p className="header-description">Give the plan a name, then add as many workouts as you need.</p>
                </div>
                <form className="block-content left" onSubmit={handleCreateProgram}>
                    <div className="plan-name-cont">
                        <span>Plan name</span>
                        <input
                            type="text"
                            className="schedule-input"
                            placeholder="Enter plan name"
                            value={programName}
                            onChange={(event) => setProgramName(event.target.value)}
                        />
                        <button
                            type="button"
                            className="optional-toggle-btn"
                            onClick={() => setShowDescription((prev) => !prev)}
                        >
                            {showDescription ? "Remove description" : "Add description"}
                        </button>
                    </div>

                    {showDescription && (
                        <div className="plan-name-cont">
                            <span>Description</span>
                            <textarea
                                className="schedule-input schedule-textarea"
                                placeholder="Short description"
                                value={programDescription}
                                onChange={(event) => setProgramDescription(event.target.value)}
                            />
                        </div>
                    )}

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
                                        onClick={() => handleRemoveWorkout(workout.id)}
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
                                        onChange={(event) => handleWorkoutChange(workout.id, "name", event.target.value)}
                                    />
                                </div>
                                {workout.showDate && (
                                    <div className="workout-date-row">
                                        <DatePickerCustom
                                            value={workout.startTime}
                                            onChange={(date) => handleWorkoutChange(workout.id, "startTime", normalizePlannedDate(date))}
                                        />
                                    </div>
                                )}
                                <div className="workout-optional-row">
                                    <button
                                        type="button"
                                        className="optional-toggle-btn"
                                        onClick={() => handleToggleWorkoutDate(workout.id)}
                                    >
                                        {workout.showDate ? "Remove date" : "Add date"}
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button type="button" className="add-workout-btn" onClick={handleAddWorkout}>
                            <FaPlus size={10} /> Add workout
                        </button>
                    </div>

                    {formError && <div className="form-feedback error">{formError}</div>}
                    {formSuccess && <div className="form-feedback success">{formSuccess}</div>}

                    <CustomBtn
                        icon={<FaPlus />}
                        text={isSubmitting ? "Saving..." : "Create plan"}
                        className="create-plan-btn"
                        type="submit"
                        disabled={isSubmitting}
                    />
                </form>
            </div>

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
                                        onClick={() => setActivePlansView("personal")}
                                    >
                                        My plans
                                    </button>
                                    <button
                                        type="button"
                                        className={`plans-view-switch-btn ${activePlansView === "clients" ? "active" : ""}`}
                                        onClick={() => setActivePlansView("clients")}
                                    >
                                        Client plans
                                    </button>
                                </div>
                            ) : null}
                            {isLoadingPrograms ? (
                                <div className="plans-feedback">Loading plans...</div>
                            ) : programsError ? (
                                <div className="plans-feedback error">{programsError}</div>
                            ) : visiblePrograms.length === 0 ? (
                                <div className="plans-feedback">
                                    {role === "trainer" && activePlansView === "clients"
                                        ? "No client plans yet. Assign any of your plans to a client first."
                                        : "No plans yet."}
                                </div>
                            ) : (
                                <div className="plans-list">
                                    {visiblePrograms.map((program) => {
                                        const isOpen = openPlans.has(program.programId);
                                        const isCreatingWorkout = creatingWorkoutPlanId === program.programId;
                                        return (
                                            <div className="plan-card" key={program.programId}>
                                                <div className="plan-card-header">
                                                    <div className="plan-title">
                                                        <h2>{program.programName || "Plan"}</h2>
                                                        {program.description ? (
                                                            <p>{program.description}</p>
                                                        ) : null}
                                                        {program.isAssigned ? (
                                                            <span className="plan-assigned-by">
                                                                Assigned by trainer: {program.assignedByName || "trainer"}
                                                            </span>
                                                        ) : null}
                                                        <span>{(program.workouts || []).length} workouts</span>
                                                    </div>
                                                    <div className="plan-meta">
                                                        <span>{formatPlanDate(program.createdAt)}</span>

                                                        {!program.isAssigned ? (
                                                            <button
                                                                type="button"
                                                                className="plan-delete-btn"
                                                                onClick={() => handleDeletePlan(program.programId)}
                                                            >
                                                                Delete plan
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                {isOpen && (
                                                    <div
                                                        className="plan-workouts"
                                                        id={`plan-workouts-${program.programId}`}
                                                        ref={(node) => {
                                                            if (node) {
                                                                planWorkoutsRefs.current[program.programId] = node;
                                                            }
                                                        }}
                                                    >
                                                        {(program.workouts || []).map((workout) => {
                                                            const completed = isWorkoutCompleted(workout);
                                                            return (
                                                                <div
                                                                    className={`plan-workout-item ${completed ? "is-completed" : ""}`}
                                                                    key={workout.workoutId || workout.id}
                                                                >
                                                                    <div className="plan-workout-info">
                                                                        <h3>{workout.workoutName || workout.name || "Workout"}</h3>
                                                                        <span>{formatWorkoutDateTime(workout.startTime || workout.start_time)}</span>
                                                                        {completed ? (
                                                                            <span className="workout-status">Completed</span>
                                                                        ) : null}
                                                                    </div>
                                                                    <div className="plan-workout-actions">
                                                                        <button
                                                                            type="button"
                                                                            className="workout-btn edit"
                                                                            onClick={() => handleEditWorkout(workout.workoutId || workout.id)}
                                                                        >
                                                                            Edit workout
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="workout-btn start"
                                                                            onClick={() => handleStartWorkout(workout.workoutId || workout.id)}
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
                                                            onClick={() => handleAddWorkoutToPlan(program)}
                                                            disabled={isCreatingWorkout || program.isAssigned}
                                                        >
                                                            <FaPlus size={10} />
                                                            {isCreatingWorkout ? "Adding..." : ""}
                                                        </button>
                                                    </div>
                                                    
                                                )}
                                               
                                                <button
                                                    type="button"
                                                    className="plan-toggle-btn"
                                                    onClick={() => handleTogglePlan(program.programId)}
                                                    aria-expanded={isOpen}
                                                    aria-controls={`plan-workouts-${program.programId}`}
                                                >
                                                    <span>{isOpen ? "Hide workouts" : "Show workouts"}</span>
                                                    <BsChevronDown className={`plan-toggle-icon ${isOpen ? "open" : ""}`} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SchedulePage;
