const fmt = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

export const getWeekRange = (offset) => {
    const monday = new Date();
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7) + offset * 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { startDate: fmt(monday), endDate: fmt(sunday), mondayDate: monday, sundayDate: sunday };
};

export const getWeekLabel = (offset) => {
    const { mondayDate, sundayDate } = getWeekRange(offset);
    return `${mondayDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${sundayDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
};

export const getMonthRange = (offset) => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const last = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
    return { startDate: fmt(first), endDate: fmt(last), firstDate: first };
};

export const getMonthLabel = (offset) => {
    const { firstDate } = getMonthRange(offset);
    return firstDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};
