import "./LandingHeader.scss"
import Logo from '../../../assets/Logo.svg'
import { Link } from "react-router";
import { useState } from "react";

const LandingHeader = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }
    
    return (
        <div>
            <header>
                <nav className="landing-navbar">
                    <div className="navbar-logo-cont">
                        <img src={Logo} alt="Logo" className="landing-logo-image" />
                        <span>PowerFit</span>
                    </div>
                    <div className={`navbar-links-cont ${isMenuOpen ? 'active' : ''}`}>
                        <Link onClick={() => setIsMenuOpen(false)}>About</Link>
                        <Link onClick={() => setIsMenuOpen(false)}>Features</Link>
                        <Link onClick={() => setIsMenuOpen(false)}>Tracking</Link>
                        <Link onClick={() => setIsMenuOpen(false)}>Analytics</Link>
                        <Link onClick={() => setIsMenuOpen(false)}>Apple Health</Link>

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