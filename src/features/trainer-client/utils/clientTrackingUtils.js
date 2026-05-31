import { transformMetrics, transformMonthMetrics } from "../../dashboard/components/ActivityOverview/chartUtils";
import {formatDateOnly} from "../../../utils/dateOnly";

export const getMeasurementFields = (t) => [
    { key: "body_weight", label: t("trainer_clients.measurements.fields.body_weight"), unit: t("trainer_clients.measurements.units.kg") },
    { key: "height", label: t("trainer_clients.measurements.fields.height"), unit: t("trainer_clients.measurements.units.cm") },
    { key: "chest", label: t("trainer_clients.measurements.fields.chest"), unit: t("trainer_clients.measurements.units.cm") },
    { key: "waist", label: t("trainer_clients.measurements.fields.waist"), unit: t("trainer_clients.measurements.units.cm") },
    { key: "hips", label: t("trainer_clients.measurements.fields.hips"), unit: t("trainer_clients.measurements.units.cm") },
    { key: "biceps", label: t("trainer_clients.measurements.fields.biceps"), unit: t("trainer_clients.measurements.units.cm") }
];

export const formatDateInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const isNotFoundError = (error) => Number(error?.response?.status) === 404;

export const formatWorkoutDuration = (startValue, endValue, t) => {
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
    const minLabel = t ? t("trainer_clients.duration.min") : "min";
    const hourLabel = t ? t("trainer_clients.duration.hour") : "h";

    if (hours === 0) {
        return `${minutes} ${minLabel}`;
    }

    if (minutes === 0) {
        return `${hours} ${hourLabel}`;
    }

    return `${hours} ${hourLabel} ${minutes} ${minLabel}`;
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

const getLocale = (language = "en") => language === "uk" ? "uk-UA" : "en-GB";

export const formatMeasurementLabel = (dateValue, language = "en") => {
    return formatDateOnly(dateValue, getLocale(language), {
        day: "2-digit",
        month: "short"
    });
};

export const formatMeasurementDateTime = (dateValue, language = "en") => {
    return formatDateOnly(dateValue, getLocale(language), {
        day: "2-digit",
        month: "short"
    });
};

export const formatTrackingCardDate = (dateValue, locale = "en-US") => (
    formatDateOnly(dateValue, locale, {
        month: "short",
        day: "numeric",
        year: "numeric"
    })
);
