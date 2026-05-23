export const formatProfileProgressLabel = (dateValue) => {
    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short"
    });
};

export const formatProfileProgressDateTime = (dateValue) => {
    if (!dateValue) {
        return "";
    }

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

export const normalizeProfileProgressData = (points = [], unit = "") => (
    (Array.isArray(points) ? points : []).map((point) => ({
        chartKey: point.date,
        label: formatProfileProgressLabel(point.date),
        fullLabel: formatProfileProgressDateTime(point.date),
        date: point.date,
        value: Number(point.value) || 0,
        unit
    }))
);
