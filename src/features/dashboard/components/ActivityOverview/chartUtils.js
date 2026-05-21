export const STAT_CONFIG = [
    { dataKey: "steps",     label: "Steps",      color: "#155DFC", unit: "" },
    { dataKey: "calories",  label: "Calories",   color: "#F97316", unit: " kcal" },
    { dataKey: "heartRate", label: "Heart Rate", color: "#ea2e67", unit: " bpm" },
];

export const PERIOD_CONFIG = [
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const buildWeekSkeleton = (startDate) => {
    const [y, mo, d] = startDate.split("-").map(Number);
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(y, mo - 1, d + i);
        return { day: DAY_NAMES[date.getDay()], steps: 0, calories: 0, heartRate: 0 };
    });
};

const buildMonthSkeleton = (startDate) => {
    const [y, mo] = startDate.split("-").map(Number);
    const daysInMonth = new Date(y, mo, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
        day: String(i + 1),
        steps: 0, calories: 0, heartRate: 0,
    }));
};

export const transformMetrics = (detailedMetrics, startDate, endDate) => {
    const skeleton = buildWeekSkeleton(startDate);
    const skeletonByDay = new Map(skeleton.map((item) => [item.day, item]));

    detailedMetrics.forEach((m) => {
        if (m.endDate < startDate || m.endDate > endDate) return;
        const [y, mo, d] = m.endDate.split("-").map(Number);
        const date = new Date(y, mo - 1, d);
        const dayName = DAY_NAMES[date.getDay()];

        const slot = skeletonByDay.get(dayName);
        if (slot) {
            slot.steps = m.totalStepCount ?? 0;
            slot.calories = Math.round(m.totalEnergyBurned ?? 0);
            slot.heartRate = Math.round(m.avgHeartRate ?? 0);
        }
    });
    return skeleton;
};

export const transformMonthMetrics = (detailedMetrics, startDate, endDate) => {
    const skeleton = buildMonthSkeleton(startDate);
    const skeletonByDay = new Map(skeleton.map((item) => [item.day, item]));

    detailedMetrics.forEach((m) => {
        if (m.endDate < startDate || m.endDate > endDate) return;
        const dayNum = Number(m.endDate.split("-")[2]);
        const slot = skeletonByDay.get(String(dayNum));
        if (slot) {
            slot.steps = m.totalStepCount ?? 0;
            slot.calories = Math.round(m.totalEnergyBurned ?? 0);
            slot.heartRate = Math.round(m.avgHeartRate ?? 0);
        }
    });
    return skeleton;
};
