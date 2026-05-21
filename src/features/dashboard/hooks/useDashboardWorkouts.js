import { useEffect, useState } from "react";
import workoutService from "../../../services/WorkoutServices/workoutService";

const useDashboardWorkouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isCancelled = false;

        const loadWorkouts = async () => {
            setIsLoading(true);
            setError("");

            try {
                const response = await workoutService.getAll();

                if (isCancelled) {
                    return;
                }

                setWorkouts(response?.data?.data ?? []);
            } catch (loadError) {
                if (isCancelled) {
                    return;
                }

                setWorkouts([]);
                setError(loadError?.response?.data?.message || "Failed to load workouts");
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadWorkouts();

        return () => {
            isCancelled = true;
        };
    }, []);

    return {
        workouts,
        isLoading,
        error
    };
};

export default useDashboardWorkouts;
