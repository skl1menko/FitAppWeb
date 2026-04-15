import { useMemo, useRef, useState } from "react";
import { FiCamera } from "../../../assets/icons";
import exercisesService from "../../../services/exercisesService";
import "./CreateExerciseModal.scss";

const CreateExerciseModal = ({ isOpen, onClose, onCreated, muscleGroups = [] }) => {
    const [isMuscleDropdownOpen, setIsMuscleDropdownOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const fileInputRef = useRef(null);
    const [newExercise, setNewExercise] = useState({
        name: "",
        muscleGroup: "",
        description: "",
        imageUrl: "",
        imageFile: null
    });

    const selectedMuscleOption = useMemo(() => {
        return muscleGroups.find((group) => group.value === newExercise.muscleGroup) || null;
    }, [muscleGroups, newExercise.muscleGroup]);

    const handleCreateInput = (field, value) => {
        setNewExercise((prev) => ({ ...prev, [field]: value }));
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const resetCreateForm = () => {
        setNewExercise({
            name: "",
            muscleGroup: "",
            description: "",
            imageUrl: "",
            imageFile: null
        });
        setIsMuscleDropdownOpen(false);
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
            } catch {
                nextFieldErrors.imageUrl = "Enter a valid image URL";
            }
        }

        if (Object.keys(nextFieldErrors).length > 0) {
            setFieldErrors(nextFieldErrors);
            return;
        }

        let imageUrl = newExercise.imageUrl.trim();
        if (newExercise.imageFile) {
            try {
                const uploadResponse = await exercisesService.uploadImage(newExercise.imageFile);
                imageUrl = uploadResponse?.data?.secure_url || uploadResponse?.data?.data?.imageUrl || "";
                if (!imageUrl) {
                    setFieldErrors({ imageFile: "Image upload failed" });
                    return;
                }
            } catch (error) {
                const message = error?.message || "Could not upload image file";
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

        setIsCreating(true);
        try {
            const response = await exercisesService.create(payload);
            const created = response?.data?.data;
            if (created) {
                onCreated?.(created);
                handleClose();
            }
        } catch {
            setCreateError("Failed to create exercise");
        } finally {
            setIsCreating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="create-exercise-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Create custom exercise"
        >
            <div className="create-exercise-backdrop" onClick={handleClose} />
            <form className="create-exercise-form" onSubmit={handleCreateExercise}>
                <div className="create-form-head">
                    <h2>Create New Exercise</h2>
                    <button
                        type="button"
                        className="close-create-modal"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        x
                    </button>
                </div>

                <div className="image-upload-block">
                    <button
                        type="button"
                        className="image-upload-circle"
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Upload exercise image"
                    >
                        {imagePreviewUrl ? (
                            <img src={imagePreviewUrl} alt="Exercise preview" />
                        ) : (
                            <FiCamera />
                        )}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden-file-input"
                        onChange={(e) => handleImageFileChange(e.target.files?.[0] || null)}
                    />
                    <p>Tap the circle to upload a photo</p>
                    {fieldErrors.imageFile ? <p className="field-error">{fieldErrors.imageFile}</p> : null}
                </div>


                <div className="create-grid">
                    <label className="field">
                        <span>Exercise name</span>
                        <input
                            type="text"
                            value={newExercise.name}
                            onChange={(e) => handleCreateInput("name", e.target.value)}
                            placeholder="e.g. Cable Fly"
                        />
                        {fieldErrors.name ? <p className="field-error">{fieldErrors.name}</p> : null}
                    </label>


                    <div className="field">
                        <span>Muscle group</span>
                        <div className={`muscle-group-dropdown ${isMuscleDropdownOpen ? "open" : ""}`}>
                            <button
                                type="button"
                                className="muscle-group-trigger"
                                onClick={() => setIsMuscleDropdownOpen((prev) => !prev)}
                            >
                                {selectedMuscleOption ? (
                                    <>
                                        <img src={selectedMuscleOption.imageUrl} alt={selectedMuscleOption.label} />
                                        <span>{selectedMuscleOption.label}</span>
                                    </>
                                ) : (
                                    <span className="placeholder">Choose muscle group</span>
                                )}
                                <span className="chevron">v</span>
                            </button>

                            {isMuscleDropdownOpen ? (
                                <div className="muscle-group-menu">
                                    {muscleGroups.map((group) => (
                                        <button
                                            key={group.value}
                                            type="button"
                                            className={`muscle-group-option ${newExercise.muscleGroup === group.value ? "active" : ""}`}
                                            onClick={() => {
                                                handleCreateInput("muscleGroup", group.value);
                                                setIsMuscleDropdownOpen(false);
                                            }}
                                        >
                                            <img src={group.imageUrl} alt={group.label} />
                                            <span>{group.label}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                        {fieldErrors.muscleGroup ? <p className="field-error">{fieldErrors.muscleGroup}</p> : null}
                    </div>

                    <label className="field">
                        <span>Description (optional)</span>
                        <input
                            value={newExercise.description}
                            onChange={(e) => handleCreateInput("description", e.target.value)}
                            rows={3}
                            placeholder="Short exercise description"
                        />
                    </label>
                </div>


                <label className="field">
                    <span>Or paste image URL</span>
                    <input
                        type="url"
                        value={newExercise.imageUrl}
                        onChange={(e) => handleCreateInput("imageUrl", e.target.value)}
                        placeholder="https://..."
                    />
                    {fieldErrors.imageUrl ? <p className="field-error">{fieldErrors.imageUrl}</p> : null}
                </label>

                {createError ? <p className="create-error">{createError}</p> : null}

                <div className="create-actions">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button type="submit" disabled={isCreating}>
                        {isCreating ? "Creating..." : "Add Exercise"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateExerciseModal;
