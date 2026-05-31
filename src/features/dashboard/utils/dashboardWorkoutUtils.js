import dayjs from "dayjs";
import {formatDateOnly, getDateOnlyKey} from "../../../utils/dateOnly";

export const getWorkoutStartTime = (workout) => {
    return workout?.startTime ?? workout?.start_time ?? null;
};

export const getWorkoutEndTime = (workout) => {
    return workout?.endTime ?? workout?.end_time ?? null;
};

export const getWorkoutDurationMinutes = (workout) => {
    const startTime = getWorkoutStartTime(workout);
    const endTime = getWorkoutEndTime(workout);

    if (!startTime || !endTime) {
        return null;
    }

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
        return null;
    }

    return Math.round((end - start) / 60000);
};

export const getWorkoutDateKey = (workout) => {
    const startTime = getWorkoutStartTime(workout);

    if (!startTime) {
        return null;
    }

    return getDateOnlyKey(startTime);
};

export const formatWorkoutTime = (workout) => {
    const startTime = getWorkoutStartTime(workout);

    if (!startTime) {
        return "No time";
    }

    return dayjs(startTime).format("HH:mm");
};

export const formatRelativeWorkoutDate = (workout) => {
    const startTime = getWorkoutStartTime(workout);

    if (!startTime) {
        return "";
    }

    const date = new Date(startTime);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const timeLabel = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });

    if (date.toDateString() === today.toDateString()) {
        return `Today, ${timeLabel}`;
    }

    if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${timeLabel}`;
    }

    return `${formatDateOnly(startTime, "en-US", { month: "short", day: "numeric" })}, ${timeLabel}`;
};
