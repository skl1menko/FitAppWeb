import {GoCheckCircleFill} from "../../../assets/icons";
import "./ProfileSummaryCard.scss";

const ProfileSummaryCard = ({bodyMeasurements, error, fields, formData, isLoading, isSaving, message}) => {
    const filledMeasurementsCount = fields.filter((field) => String(bodyMeasurements[field.key] || "").trim()).length;

    return (
        <aside className="profile-card-cont profile-card-summary">
            <div className="profile-summary-head">
                <div>
                    <h2>Your summary</h2>
                    <p>Quick access to the key personal details stored on this page.</p>
                </div>
            </div>

            <div className="profile-summary-list">
                <div className="profile-summary-item">
                    <span>Name</span>
                    <strong>{formData.fullName || "Not set"}</strong>
                </div>
                <div className="profile-summary-item">
                    <span>Email</span>
                    <strong>{formData.email || "Not set"}</strong>
                </div>
                <div className="profile-summary-item">
                    <span>Measurements filled</span>
                    <strong>{filledMeasurementsCount}/{fields.length}</strong>
                </div>
            </div>

            <div className="profile-tip-box">
                <p>Keep measurements up to date to make future progress tracking easier.</p>
            </div>

            {message && (
                <p className="profile-message-text">
                    <GoCheckCircleFill />
                    {message}
                </p>
            )}
            {error && <p className="profile-error-text">{error}</p>}

            <button type="submit" className="profile-primary-btn" disabled={isLoading || isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
            </button>
        </aside>
    );
};

export default ProfileSummaryCard;
