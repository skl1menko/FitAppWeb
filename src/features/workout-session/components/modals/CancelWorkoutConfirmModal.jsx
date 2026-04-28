import "./CancelWorkoutConfirmModal.scss";

const CancelWorkoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="cancel-workout-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-workout-title">
            <button
                className="cancel-workout-backdrop"
                onClick={onClose}
                aria-label="Close cancel workout confirmation"
            />
            <div className="cancel-workout-modal-card">
                <h2 id="cancel-workout-title">Cancel Workout?</h2>
                <p>This will delete the current workout session and all unsaved progress. Are you sure?</p>
                <div className="cancel-workout-actions">
                    <button className="cancel-workout-no-btn" onClick={onClose}>No, keep workout</button>
                    <button className="cancel-workout-yes-btn" onClick={onConfirm}>Yes, cancel workout</button>
                </div>
            </div>
        </div>
    );
};

export default CancelWorkoutConfirmModal;
