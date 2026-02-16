import { MdEmail } from "react-icons/md";
import { MdOutlineLock } from "react-icons/md";
import '../components/AuthForm.scss'

const LogInForm = () => {
    return(
        <form className="auth-form">
            <div className="input-container">
                <div className="input-cont email">
                    <MdEmail className="email-icon"/>
                    <input type="email" placeholder="Email" required/>
                </div>
                <div className="input-cont password">
                    <MdOutlineLock className="password-icon"/>
                    <input type="password" placeholder="Password" required/>
                </div>
            </div>
           
            <div className="forgot-password-cont">
                <a href="#">Forgot Password?</a>
            </div>
            <div className="submit-btn-cont">
                <button type="submit" className="submit-btn">Log In</button>
            </div>
        </form>

    )
}

export default LogInForm;