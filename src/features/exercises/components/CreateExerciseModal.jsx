import { FiCamera } from "../../../assets/icons";
import "./CreateExerciseModal.scss";
import useCreateExercise from "../hooks/useCreateExercises";
import MuscleGroupSelect from "../../../components/MuscleGroupSelect";
import { useTranslation } from "react-i18next";

const CreateExerciseModal = ({ isOpen, onClose, onCreated, muscleGroups = [] }) => {
    const { t } = useTranslation();
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
            aria-label={t('exercises.createModal.dialogAria')}
        >
            <div className="create-exercise-backdrop" onClick={handleClose} />
            <form className="create-exercise-form" onSubmit={handleCreateExercise}>
                <div className="create-form-head">
                    <h2>{t('exercises.createModal.title')}</h2>
                    <button
                        type="button"
                        className="close-create-modal"
                        onClick={handleClose}
                        disabled={isCreating}
                        aria-label={t('exercises.createModal.closeAria')}
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
                        aria-label={t('exercises.createModal.uploadAria')}
                        disabled={isCreating}
                    >
                        {imagePreviewUrl ? (
                            <img src={imagePreviewUrl} alt={t('exercises.createModal.previewAlt')} />
                        ) : (
                            <FiCamera />
                        )}
                    </button>
                    
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden-file-input"
                        disabled={isCreating}
                        onChange={(e) => handleImageFileChange(e.target.files?.[0] || null)}
                    />
                    <p>{t('exercises.createModal.uploadHint')}</p>
                    
                </div>


                <div className="create-grid">
                    <label className="field">
                        <span>{t('exercises.createModal.exerciseName')}</span>
                        <input
                            type="text"
                            value={newExercise.name}
                            onChange={(e) => handleCreateInput("name", e.target.value)}
                            placeholder={t('exercises.createModal.exerciseNamePlaceholder')}
                            disabled={isCreating}
                            aria-invalid={Boolean(fieldErrors.name)}
                        />
                        {fieldErrors.name ? <p className="field-error">{fieldErrors.name}</p> : null}
                    </label>


                    <div className="field">
                        <span>{t('exercises.createModal.muscleGroup')}</span>
                        <MuscleGroupSelect
                            groups={muscleGroups}
                            value={newExercise.muscleGroup}
                            onChange={(groupValue) => handleCreateInput("muscleGroup", groupValue)}
                            placeholder={t('exercises.createModal.muscleGroupPlaceholder')}
                            disabled={isCreating}
                        />
                        {fieldErrors.muscleGroup ? <p className="field-error">{fieldErrors.muscleGroup}</p> : null}
                    </div>

                    <label className="field">
                        <span>{t('exercises.createModal.description')}</span>
                        <textarea
                            value={newExercise.description}
                            onChange={(e) => handleCreateInput("description", e.target.value)}
                            rows={3}
                            placeholder={t('exercises.createModal.descriptionPlaceholder')}
                            disabled={isCreating}
                        />
                    </label>
                </div>


                <label className="field">
                    <span>{t('exercises.createModal.imageUrl')}</span>
                    <input
                        type="url"
                        value={newExercise.imageUrl}
                        onChange={(e) => handleCreateInput("imageUrl", e.target.value)}
                        placeholder={t('exercises.createModal.imageUrlPlaceholder')}
                        disabled={isCreating}
                        aria-invalid={Boolean(fieldErrors.imageUrl)}
                    />
                    {fieldErrors.imageUrl ? <p className="field-error">{fieldErrors.imageUrl}</p> : null}
                </label>

                {createError ? <p className="create-error">{createError}</p> : null}

                <div className="create-actions">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={handleClose}
                        disabled={isCreating}
                    >
                        {t('exercises.createModal.cancel')}
                    </button>
                    <button type="submit" disabled={isCreating}>
                        {isCreating ? t('exercises.createModal.creating') : t('exercises.createModal.addExercise')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateExerciseModal;
