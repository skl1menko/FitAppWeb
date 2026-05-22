export const normalizePlannedDate = (value) => {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        return null;
    }

    const normalized = new Date(value);
    normalized.setHours(12, 0, 0, 0);
    return normalized;
};

export const formatPlanDate = (value) => {
    if (!value) {
        return "";
    }

    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
};

export const formatWorkoutDateTime = (value) => {
    if (!value) {
        return "Starts when launched";
    }

    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
};

export const isWorkoutCompleted = (workout) => {
    return Boolean(workout?.endTime);
};
