import Logo from '../../../assets/Logo.svg'
import './AuthPageHeader.scss'
const AuthPageHeader = () => {
    return(
        <div className="auth-page-header-cont">
            <img src={Logo} alt="Logo" />
            <h1>PowerFit</h1>
        </div>
    )
}

export default AuthPageHeader;