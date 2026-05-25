import {IoMdPerson} from "../../../assets/icons";
import { useTranslation } from "react-i18next";
import "./ProfileHero.scss";

const ProfileHero = () => {
    const { t } = useTranslation();

    return (
        <div className="profile-hero-grid">
            <div className="profile-hero-copy">
                <div className="profile-hero-icon">
                    <IoMdPerson />
                </div>
                <div>
                    <h1>{t("profile.hero.title")}</h1>
                    <p>{t("profile.hero.description")}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileHero;
