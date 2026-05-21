import { useEffect, useState } from "react";
import healthMetricsService from "../../../services/healthMetricsService";
import workoutService from "../../../services/WorkoutServices/workoutService";
import { getWorkoutDurationMinutes } from "../utils/dashboardWorkoutUtils";

const EMPTY_METRICS = { today: null, yesterday: null };
const EMPTY_ACTIVE_MINUTES = { today: 0, yesterday: 0 };

const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const getTotalActiveMinutes = (workouts = []) => {
    return workouts.reduce((total, workout) => total + (getWorkoutDurationMinutes(workout) ?? 0), 0);
};

const getWorkoutRangeParams = (date) => {
    const dateKey = formatLocalDate(date);

    return {
        start: `${dateKey}T00:00:00`,
        end: `${dateKey}T23:59:59.999`
    };
};

export const getTrendLabel = (currentValue, previousValue) => {
    if (currentValue == null || previousValue == null || previousValue === 0) {
        return "+0%";
    }

    const diff = ((currentValue - previousValue) / previousValue) * 100;
    const sign = diff >= 0 ? "+" : "";

    return `${sign}${diff.toFixed(0)}%`;
};

const getMetricsForDate = async (date) => {
    const currentDate = new Date(date);
    const previousDate = new Date(date);
    previousDate.setDate(currentDate.getDate() - 1);

    const currentMetricsDate = formatLocalDate(currentDate);
    const previousMetricsDate = formatLocalDate(previousDate);
    const currentWorkoutRange = getWorkoutRangeParams(currentDate);
    const previousWorkoutRange = getWorkoutRangeParams(previousDate);

    const [
        currentMetricsResponse,
        previousMetricsResponse,
        currentWorkoutsResponse,
        previousWorkoutsResponse
    ] = await Promise.all([
        healthMetricsService.getByPeriod("daily", currentMetricsDate, currentMetricsDate),
        healthMetricsService.getByPeriod("daily", previousMetricsDate, previousMetricsDate),
        workoutService.getByPeriod(currentWorkoutRange.start, currentWorkoutRange.end),
        workoutService.getByPeriod(previousWorkoutRange.start, previousWorkoutRange.end)
    ]);

    return {
        metrics: {
            today: currentMetricsResponse?.data?.data?.detailedMetrics?.[0] ?? null,
            yesterday: previousMetricsResponse?.data?.data?.detailedMetrics?.[0] ?? null
        },
        activeMinutes: {
            today: getTotalActiveMinutes(currentWorkoutsResponse?.data?.data ?? []),
            yesterday: getTotalActiveMinutes(previousWorkoutsResponse?.data?.data ?? [])
        }
    };
};

const useDashboardMetrics = (selectedDate) => {
    const [metrics, setMetrics] = useState(EMPTY_METRICS);
    const [activeMinutes, setActiveMinutes] = useState(EMPTY_ACTIVE_MINUTES);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isCancelled = false;

        const loadDashboardMetrics = async () => {
            setIsLoading(true);
            setError("");

            try {
                const data = await getMetricsForDate(selectedDate);

                if (isCancelled) {
                    return;
                }

                setMetrics(data.metrics);
                setActiveMinutes(data.activeMinutes);
            } catch (loadError) {
                if (isCancelled) {
                    return;
                }

                setMetrics(EMPTY_METRICS);
                setActiveMinutes(EMPTY_ACTIVE_MINUTES);
                setError(loadError?.response?.data?.message || "Failed to load dashboard data");
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadDashboardMetrics();

        return () => {
            isCancelled = true;
        };
    }, [selectedDate]);

    return {
        metrics,
        activeMinutes,
        isLoading,
        error
    };
};

export default useDashboardMetrics;
