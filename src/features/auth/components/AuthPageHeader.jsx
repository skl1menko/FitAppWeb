import Logo from '../../../assets/Logo.svg'
import './AuthPageHeader.scss'
import LanguageSwitcher from '../../../components/LanguageSwitcher';
const AuthPageHeader = () => {
    return(
        <div className="auth-page-header-cont">
            <div className="auth-page-brand">
                <img src={Logo} alt="PowerFit logo" />
                <h1>PowerFit</h1>
            </div>
            <LanguageSwitcher compact className="on-dark" />
        </div>
    )
}

export default AuthPageHeader;
