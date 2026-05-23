import {IoMdPerson} from "../../../assets/icons";
import "./ProfileHero.scss";

const ProfileHero = () => (
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
);

export default ProfileHero;
