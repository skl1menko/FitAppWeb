import './AuthCont.scss'
import { FaGoogle } from "react-icons/fa";
import LogInForm from './LogInForm';
import SignUpForm from './SignUpForm';
import { useNavigate, useLocation } from 'react-router';
import { useState } from 'react';
const AuthCont = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const authType = location.pathname === '/auth/signup' ? 'signup' : 'login';
    const [selectedRole, setSelectedRole] = useState('');

    const handleGoogleLogin = () => {
        if (authType === 'signup' && !selectedRole) {
            alert('Please select a role before continuing with Google Sign-In.');
            return;
        }

        const role = authType === 'signup' ? selectedRole : '';
        window.location.href = `http://localhost:3000/api/auth/google?role=${role}`;
    };

    return(
        <div className="auth-content-container">
            <div className="auth-content-heading-cont">
                <h1>Welcome to PowerFit</h1>
                <p>Your journey to fitness starts here</p>
            </div>
           <div className="type-auth-cont">
                <div 
                    className={`auth-link-cont ${authType === 'login' ? 'active' : ''}`}
                    onClick={() => navigate('/auth/login')}
                >
                    <span>Log In</span>
                </div>
                <div 
                    className={`auth-link-cont ${authType === 'signup' ? 'active' : ''}`}
                    onClick={() => navigate('/auth/signup')}
                >
                    <span>Sign Up</span>
                </div>
            </div>
            <div className="auth-form-cont">
                {authType === 'login' ? (
                    <LogInForm />
                ) : (
                    <SignUpForm onRoleChange={setSelectedRole}/>
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
                    <button className="social-auth-btn" onClick={handleGoogleLogin}><FaGoogle/> Google</button>
                </div>
                <div className="agree-policy-cont">
                    <span>By continuing, you agree to our <a href="#">Terms of Service</a> and <br/><a href="#">Privacy Policy</a>.</span>
                </div>
            </div>
        </div>
    )
}

export default AuthCont;