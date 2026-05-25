import { useEffect, useRef, useState } from "react";
import exercisesService from "../../../services/exercisesService";
import { useTranslation } from "react-i18next";

const INITIAL_FORM_STATE = {
    name: "",
    muscleGroup: "",
    description: "",
    imageUrl: "",
    imageFile: null
};

const getRequestErrorMessage = (error, fallbackMessage) => (
    error?.response?.data?.message
    || error?.response?.data?.error
    || error?.message
    || fallbackMessage
);

const useCreateExercise = ({ onClose, onCreated } = {}) => {
    const { t } = useTranslation();
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const fileInputRef = useRef(null);
    const isCreateInFlightRef = useRef(false);
    const previewUrlRef = useRef("");
    const [newExercise, setNewExercise] = useState(INITIAL_FORM_STATE);

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
            }
        };
    }, []);

    const handleCreateInput = (field, value) => {
        setNewExercise((prev) => ({
            ...prev,
            [field]: value
        }));
        setCreateError("");
        setFieldErrors((prev) => ({
            ...prev,
            [field]: ""
        }));
    };

    const clearPreviewUrl = () => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = "";
        }
    };

    const resetCreateForm = () => {
        clearPreviewUrl();
        setNewExercise(INITIAL_FORM_STATE);
        setImagePreviewUrl("");
        setCreateError("");
        setFieldErrors({});

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleImageFileChange = (file) => {
        handleCreateInput("imageFile", file || null);
        setFieldErrors((prev) => ({
            ...prev,
            imageFile: "",
            imageUrl: ""
        }));

        clearPreviewUrl();

        if (!file) {
            setImagePreviewUrl("");
            return;
        }

        const nextPreviewUrl = URL.createObjectURL(file);
        previewUrlRef.current = nextPreviewUrl;
        setImagePreviewUrl(nextPreviewUrl);
    };

    const handleClose = () => {
        if (isCreating) {
            return;
        }

        resetCreateForm();
        onClose?.();
    };

    const handleCreateExercise = async (event) => {
        event.preventDefault();

        if (isCreateInFlightRef.current) {
            return;
        }

        setCreateError("");
        setFieldErrors({});

        const nextFieldErrors = {};
        if (!newExercise.name.trim()) {
            nextFieldErrors.name = t('exercises.errors.exerciseNameRequired');
        }

        if (!newExercise.muscleGroup.trim()) {
            nextFieldErrors.muscleGroup = t('exercises.errors.muscleGroupRequired');
        }

        if (!newExercise.imageFile && !newExercise.imageUrl.trim()) {
            nextFieldErrors.imageFile = t('exercises.errors.uploadOrUrlRequired');
        }

        if (!newExercise.imageFile && newExercise.imageUrl.trim()) {
            try {
                new URL(newExercise.imageUrl.trim());
            } catch {
                nextFieldErrors.imageUrl = t('exercises.errors.invalidImageUrl');
            }
        }

        if (Object.keys(nextFieldErrors).length > 0) {
            setFieldErrors(nextFieldErrors);
            return;
        }

        isCreateInFlightRef.current = true;
        setIsCreating(true);
        try {
            let imageUrl = newExercise.imageUrl.trim();
            if (newExercise.imageFile) {
                try {
                    const uploadResponse = await exercisesService.uploadImage(newExercise.imageFile);
                    imageUrl = uploadResponse?.data?.secure_url || uploadResponse?.data?.data?.imageUrl || "";
                    if (!imageUrl) {
                        setFieldErrors({ imageFile: t('exercises.errors.imageUploadFailed') });
                        return;
                    }
                } catch (error) {
                    const message = getRequestErrorMessage(error, t('exercises.errors.imageUploadFailed'));
                    setFieldErrors({ imageFile: message });
                    return;
                }
            }

            const payload = {
                name: newExercise.name.trim(),
                muscle_group: newExercise.muscleGroup.trim(),
                description: newExercise.description.trim(),
                image_url: imageUrl,
                is_custom: true
            };

            const response = await exercisesService.create(payload);
            const created = response?.data?.data;
            if (created) {
                onCreated?.(created);
                resetCreateForm();
                onClose?.();
                return;
            }
            
            setCreateError(t('exercises.errors.createdButMissingRecord'));
        } catch (error) {
            setCreateError(getRequestErrorMessage(error, t('exercises.errors.createFailed')));
        } finally {
            isCreateInFlightRef.current = false;
            setIsCreating(false);
        }
    };

    return {
        newExercise,
        imagePreviewUrl,
        isCreating,
        createError,
        fieldErrors,
        fileInputRef,
        handleCreateInput,
        handleImageFileChange,
        handleCreateExercise,
        handleClose
    };
}

export default useCreateExercise;
