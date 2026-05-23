import {FiCamera, IoMdPerson, MdEmail} from "../../../assets/icons";
import "./ProfilePersonalInfoSection.scss";

const ProfilePersonalInfoSection = ({
    fileInputRef,
    formData,
    isLoading,
    onAvatarButtonClick,
    onAvatarChange,
    onProfileChange
}) => (
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
                        onClick={onAvatarButtonClick}
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
                            onClick={onAvatarButtonClick}
                        >
                            Change photo
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
                        <span>Name</span>
                        <div className="profile-input-wrap">
                            <IoMdPerson />
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(event) => onProfileChange("fullName", event.target.value)}
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
);

export default ProfilePersonalInfoSection;
