import './AuthCont.scss'
import { FaGoogle } from "../../../assets/icons";
import LogInForm from './LogInForm';
import SignUpForm from './SignUpForm';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
const AuthCont = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const authType = location.pathname === '/auth/signup' ? 'signup' : 'login';

    const handleGoogleLogin = () => {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        window.location.href = `${base}/auth/google`;
    };

    return(
        <div className="auth-content-container">
            <div className="auth-content-heading-cont">
                <h1>{t('auth.welcomeTitle')}</h1>
                <p>{t('auth.welcomeSubtitle')}</p>
            </div>
           <div className="type-auth-cont">
                <div 
                    className={`auth-link-cont ${authType === 'login' ? 'active' : ''}`}
                    onClick={() => navigate('/auth/login')}
                >
                    <span>{t('auth.loginTab')}</span>
                </div>
                <div 
                    className={`auth-link-cont ${authType === 'signup' ? 'active' : ''}`}
                    onClick={() => navigate('/auth/signup')}
                >
                    <span>{t('auth.signupTab')}</span>
                </div>
            </div>
            <div className="auth-form-cont">
                {authType === 'login' ? (
                    <LogInForm />
                ) : (
                    <SignUpForm />
                )}
            </div>
            <div className="separator-cont">
                <div className="separator-line"></div>
                <div className="separator-text">
                    <span>{t('auth.continueWith')}</span>
                </div>
                <div className="separator-line"></div>
            </div>
            <div className="social-auth-cont">
                <div className="social-auth-btn-cont">
                    <button className="social-auth-btn" onClick={handleGoogleLogin}><FaGoogle/> {t('auth.google')}</button>
                </div>
                <div className="agree-policy-cont">
                    <span>{t('auth.termsPrefix')} <a href="#">{t('auth.termsOfService')}</a> та <br/><a href="#">{t('auth.privacyPolicy')}</a>.</span>
                </div>
            </div>
        </div>
    )
}

export default AuthCont;
