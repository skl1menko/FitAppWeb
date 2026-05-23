import { transformMetrics, transformMonthMetrics } from "../../dashboard/components/ActivityOverview/chartUtils";

export const MEASUREMENT_FIELDS = [
    { key: "body_weight", label: "Weight", unit: "kg" },
    { key: "height", label: "Height", unit: "cm" },
    { key: "chest", label: "Chest", unit: "cm" },
    { key: "waist", label: "Waist", unit: "cm" },
    { key: "hips", label: "Hips", unit: "cm" },
    { key: "biceps", label: "Biceps", unit: "cm" }
];

export const formatDateInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const isNotFoundError = (error) => Number(error?.response?.status) === 404;

export const formatWorkoutDuration = (startValue, endValue) => {
    if (!startValue || !endValue) {
        return "-";
    }

    const start = new Date(startValue).getTime();
    const end = new Date(endValue).getTime();

    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
        return "-";
    }

    const totalMinutes = Math.floor((end - start) / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
        return `${minutes} min`;
    }

    if (minutes === 0) {
        return `${hours} h`;
    }

    return `${hours} h ${minutes} min`;
};

const getWorkoutDateKey = (workout) => {
    const source = workout?.startTime || workout?.createdAt;
    if (!source) {
        return "";
    }

    return String(source).slice(0, 10);
};

const getWorkoutCalories = (workout) => Number(workout?.caloriesBurned) || 0;

const normalizeMetricPoint = (metric) => {
    const dateKey = String(metric.endDate || metric.startDate || metric.date || "").slice(0, 10);
    if (!dateKey) {
        return null;
    }

    return {
        endDate: dateKey,
        totalStepCount: Number(metric.totalStepCount) || 0,
        totalEnergyBurned: Number(metric.totalEnergyBurned) || 0,
        avgHeartRate: Number(metric.avgHeartRate) || 0
    };
};

export const buildChartData = (metrics, startDate, endDate, activePeriod) => {
    const normalized = metrics
        .map(normalizeMetricPoint)
        .filter(Boolean)
        .sort((a, b) => a.endDate.localeCompare(b.endDate));

    return activePeriod === 1
        ? transformMonthMetrics(normalized, startDate, endDate)
        : transformMetrics(normalized, startDate, endDate);
};

export const buildFallbackChartDataFromWorkouts = (workouts, startDate, endDate, activePeriod) => {
    const aggregated = workouts.reduce((acc, workout) => {
        const key = getWorkoutDateKey(workout);
        if (!key) {
            return acc;
        }

        acc.set(key, (acc.get(key) || 0) + getWorkoutCalories(workout));
        return acc;
    }, new Map());

    const pseudoMetrics = Array.from(aggregated.entries()).map(([endDate, calories]) => ({
        endDate,
        totalStepCount: 0,
        totalEnergyBurned: Math.round(calories),
        avgHeartRate: 0
    }));

    return buildChartData(pseudoMetrics, startDate, endDate, activePeriod);
};

export const formatMeasurementLabel = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short"
    });
};

export const formatMeasurementDateTime = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
};
