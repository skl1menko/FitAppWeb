import MeasurementProgressSection from "../../components/MeasurementProgressSection";
import useBodyClass from "../../hooks/useBodyClass";
import ProfileHero from "./components/ProfileHero";
import ProfileMeasurementsSection from "./components/ProfileMeasurementsSection";
import ProfilePersonalInfoSection from "./components/ProfilePersonalInfoSection";
import ProfileSummaryCard from "./components/ProfileSummaryCard";
import useProfilePage from "./useProfilePage";
import "./ProfilePage.scss";

const BODY_MEASUREMENT_FIELDS = [
    {key: "height", label: "Height", placeholder: "170", unit: "cm"},
    {key: "weight", label: "Weight", placeholder: "68", unit: "kg"},
    {key: "chest", label: "Chest", placeholder: "95", unit: "cm"},
    {key: "waist", label: "Waist", placeholder: "78", unit: "cm"},
    {key: "hips", label: "Hips", placeholder: "98", unit: "cm"},
    {key: "biceps", label: "Biceps", placeholder: "34", unit: "cm"}
];

const ProfilePage = () => {
    useBodyClass("profile-page-body");
    const {
        fileInputRef,
        formData,
        bodyMeasurements,
        isLoading,
        isSaving,
        message,
        error,
        activeProgressField,
        progressData,
        isProgressLoading,
        setActiveProgressField,
        handleMeasurementChange,
        handleAvatarButtonClick,
        handleAvatarChange,
        handleProfileChange,
        handleSubmit
    } = useProfilePage(BODY_MEASUREMENT_FIELDS);
    const activeFieldMeta = BODY_MEASUREMENT_FIELDS.find((field) => field.key === activeProgressField) || BODY_MEASUREMENT_FIELDS[0];

    return (
        <div className="profile-page-cont">
            <div className="profile-page-content">
                <ProfileHero />

                <form className="profile-main-grid" onSubmit={handleSubmit}>
                    <ProfilePersonalInfoSection
                        fileInputRef={fileInputRef}
                        formData={formData}
                        isLoading={isLoading}
                        onAvatarButtonClick={handleAvatarButtonClick}
                        onAvatarChange={handleAvatarChange}
                        onProfileChange={handleProfileChange}
                    />

                    <ProfileMeasurementsSection
                        bodyMeasurements={bodyMeasurements}
                        fields={BODY_MEASUREMENT_FIELDS}
                        onMeasurementChange={handleMeasurementChange}
                    />

                    <ProfileSummaryCard
                        bodyMeasurements={bodyMeasurements}
                        error={error}
                        fields={BODY_MEASUREMENT_FIELDS}
                        formData={formData}
                        isLoading={isLoading}
                        isSaving={isSaving}
                        message={message}
                    />
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
