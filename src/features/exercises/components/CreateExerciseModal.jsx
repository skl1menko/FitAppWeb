import { FiCamera } from "../../../assets/icons";
import "./CreateExerciseModal.scss";
import useCreateExercise from "../hooks/useCreateExercises";
import MuscleGroupSelect from "../../../components/MuscleGroupSelect";

const CreateExerciseModal = ({ isOpen, onClose, onCreated, muscleGroups = [] }) => {
    const {
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
    } = useCreateExercise({ onClose, onCreated });

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
                    {fieldErrors.imageFile ? <p className="field-error">{fieldErrors.imageFile}</p> : null}
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
                        <MuscleGroupSelect
                            groups={muscleGroups}
                            value={newExercise.muscleGroup}
                            onChange={(groupValue) => handleCreateInput("muscleGroup", groupValue)}
                            placeholder="Choose muscle group"
                        />
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
