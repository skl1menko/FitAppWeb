import "./LandingHeader.scss"
import Logo from '../../../assets/Logo.svg'
import { Link } from "react-router";

const LandingHeader = () => {
    return (
        <div>
            <header>
                <nav className="landing-navbar">
                    <div className="landing-navbar-logo">
                        <img src={Logo} alt="Logo" className="landing-logo-image" />
                        <span>PowerFit</span>
                    </div>
                    <div className="landing-navbar-links">
                        <Link>About</Link>
                        <Link>Features</Link>
                        <Link>Tracking</Link>
                        <Link>Analytics</Link>
                    </div>
                    <div className="landing-navbar-buttons">
                        <button className="landing-navbar-log-in">Log In</button>
                        <button className="landing-navbar-get-started">Get Started</button>
                    </div>
                </nav>
            </header>
        </div>
    )
}
export default LandingHeader;