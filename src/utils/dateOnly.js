const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

export const getDateOnlyKey = (dateValue) => {
    if (!dateValue) {
        return "";
    }

    if (typeof dateValue === "string") {
        const match = dateValue.match(DATE_KEY_PATTERN);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const formatDateOnly = (dateValue, locale = "en-US", options = {}) => {
    const dateKey = getDateOnlyKey(dateValue);
    if (!dateKey) {
        return "";
    }

    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(locale, options);
};
