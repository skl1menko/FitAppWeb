import {useEffect, useRef, useState} from "react";
import {FiCamera, GiWeight, IoMdPerson, MdEmail, FaBalanceScale, GoCheckCircleFill} from "../../assets/icons";
import MeasurementProgressSection from "../../components/MeasurementProgressSection";
import useBodyClass from "../../hooks/useBodyClass";
import profileService from "../../services/profileService";
import "./ProfilePage.scss";

const BODY_MEASUREMENT_FIELDS = [
    {key: "height", label: "Height", placeholder: "170", unit: "cm"},
    {key: "weight", label: "Weight", placeholder: "68", unit: "kg"},
    {key: "chest", label: "Chest", placeholder: "95", unit: "cm"},
    {key: "waist", label: "Waist", placeholder: "78", unit: "cm"},
    {key: "hips", label: "Hips", placeholder: "98", unit: "cm"},
    {key: "biceps", label: "Biceps", placeholder: "34", unit: "cm"}
];

const formatProgressLabel = (dateValue) => {
    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short"
    });
};

const formatProgressDateTime = (dateValue) => {
    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const ProfilePage = () => {
    useBodyClass("profile-page-body");

    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        avatarUrl: ""
    });
    const [bodyMeasurements, setBodyMeasurements] = useState(profileService.getDefaultBodyMeasurements());
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [activeProgressField, setActiveProgressField] = useState("weight");
    const [progressData, setProgressData] = useState([]);
    const [isProgressLoading, setIsProgressLoading] = useState(true);
    const activeFieldMeta = BODY_MEASUREMENT_FIELDS.find((field) => field.key === activeProgressField) || BODY_MEASUREMENT_FIELDS[0];

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            setError("");

            try {
                const response = await profileService.getProfile();
                setFormData({
                    fullName: response.profile?.fullName || "",
                    email: response.profile?.email || "",
                    avatarUrl: response.profile?.avatarUrl || ""
                });
                setBodyMeasurements(response.bodyMeasurements);
            } catch {
                setError("Failed to load profile.");
            } finally {
            setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    useEffect(() => {
        const loadProgress = async () => {
            setIsProgressLoading(true);

            try {
                const response = await profileService.getMeasurementProgress(activeProgressField);
                const points = Array.isArray(response?.progressData) ? response.progressData : [];
                const normalizedPoints = points.map((point) => ({
                    chartKey: point.date,
                    label: formatProgressLabel(point.date),
                    fullLabel: formatProgressDateTime(point.date),
                    date: point.date,
                    value: Number(point.value) || 0,
                    unit: BODY_MEASUREMENT_FIELDS.find((field) => field.key === activeProgressField)?.unit || ""
                }));
                setProgressData(normalizedPoints);
            } catch {
                setProgressData([]);
            } finally {
                setIsProgressLoading(false);
            }
        };

        loadProgress();
    }, [activeProgressField, message]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleProfileChange = (field, value) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value
        }));
    };

    const handleMeasurementChange = (field, value) => {
        setBodyMeasurements((previous) => ({
            ...previous,
            [field]: value
        }));
    };

    const handleAvatarButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setError("");
        setMessage("");
        setAvatarFile(file);

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        const nextPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(nextPreviewUrl);
        handleProfileChange("avatarUrl", nextPreviewUrl);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedName = formData.fullName.trim();
        if (!trimmedName) {
            setError("Name is required.");
            return;
        }

        setIsSaving(true);
        setError("");
        setMessage("");

        try {
            let avatarUrlToSave = formData.avatarUrl;

            if (avatarFile) {
                avatarUrlToSave = await profileService.uploadProfileImage(avatarFile);
            }

            const [profileResult, measurementsResult] = await Promise.all([
                profileService.saveProfile({
                    fullName: trimmedName,
                    email: formData.email,
                    avatarUrl: avatarUrlToSave
                }),
                profileService.saveBodyMeasurements(bodyMeasurements)
            ]);

            setFormData((previous) => ({
                ...previous,
                fullName: profileResult.profile?.fullName || trimmedName,
                avatarUrl: profileResult.profile?.avatarUrl || avatarUrlToSave || previous.avatarUrl
            }));
            setAvatarFile(null);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl("");
            }
            setMessage(profileResult.savedToServer && measurementsResult.savedToServer ? "Profile updated successfully." : "Profile updated successfully.");
        } catch {
            setError("Failed to save profile. Check Cloudinary preset and backend availability.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="profile-page-cont">
            <div className="profile-page-content">
                <div className="profile-hero-grid">
                    <div className="profile-hero-copy">
                        <div className="profile-hero-icon">
                            <IoMdPerson />
                        </div>
                        <div>
                            <h1>My profile</h1>
                            <p>Manage your personal details, profile photo and body measurements in one place.</p>
                        </div>
                    </div>
                </div>

                <form className="profile-main-grid" onSubmit={handleSubmit}>
                    <section className="profile-card-cont profile-card-profile">
                        <div className="profile-section-title">
                            <h2>Personal info</h2>
                            <p>Update the photo and the name shown across the app.</p>
                        </div>

                        {isLoading ? (
                            <p className="profile-hint-text">Loading profile...</p>
                        ) : (
                            <>
                                <div className="profile-avatar-row">
                                    <button
                                        type="button"
                                        className="profile-avatar-button"
                                        onClick={handleAvatarButtonClick}
                                        aria-label="Upload profile photo"
                                    >
                                        {formData.avatarUrl ? (
                                            <img src={formData.avatarUrl} alt="Profile" className="profile-avatar-image" />
                                        ) : (
                                            <div className="profile-avatar-placeholder">
                                                <IoMdPerson />
                                            </div>
                                        )}
                                        <span className="profile-avatar-edit">
                                            <FiCamera />
                                        </span>
                                    </button>

                                    <div className="profile-avatar-copy">
                                        <strong>Profile photo</strong>
                                        <p>Upload a square image to personalize your account.</p>
                                        <button
                                            type="button"
                                            className="profile-secondary-btn"
                                            onClick={handleAvatarButtonClick}
                                        >
                                            Change photo
                                        </button>
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="profile-hidden-input"
                                        onChange={handleAvatarChange}
                                    />
                                </div>

                                <div className="profile-fields-grid">
                                    <label className="profile-field-cont">
                                        <span>Name</span>
                                        <div className="profile-input-wrap">
                                            <IoMdPerson />
                                            <input
                                                type="text"
                                                value={formData.fullName}
                                                onChange={(event) => handleProfileChange("fullName", event.target.value)}
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                    </label>

                                    <label className="profile-field-cont">
                                        <span>Registered email</span>
                                        <div className="profile-input-wrap profile-input-wrap-readonly">
                                            <MdEmail />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                readOnly
                                                placeholder="Email"
                                            />
                                        </div>
                                    </label>
                                </div>
                            </>
                        )}
                    </section>

                    <section className="profile-card-cont">
                        <div className="profile-section-title">
                            <h2>Body measurements</h2>
                            <p>Save a new snapshot of your stats to build measurement history over time.</p>
                        </div>

                        <div className="profile-measurements-grid">
                            {BODY_MEASUREMENT_FIELDS.map((field) => (
                                <label key={field.key} className="profile-field-cont">
                                    <span>{field.label}</span>
                                    <div className="profile-measurement-input">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={bodyMeasurements[field.key]}
                                            onChange={(event) => handleMeasurementChange(field.key, event.target.value)}
                                            placeholder={field.placeholder}
                                        />
                                        <small>{field.unit}</small>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </section>

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
                                <strong>
                                    {BODY_MEASUREMENT_FIELDS.filter((field) => String(bodyMeasurements[field.key] || "").trim()).length}
                                    /{BODY_MEASUREMENT_FIELDS.length}
                                </strong>
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
                </form>

                <section className="profile-card-cont profile-progress-card">
                    <MeasurementProgressSection
                        title="Measurement progress"
                        description="Track how your body measurements change across saved snapshots."
                        fields={BODY_MEASUREMENT_FIELDS}
                        activeField={activeProgressField}
                        onFieldChange={setActiveProgressField}
                        data={progressData}
                        unit={activeFieldMeta.unit}
                        isLoading={isProgressLoading}
                        loadingText="Loading progress..."
                        emptyText="No measurement history yet. Save your stats to start tracking changes."
                    />
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;
