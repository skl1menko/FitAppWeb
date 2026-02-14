import { useState } from 'react'
import './AuthCont.scss'
import { FaGoogle,FaApple } from "react-icons/fa";
import LogInForm from './LogInForm';
import SignUpForm from './SignUpForm';
const AuthCont = () => {

    const [authType, setAuthType] = useState('login')


    return(
        <div className="auth-content-container">
            <div className="auth-content-heading-cont">
                <h1>Welcome to PowerFit</h1>
                <p>Your journey to fitness starts here</p>
            </div>
           <div className="type-auth-cont">
                <div 
                    className={`auth-link-cont ${authType === 'login' ? 'active' : ''}`}
                    onClick={() => setAuthType('login')}
                >
                    <span>Log In</span>
                </div>
                <div 
                    className={`auth-link-cont ${authType === 'signup' ? 'active' : ''}`}
                    onClick={() => setAuthType('signup')}
                >
                    <span>Sign Up</span>
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
                    <span>or continue with</span>
                </div>
                <div className="separator-line"></div>
            </div>
            <div className="social-auth-cont">
                <div className="social-auth-btn-cont">
                    <button className="social-auth-btn"><FaGoogle/> Google</button>
                    <button className="social-auth-btn"><FaApple/> Apple</button>
                </div>
                <div className="agree-policy-cont">
                    <span>By continuing, you agree to our <a href="#">Terms of Service</a> and <br/><a href="#">Privacy Policy</a>.</span>
                </div>
            </div>
        </div>
    )
}

export default AuthCont;