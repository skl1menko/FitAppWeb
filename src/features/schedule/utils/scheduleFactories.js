const createWorkoutId = () => {
    if (typeof crypto !== "undefined") {
        if (typeof crypto.randomUUID === "function") {
            return crypto.randomUUID();
        }

        if (typeof crypto.getRandomValues === "function") {
            const bytes = new Uint8Array(16);
            crypto.getRandomValues(bytes);
            return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
        }
    }

    return `workout-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const createWorkoutRow = () => ({
    id: createWorkoutId(),
    name: "",
    startTime: null,
    showDate: false
});
