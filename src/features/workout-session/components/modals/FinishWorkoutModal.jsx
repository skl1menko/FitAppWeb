import CustomBtn from "../../../../components/CustomBtn";
import "./FinishWorkoutModal.scss";
import { formatGroupedNumber } from "../../../../utils/formatNumber";
import { useTranslation } from "react-i18next";

const FinishWorkoutModal = ({
    isOpen,
    workoutName,
    workoutNameError,
    timeText,
    tonnage,
    setsCount,
    onClose,
    onSave,
    onWorkoutNameChange
}) => {
    const { t } = useTranslation();

    if (!isOpen) {
        return null;
    }

    return (
        <div className="finish-workout-modal" role="dialog" aria-modal="true" aria-labelledby="finish-workout-title">
            <button className="finish-workout-backdrop" onClick={onClose} aria-label={t('workout_session.finishModal.closeAria')} />
            <div className="finish-workout-modal-card">
                <h2 id="finish-workout-title">{t('workout_session.finishModal.title')}</h2>
                <p>{t('workout_session.finishModal.description')}</p>
                <label className="finish-workout-name-label" htmlFor="finish-workout-name">{t('workout_session.finishModal.workoutName')}</label>
                <input
                    id="finish-workout-name"
                    className="finish-workout-name-input"
                    type="text"
                    placeholder={t('workout_session.finishModal.placeholder')}
                    value={workoutName}
                    onChange={(event) => onWorkoutNameChange(event.target.value)}
                />
                {workoutNameError && <p className="finish-workout-name-error">{workoutNameError}</p>}

                <div className="finish-workout-stats">
                    <div className="finish-workout-stat-row">
                        <span>{t('workout_session.workoutSessionInfo.time')}</span>
                        <strong>{timeText}</strong>
                    </div>
                    <div className="finish-workout-stat-row">
                        <span>{t('workout_session.workoutSessionInfo.tonnage')}</span>
                        <strong>{formatGroupedNumber(tonnage)} {t('workout_session.common.kg')}</strong>
                    </div>
                    <div className="finish-workout-stat-row">
                        <span>{t('workout_session.finishModal.sets')}</span>
                        <strong>{setsCount}</strong>
                    </div>
                </div>
                <div className="finish-workout-actions">
                    <button className="cancel-finish-btn" onClick={onClose}>{t('workout_session.common.cancel')}</button>
                    <CustomBtn text={t('workout_session.common.save')} onClick={onSave} className="save-finish-btn" />
                </div>
            </div>
        </div>
    );
};

export default FinishWorkoutModal;
