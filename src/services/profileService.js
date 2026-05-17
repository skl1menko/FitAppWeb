import axios from "axios";
import api from "./api";
import authService from "./authService";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "daehniaa8";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const DEFAULT_BODY_MEASUREMENTS = {
    height: "",
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    biceps: ""
};

const MEASUREMENT_FIELD_MAP = {
    weight: "body_weight",
    height: "height",
    chest: "chest",
    waist: "waist",
    hips: "hips",
    biceps: "biceps"
};

const formatDateParam = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const normalizeUser = (payload = {}) => ({
    id: payload.userId || payload.id || payload.athleteId || payload.trainerId || null,
    fullName: payload.fullName || payload.full_name || payload.name || "",
    email: payload.email || "",
    role: payload.role || "",
    avatarUrl: payload.avatarUrl || payload.avatar_url || payload.photoUrl || payload.photo_url || ""
});

const mergeProfileSources = (profileResponseUser = {}) => {
    const authUser = authService.getUser() || {};
    const normalizedResponseUser = normalizeUser(profileResponseUser);

    return {
        ...normalizeUser(authUser),
        ...normalizedResponseUser
    };
};

const profileService = {
    getDefaultBodyMeasurements: () => ({...DEFAULT_BODY_MEASUREMENTS}),

    uploadProfileImage: async (file) => {
        if (!file) {
            throw new Error("Image file is required");
        }

        if (!CLOUDINARY_UPLOAD_PRESET) {
            throw new Error("Missing VITE_CLOUDINARY_UPLOAD_PRESET in frontend env");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", "fitapp/profiles");

        const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
        const response = await axios.post(uploadUrl, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return response?.data?.secure_url || "";
    },

    getProfile: async () => {
        const profileResponse = await api.get("/auth/profile");
        const responseUser = profileResponse?.data?.data || profileResponse?.data || {};
        const profile = mergeProfileSources(responseUser);
        authService.mergeUser(profile);

        let latestMeasurement = {};
        try {
            const measurementResponse = await api.get("/body-measurements/latest");
            latestMeasurement = measurementResponse?.data?.data || measurementResponse?.data || {};
        } catch (error) {
            if (Number(error?.response?.status) !== 404) {
                throw error;
            }
        }

        return {
            profile,
            bodyMeasurements: {
                ...DEFAULT_BODY_MEASUREMENTS,
                weight: latestMeasurement.bodyWeight ?? "",
                height: latestMeasurement.height ?? "",
                chest: latestMeasurement.chest ?? "",
                waist: latestMeasurement.waist ?? "",
                hips: latestMeasurement.hips ?? "",
                biceps: latestMeasurement.biceps ?? ""
            }
        };
    },

    getMeasurementProgress: async (fieldKey, monthsBack = 6) => {
        const apiField = MEASUREMENT_FIELD_MAP[fieldKey];
        if (!apiField) {
            throw new Error("Unsupported measurement field");
        }

        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - monthsBack);

        const response = await api.get("/body-measurements/progress", {
            params: {
                field: apiField,
                startDate: formatDateParam(startDate),
                endDate: formatDateParam(endDate)
            }
        });

        return response?.data?.data || {};
    },

    saveProfile: async ({fullName, email, avatarUrl}) => {
        const profilePayload = {
            full_name: fullName,
            email,
            avatar_url: avatarUrl
        };

        const response = await api.put("/auth/profile", profilePayload);
        const responseUser = response?.data?.data || response?.data || {};
        const mergedProfile = mergeProfileSources({
            ...responseUser,
            fullName,
            email,
            avatarUrl
        });

        authService.mergeUser(mergedProfile);

        return {profile: mergedProfile, savedToServer: true};
    },

    saveBodyMeasurements: async (bodyMeasurements) => {
        const normalizedMeasurements = {
            ...DEFAULT_BODY_MEASUREMENTS,
            ...bodyMeasurements
        };

        const payload = {
            bodyWeight: normalizedMeasurements.weight || null,
            height: normalizedMeasurements.height || null,
            chest: normalizedMeasurements.chest || null,
            waist: normalizedMeasurements.waist || null,
            hips: normalizedMeasurements.hips || null,
            biceps: normalizedMeasurements.biceps || null
        };

        await api.post("/body-measurements", payload);

        return {bodyMeasurements: normalizedMeasurements, savedToServer: true};
    }
};

export default profileService;
