export const DEFAULT_BODY_MEASUREMENTS = {
    height: "",
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    biceps: ""
};

export const MEASUREMENT_FIELD_MAP = {
    weight: "body_weight",
    height: "height",
    chest: "chest",
    waist: "waist",
    hips: "hips",
    biceps: "biceps"
};

export const formatProfileDateParam = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const normalizeProfileUser = (payload = {}) => ({
    id: payload.userId || payload.id || payload.athleteId || payload.trainerId || null,
    fullName: payload.fullName || payload.full_name || payload.name || "",
    email: payload.email || "",
    role: payload.role || "",
    avatarUrl: payload.avatarUrl || payload.avatar_url || payload.photoUrl || payload.photo_url || ""
});

export const mergeProfileSources = (authUser = {}, profileResponseUser = {}) => ({
    ...normalizeProfileUser(authUser),
    ...normalizeProfileUser(profileResponseUser)
});

export const normalizeProfileBodyMeasurements = (latestMeasurement = {}) => ({
    ...DEFAULT_BODY_MEASUREMENTS,
    weight: latestMeasurement.bodyWeight ?? "",
    height: latestMeasurement.height ?? "",
    chest: latestMeasurement.chest ?? "",
    waist: latestMeasurement.waist ?? "",
    hips: latestMeasurement.hips ?? "",
    biceps: latestMeasurement.biceps ?? ""
});

export const buildSaveProfilePayload = ({fullName, email, avatarUrl}) => ({
    full_name: fullName,
    email,
    avatar_url: avatarUrl
});

export const normalizeSaveProfileResult = (responseUser = {}, fallbackProfile = {}, authUser = {}) => (
    mergeProfileSources(authUser, {
        ...responseUser,
        ...fallbackProfile
    })
);

export const buildBodyMeasurementsPayload = (bodyMeasurements = {}) => {
    const normalizedMeasurements = {
        ...DEFAULT_BODY_MEASUREMENTS,
        ...bodyMeasurements
    };

    return {
        normalizedMeasurements,
        payload: {
            bodyWeight: normalizedMeasurements.weight || null,
            height: normalizedMeasurements.height || null,
            chest: normalizedMeasurements.chest || null,
            waist: normalizedMeasurements.waist || null,
            hips: normalizedMeasurements.hips || null,
            biceps: normalizedMeasurements.biceps || null
        }
    };
};
