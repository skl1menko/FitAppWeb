import MeasurementProgressSection from "../../components/MeasurementProgressSection";
import useBodyClass from "../../hooks/useBodyClass";
import ProfileHero from "./components/ProfileHero";
import ProfileMeasurementsSection from "./components/ProfileMeasurementsSection";
import ProfilePersonalInfoSection from "./components/ProfilePersonalInfoSection";
import ProfileSummaryCard from "./components/ProfileSummaryCard";
import useProfilePage from "./useProfilePage";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./ProfilePage.scss";

const ProfilePage = () => {
    const { t } = useTranslation();
    useBodyClass("profile-page-body");
    const BODY_MEASUREMENT_FIELDS = useMemo(() => ([
        {key: "height", label: t("profile.measurements.fields.height"), placeholder: "170", unit: t("profile.measurements.units.cm")},
        {key: "weight", label: t("profile.measurements.fields.weight"), placeholder: "68", unit: t("profile.measurements.units.kg")},
        {key: "chest", label: t("profile.measurements.fields.chest"), placeholder: "95", unit: t("profile.measurements.units.cm")},
        {key: "waist", label: t("profile.measurements.fields.waist"), placeholder: "78", unit: t("profile.measurements.units.cm")},
        {key: "hips", label: t("profile.measurements.fields.hips"), placeholder: "98", unit: t("profile.measurements.units.cm")},
        {key: "biceps", label: t("profile.measurements.fields.biceps"), placeholder: "34", unit: t("profile.measurements.units.cm")}
    ]), [t]);
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
                        title={t("profile.measurements.progressTitle")}
                        description={t("profile.measurements.progressDescription")}
                        fields={BODY_MEASUREMENT_FIELDS}
                        activeField={activeProgressField}
                        onFieldChange={setActiveProgressField}
                        data={progressData}
                        unit={activeFieldMeta.unit}
                        isLoading={isProgressLoading}
                        loadingText={t("profile.measurements.progressLoading")}
                        emptyText={t("profile.measurements.progressEmpty")}
                    />
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;
