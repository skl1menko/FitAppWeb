import "./LandingHeader.scss"
import Logo from '../../../assets/Logo.svg'
import { Link } from "react-router";

const LandingHeader = () => {
    return (
        <div>
            <header>
                <nav className="landing-navbar">
                    <div className="navbar-logo-cont">
                        <img src={Logo} alt="Logo" className="landing-logo-image" />
                        <span>PowerFit</span>
                    </div>
                    <div className="navbar-links-cont">
                        <Link>About</Link>
                        <Link>Features</Link>
                        <Link>Tracking</Link>
                        <Link>Analytics</Link>
                        <Link>Apple Health</Link>
                    </div>
                    <div className="navbar-btns-cont">
                        <button className="log-in-btn">Log In</button>
                        <button className="get-started-btn">Get Started</button>
                    </div>
                </nav>
            </header>
        </div>
    )
}
export default LandingHeader;