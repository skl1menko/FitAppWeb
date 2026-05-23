import axios from "axios";
import api from "../api";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "daehniaa8";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const extractResponseData = (response) => response?.data?.data || response?.data || {};

const uploadProfileImage = async (file) => {
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
};

const getProfile = async () => {
    const response = await api.get("/auth/profile");
    return extractResponseData(response);
};

const getLatestBodyMeasurements = async () => {
    const response = await api.get("/body-measurements/latest");
    return extractResponseData(response);
};

const getMeasurementProgress = async (params) => {
    const response = await api.get("/body-measurements/progress", {params});
    return extractResponseData(response);
};

const saveProfile = async (payload) => {
    const response = await api.put("/auth/profile", payload);
    return extractResponseData(response);
};

const saveBodyMeasurements = async (payload) => {
    const response = await api.post("/body-measurements", payload);
    return extractResponseData(response);
};

const profileApi = {
    uploadProfileImage,
    getProfile,
    getLatestBodyMeasurements,
    getMeasurementProgress,
    saveProfile,
    saveBodyMeasurements
};

export default profileApi;
