import "./ProfileMeasurementsSection.scss";

const ProfileMeasurementsSection = ({bodyMeasurements, fields, onMeasurementChange}) => (
    <section className="profile-card-cont">
        <div className="profile-section-title">
            <h2>Body measurements</h2>
            <p>Save a new snapshot of your stats to build measurement history over time.</p>
        </div>

        <div className="profile-measurements-grid">
            {fields.map((field) => (
                <label key={field.key} className="profile-field-cont">
                    <span>{field.label}</span>
                    <div className="profile-measurement-input">
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={bodyMeasurements[field.key]}
                            onChange={(event) => onMeasurementChange(field.key, event.target.value)}
                            placeholder={field.placeholder}
                        />
                        <small>{field.unit}</small>
                    </div>
                </label>
            ))}
        </div>
    </section>
);

export default ProfileMeasurementsSection;
