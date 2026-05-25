import {useCallback, useEffect, useRef, useState} from "react";
import { useTranslation } from "react-i18next";
import profileService from "../../services/profileService";
import {normalizeProfileProgressData} from "./utils/profileProgressUtils";

const useProfilePage = (measurementFields) => {
    const { t, i18n } = useTranslation();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        avatarUrl: ""
    });
    const [bodyMeasurements, setBodyMeasurements] = useState(profileService.getDefaultBodyMeasurements());
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [activeProgressField, setActiveProgressField] = useState("weight");
    const [progressData, setProgressData] = useState([]);
    const [isProgressLoading, setIsProgressLoading] = useState(true);

    const refreshProgress = useCallback(async (fieldKey = activeProgressField) => {
        setIsProgressLoading(true);

        try {
            const response = await profileService.getMeasurementProgress(fieldKey);
            const points = Array.isArray(response?.progressData) ? response.progressData : [];
            const unit = measurementFields.find((field) => field.key === fieldKey)?.unit || "";
            setProgressData(normalizeProfileProgressData(points, unit, i18n.resolvedLanguage));
        } catch {
            setProgressData([]);
        } finally {
            setIsProgressLoading(false);
        }
    }, [activeProgressField, i18n.resolvedLanguage, measurementFields]);

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            setError("");

            try {
                const response = await profileService.getProfile();
                setFormData({
                    fullName: response.profile?.fullName || "",
                    email: response.profile?.email || "",
                    avatarUrl: response.profile?.avatarUrl || ""
                });
                setBodyMeasurements(response.bodyMeasurements);
            } catch {
                setError(t("profile.errors.loadProfileFailed"));
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [t]);

    useEffect(() => {
        refreshProgress(activeProgressField);
    }, [activeProgressField, refreshProgress]);

    useEffect(() => (
        () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        }
    ), [previewUrl]);

    const handleProfileChange = (field, value) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value
        }));
    };

    const handleMeasurementChange = (field, value) => {
        setBodyMeasurements((previous) => ({
            ...previous,
            [field]: value
        }));
    };

    const handleAvatarButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setError("");
        setMessage("");
        setAvatarFile(file);

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        const nextPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(nextPreviewUrl);
        handleProfileChange("avatarUrl", nextPreviewUrl);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedName = formData.fullName.trim();
        if (!trimmedName) {
            setError(t("profile.errors.nameRequired"));
            return;
        }

        setIsSaving(true);
        setError("");
        setMessage("");

        try {
            let avatarUrlToSave = formData.avatarUrl;

            if (avatarFile) {
                avatarUrlToSave = await profileService.uploadProfileImage(avatarFile);
            }

            const [profileResult, measurementsResult] = await Promise.all([
                profileService.saveProfile({
                    fullName: trimmedName,
                    email: formData.email,
                    avatarUrl: avatarUrlToSave
                }),
                profileService.saveBodyMeasurements(bodyMeasurements)
            ]);

            setFormData((previous) => ({
                ...previous,
                fullName: profileResult.profile?.fullName || trimmedName,
                avatarUrl: profileResult.profile?.avatarUrl || avatarUrlToSave || previous.avatarUrl
            }));
            setAvatarFile(null);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl("");
            }
            setMessage(profileResult.savedToServer && measurementsResult.savedToServer
                ? t("profile.success.profileUpdated")
                : t("profile.success.profileUpdated"));
            await refreshProgress();
        } catch {
            setError(t("profile.errors.saveProfileFailed"));
        } finally {
            setIsSaving(false);
        }
    };

    return {
        fileInputRef,
        formData,
        bodyMeasurements,
        isLoading,
        isSaving,
        message,
        error,
        activeProgressField,
        progressData,
        isProgressLoading,
        setActiveProgressField,
        handleProfileChange,
        handleMeasurementChange,
        handleAvatarButtonClick,
        handleAvatarChange,
        handleSubmit
    };
};

export default useProfilePage;
