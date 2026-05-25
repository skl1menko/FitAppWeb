const getLocale = (language = "en") => language === "uk" ? "uk-UA" : "en-GB";

export const formatProfileProgressLabel = (dateValue, language = "en") => {
    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString(getLocale(language), {
        day: "2-digit",
        month: "short"
    });
};

export const formatProfileProgressDateTime = (dateValue, language = "en") => {
    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString(getLocale(language), {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
};

export const normalizeProfileProgressData = (points = [], unit = "", language = "en") => (
    (Array.isArray(points) ? points : []).map((point) => ({
        chartKey: point.date,
        label: formatProfileProgressLabel(point.date, language),
        fullLabel: formatProfileProgressDateTime(point.date, language),
        date: point.date,
        value: Number(point.value) || 0,
        unit
    }))
);
