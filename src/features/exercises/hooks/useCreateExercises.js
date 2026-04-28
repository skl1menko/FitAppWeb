import { useRef, useState } from "react";
import exercisesService from "../../../services/exercisesService";

const useCreateExercise = ({ onClose, onCreated } = {}) => {
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const fileInputRef = useRef(null);
    const isCreateInFlightRef = useRef(false);
    const [newExercise, setNewExercise] = useState({
        name: "",
        muscleGroup: "",
        description: "",
        imageUrl: "",
        imageFile: null
    });

    const handleCreateInput = (field, value) => {
        setNewExercise((prev) => ({
            ...prev,
            [field]: value
        }));
        setFieldErrors((prev) => ({
            ...prev,
            [field]: ""
        }));
    };

    const resetCreateForm = () => {
        setNewExercise({
            name: "",
            muscleGroup: "",
            description: "",
            imageUrl: "",
            imageFile: null
        });
        setImagePreviewUrl("");
        setCreateError("");
        setFieldErrors({});
    };

    const handleImageFileChange = (file) => {
        handleCreateInput("imageFile", file || null);

        if (!file) {
            setImagePreviewUrl("");
            return;
        }

        setImagePreviewUrl(URL.createObjectURL(file));
    };

    const handleClose = () => {
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
            nextFieldErrors.name = "Exercise name is required";
        }

        if (!newExercise.muscleGroup.trim()) {
            nextFieldErrors.muscleGroup = "Muscle group is required";
        }

        if (!newExercise.imageFile && !newExercise.imageUrl.trim()) {
            nextFieldErrors.imageFile = "Upload image file or provide image URL";
        }

        if (!newExercise.imageFile && newExercise.imageUrl.trim()) {
            try {
                new URL(newExercise.imageUrl.trim());
            } catch (error) {
                nextFieldErrors.imageUrl = "Invalid image URL";
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
                        setFieldErrors({ imageFile: "Image upload failed, please try again" });
                        return;
                    }
                } catch (error) {
                    const message = error?.message || "Image upload failed, please try again";
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
                handleClose();
            }
        } catch {
            setCreateError("Failed to create exercise");
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

