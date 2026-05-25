import {GoCheckCircleFill} from "../../../assets/icons";
import { useTranslation } from "react-i18next";
import "./ProfileSummaryCard.scss";

const ProfileSummaryCard = ({bodyMeasurements, error, fields, formData, isLoading, isSaving, message}) => {
    const { t } = useTranslation();
    const filledMeasurementsCount = fields.filter((field) => String(bodyMeasurements[field.key] || "").trim()).length;

    return (
        <aside className="profile-card-cont profile-card-summary">
            <div className="profile-summary-head">
                <div>
                    <h2>{t("profile.summary.title")}</h2>
                    <p>{t("profile.summary.description")}</p>
                </div>
            </div>

            <div className="profile-summary-list">
                <div className="profile-summary-item">
                    <span>{t("profile.summary.name")}</span>
                    <strong>{formData.fullName || t("profile.summary.notSet")}</strong>
                </div>
                <div className="profile-summary-item">
                    <span>{t("profile.summary.email")}</span>
                    <strong>{formData.email || t("profile.summary.notSet")}</strong>
                </div>
                <div className="profile-summary-item">
                    <span>{t("profile.summary.measurementsFilled")}</span>
                    <strong>{filledMeasurementsCount}/{fields.length}</strong>
                </div>
            </div>

            <div className="profile-tip-box">
                <p>{t("profile.summary.tip")}</p>
            </div>

            {message && (
                <p className="profile-message-text">
                    <GoCheckCircleFill />
                    {message}
                </p>
            )}
            {error && <p className="profile-error-text">{error}</p>}

            <button type="submit" className="profile-primary-btn" disabled={isLoading || isSaving}>
                {isSaving ? t("profile.summary.saving") : t("profile.summary.saveChanges")}
            </button>
        </aside>
    );
};

export default ProfileSummaryCard;
