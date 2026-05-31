import {formatDateOnly} from "../../../utils/dateOnly";

const getLocale = (language = "en") => language === "uk" ? "uk-UA" : "en-GB";

export const formatProfileProgressLabel = (dateValue, language = "en") => {
    if (!dateValue) {
        return "";
    }

    return formatDateOnly(dateValue, getLocale(language), {
        day: "2-digit",
        month: "short"
    });
};

export const formatProfileProgressDateTime = (dateValue, language = "en") => {
    if (!dateValue) {
        return "";
    }

    return formatDateOnly(dateValue, getLocale(language), {
        day: "2-digit",
        month: "short"
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
