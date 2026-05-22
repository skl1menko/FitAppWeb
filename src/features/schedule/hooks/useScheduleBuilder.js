import { useState } from "react";
import trainingProgramService from "../../../services/trainingProgramService";
import { createWorkoutRow } from "../utils/scheduleFactories";
import { normalizePlannedDate } from "../utils/scheduleFormatters";

const buildCreateProgramPayload = ({ programDescription, programName, workouts }) => {
    const payloadWorkouts = workouts
        .map((workout) => ({
            name: workout.name.trim(),
            startTime: workout.startTime ? normalizePlannedDate(workout.startTime)?.toISOString() : null
        }))
        .filter((workout) => workout.name.length > 0);

    return {
        description: programDescription.trim() || null,
        name: programName.trim(),
        workouts: payloadWorkouts
    };
};

const useScheduleBuilder = ({ onProgramCreated }) => {
    const [programName, setProgramName] = useState("");
    const [programDescription, setProgramDescription] = useState("");
    const [showDescription, setShowDescription] = useState(false);
    const [workouts, setWorkouts] = useState([createWorkoutRow()]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

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

    const handleToggleDescription = () => {
        setShowDescription((prev) => !prev);
    };

    const resetForm = () => {
        setProgramName("");
        setProgramDescription("");
        setShowDescription(false);
        setWorkouts([createWorkoutRow()]);
    };

    const handleCreateProgram = async (event) => {
        event.preventDefault();
        setFormError("");
        setFormSuccess("");

        if (!programName.trim()) {
            setFormError("Plan name is required");
            return;
        }

        const payload = buildCreateProgramPayload({
            programDescription,
            programName,
            workouts
        });

        if (payload.workouts.length === 0) {
            setFormError("At least one workout with a name is required");
            return;
        }

        setIsSubmitting(true);

        try {
            await trainingProgramService.createWithWorkouts(payload);
            resetForm();
            setFormSuccess("Plan created successfully");
            await onProgramCreated?.();
        } catch (error) {
            setFormError(error?.response?.data?.message || "Failed to create plan");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
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
    };
};

export default useScheduleBuilder;
