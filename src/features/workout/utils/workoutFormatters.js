import {formatDateOnly} from "../../../utils/dateOnly";

export const formatWorkoutDuration = (startValue, endValue, fallback = null) => {
    if (!startValue || !endValue) {
        return fallback;
    }

    const start = new Date(startValue).getTime();
    const end = new Date(endValue).getTime();

    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
        return fallback;
    }

    const totalMinutes = Math.floor((end - start) / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} h`;
    return `${hours} h ${minutes} min`;
};

export const formatWorkoutDate = (dateValue, locale = "en-US") => {
    if (!dateValue) {
        return "";
    }

    return formatDateOnly(dateValue, locale, {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
};

export const formatScheduledTime = (dateValue, locale = "en-US") => {
    if (!dateValue) {
        return "Starts when launched";
    }

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) {
        return "Starts when launched";
    }

    return parsedDate.toLocaleString(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};
