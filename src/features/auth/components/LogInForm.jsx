import { MdEmail } from "react-icons/md";
import { MdOutlineLock } from "react-icons/md";
import '../components/AuthForm.scss'
import { useNavigate } from "react-router";
import { useState } from "react";
import authService from "../../../services/authService";

const LogInForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return(
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-container">
                <div className="input-cont email">
                    <MdEmail className="email-icon"/>
                    <input
                     type="email"
                     placeholder="Email"
                     required
                     name="email"
                     value={formData.email}
                     onChange={handleChange}/>
                </div>
                <div className="input-cont password">
                    <MdOutlineLock className="password-icon"/>
                    <input 
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}/>
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