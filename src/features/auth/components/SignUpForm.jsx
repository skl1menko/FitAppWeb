import { MdEmail } from "react-icons/md";
import { MdOutlineLock } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";
import {useNavigate} from "react-router";
import { useState } from "react";
import authService from "../../../services/authService";

const SignUpForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        role: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(formData.email, formData.password, formData.full_name, formData.role);
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            alert(`Registration failed: ${error.response?.data?.message || error.message}`);
        }
    }
    

    return(
         <form className="auth-form signup-form" onSubmit={handleSubmit}>
            <div className="input-container signup">
                <div className="input-cont">
                    <MdEmail/>
                    <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter email address"
                    required/>
                </div>
                <div className="input-row">
                    <div className="input-cont">
                        <IoMdPerson/>
                        <input name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter your full name"
                        required/>
                    </div>
                    <div className="input-cont">
                        <MdOutlineLock/>
                        <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Enter password"
                        required/>
                    </div>
                    
                </div>
            </div>
            <div className="role-select-cont">
                <p className="role-label">Select your role:</p>
                <div className="role-options">
                    <label className="role-option">
                        <input
                        type="radio"
                        name="role"
                        value="athlete"
                        checked={formData.role === 'athlete'}
                        onChange={handleChange}
                        required/>
                        <span>Athlete</span>
                    </label>
                    <label className="role-option">
                        <input
                        type="radio"
                        name="role"
                        value="trainer"
                        checked={formData.role === 'trainer'}
                        onChange={handleChange}
                        required/>
                        <span>Trainer</span>
                    </label>
                </div>
            </div>
            <div className="submit-btn-cont">
                <button type="submit" className="submit-btn">Create Account</button>
            </div>
        </form>
    )
}

export default SignUpForm;