import {FiCamera, IoMdPerson, MdEmail} from "../../../assets/icons";
import { useTranslation } from "react-i18next";
import "./ProfilePersonalInfoSection.scss";

const ProfilePersonalInfoSection = ({
    fileInputRef,
    formData,
    isLoading,
    onAvatarButtonClick,
    onAvatarChange,
    onProfileChange
}) => {
    const { t } = useTranslation();

    return (
        <section className="profile-card-cont profile-card-profile">
            <div className="profile-section-title">
                <h2>{t("profile.personalInfo.title")}</h2>
                <p>{t("profile.personalInfo.description")}</p>
            </div>

            {isLoading ? (
                <p className="profile-hint-text">{t("profile.personalInfo.loading")}</p>
            ) : (
                <>
                    <div className="profile-avatar-row">
                        <button
                            type="button"
                            className="profile-avatar-button"
                            onClick={onAvatarButtonClick}
                            aria-label={t("profile.personalInfo.uploadAria")}
                        >
                            {formData.avatarUrl ? (
                                <img src={formData.avatarUrl} alt={t("profile.personalInfo.avatarAlt")} className="profile-avatar-image" />
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
                            <strong>{t("profile.personalInfo.photoTitle")}</strong>
                            <p>{t("profile.personalInfo.photoDescription")}</p>
                            <button
                                type="button"
                                className="profile-secondary-btn"
                                onClick={onAvatarButtonClick}
                            >
                                {t("profile.personalInfo.changePhoto")}
                            </button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="profile-hidden-input"
                            onChange={onAvatarChange}
                        />
                    </div>

                    <div className="profile-fields-grid">
                        <label className="profile-field-cont">
                            <span>{t("profile.personalInfo.name")}</span>
                            <div className="profile-input-wrap">
                                <IoMdPerson />
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(event) => onProfileChange("fullName", event.target.value)}
                                    placeholder={t("profile.personalInfo.namePlaceholder")}
                                />
                            </div>
                        </label>

                        <label className="profile-field-cont">
                            <span>{t("profile.personalInfo.email")}</span>
                            <div className="profile-input-wrap profile-input-wrap-readonly">
                                <MdEmail />
                                <input
                                    type="email"
                                    value={formData.email}
                                    readOnly
                                    placeholder={t("profile.personalInfo.emailPlaceholder")}
                                />
                            </div>
                        </label>
                    </div>
                </>
            )}
        </section>
    );
};

export default ProfilePersonalInfoSection;
