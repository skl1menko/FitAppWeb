import "./CancelWorkoutConfirmModal.scss";
import { useTranslation } from "react-i18next";

const CancelWorkoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    const { t } = useTranslation();

    if (!isOpen) {
        return null;
    }

    return (
        <div className="cancel-workout-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-workout-title">
            <button
                className="cancel-workout-backdrop"
                onClick={onClose}
                aria-label={t('workout_session.cancelModal.closeAria')}
            />
            <div className="cancel-workout-modal-card">
                <h2 id="cancel-workout-title">{t('workout_session.cancelModal.title')}</h2>
                <p>{t('workout_session.cancelModal.description')}</p>
                <div className="cancel-workout-actions">
                    <button className="cancel-workout-no-btn" onClick={onClose}>{t('workout_session.cancelModal.keep')}</button>
                    <button className="cancel-workout-yes-btn" onClick={onConfirm}>{t('workout_session.cancelModal.confirm')}</button>
                </div>
            </div>
        </div>
    );
};

export default CancelWorkoutConfirmModal;
