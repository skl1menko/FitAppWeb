import "./LandingHeader.scss"
import Logo from '../../../assets/Logo.svg'
import { Link } from "react-router";
import { useState } from "react";

const LandingHeader = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                        <img src={Logo} alt="Logo" className="landing-logo-image" />
                        <span>PowerFit</span>
                    </div>
                    <div className={`navbar-links-cont ${isMenuOpen ? 'active' : ''}`}>
                        <Link onClick={() => scrollToSection('about')}>About</Link>
                        <Link onClick={() => scrollToSection('features')}>Features</Link>
                        <Link onClick={() => scrollToSection('tracking')}>Tracking</Link>
                        <Link onClick={() => scrollToSection('analytics')}>Analytics</Link>
                        <Link onClick={() => scrollToSection('apple-health')}>Apple Health</Link>
                        <button className="log-in-btn mobile-only">Log In</button>
                    </div>
                    <div className="navbar-btns-cont">
                        <button className="log-in-btn desktop-only">Log In</button>
                        <button className="get-started-btn">Get Started</button>

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