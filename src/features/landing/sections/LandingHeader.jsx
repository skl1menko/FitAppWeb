import "./LandingHeader.scss"
import Logo from '../../../assets/Logo.svg'
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
const LandingHeader = () => {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    }
    
    return (
        <div>
            <header>
                <nav className="landing-navbar">
                    <div className="navbar-logo-cont" onClick={() => scrollToSection('about')}>
                        <img src={Logo} alt="PowerFit logo" className="landing-logo-image" />
                        <span>PowerFit</span>
                    </div>
                    <div className={`navbar-links-cont ${isMenuOpen ? 'active' : ''}`}>
                        <Link onClick={() => scrollToSection('about')}>{t('landing.header.about')}</Link>
                        <Link onClick={() => scrollToSection('features')}>{t('landing.header.features')}</Link>
                        <Link onClick={() => scrollToSection('tracking')}>{t('landing.header.tracking')}</Link>
                        <Link onClick={() => scrollToSection('analytics')}>{t('landing.header.analytics')}</Link>
                        <Link onClick={() => scrollToSection('apple-health')}>{t('landing.header.appleHealth')}</Link>
                        <button className="log-in-btn mobile-only" onClick={() => navigate('/auth/login')}>{t('landing.header.login')}</button>
                    </div>
                    <div className="navbar-btns-cont">
                        <LanguageSwitcher compact className="landing-language-switcher" />
                        <button className="log-in-btn desktop-only" onClick={() => navigate('/auth/login')}>{t('landing.header.login')}</button>
                        <button className="get-started-btn" onClick={() => navigate('/auth/signup')}>{t('landing.header.getStarted')}</button>

                        <button className={`burger-menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                                <span></span>
                                <span></span>
                                <span></span>
                        </button>
                    </div>
                </nav>
            </header>
        </div>
    )
}
export default LandingHeader;
