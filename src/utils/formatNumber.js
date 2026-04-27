export const formatGroupedNumber = (value, options = {}) => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        return "0";
    }

    return numericValue.toLocaleString("en-US", options).replaceAll(",", " ");
};
