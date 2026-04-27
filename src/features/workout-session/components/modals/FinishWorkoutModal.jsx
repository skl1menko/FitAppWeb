import CustomBtn from "../../../../components/CustomBtn";
import "./FinishWorkoutModal.scss";
import { formatGroupedNumber } from "../../../../utils/formatNumber";

const FinishWorkoutModal = ({
    isOpen,
    workoutName,
    workoutNameError,
    timeText,
    tonnage,
    setsCount,
    onClose,
    onCancel,
    onSave,
    onWorkoutNameChange
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="finish-workout-modal" role="dialog" aria-modal="true" aria-labelledby="finish-workout-title">
            <button className="finish-workout-backdrop" onClick={onClose} aria-label="Close finish workout confirmation" />
            <div className="finish-workout-modal-card">
                <h2 id="finish-workout-title">Finish Workout</h2>
                <p>Name your workout and review summary before saving.</p>
                <label className="finish-workout-name-label" htmlFor="finish-workout-name">Workout name</label>
                <input
                    id="finish-workout-name"
                    className="finish-workout-name-input"
                    type="text"
                    placeholder="For example: Leg Day"
                    value={workoutName}
                    onChange={(event) => onWorkoutNameChange(event.target.value)}
                />
                {workoutNameError && <p className="finish-workout-name-error">{workoutNameError}</p>}

                <div className="finish-workout-stats">
                    <div className="finish-workout-stat-row">
                        <span>Time</span>
                        <strong>{timeText}</strong>
                    </div>
                    <div className="finish-workout-stat-row">
                        <span>Tonnage</span>
                        <strong>{formatGroupedNumber(tonnage)} kg</strong>
                    </div>
                    <div className="finish-workout-stat-row">
                        <span>Sets</span>
                        <strong>{setsCount}</strong>
                    </div>
                </div>
                <div className="finish-workout-actions">
                    <button className="cancel-finish-btn" onClick={onClose}>Cancel</button>
                    <CustomBtn text="Save" onClick={onSave} className="save-finish-btn" />
                </div>
            </div>
        </div>
    );
};

export default FinishWorkoutModal;
