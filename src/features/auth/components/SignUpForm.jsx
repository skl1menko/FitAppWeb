import { MdEmail, MdOutlineLock, IoMdPerson } from "../../../assets/icons";
import {useNavigate} from "react-router";
import { useState, useEffect } from "react";
import authService from "../../../services/authService";
import { useTranslation } from "react-i18next";

const SignUpForm = ({ onRoleChange }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
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

    // Передаем выбранную роль в родительский компонент (AuthCont)
    useEffect(() => {
        if (onRoleChange) {
            onRoleChange(formData.role);
        }
    }, [formData.role, onRoleChange]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(formData.email, formData.password, formData.full_name, formData.role);
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            alert(`${t('auth.signup.errorFallback')}: ${error.response?.data?.message || error.message}`);
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
                    placeholder={t('auth.signup.emailPlaceholder')}
                    required/>
                </div>
                <div className="input-row">
                    <div className="input-cont">
                        <IoMdPerson/>
                        <input name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        type="text"
                        placeholder={t('auth.signup.fullNamePlaceholder')}
                        required/>
                    </div>
                    <div className="input-cont">
                        <MdOutlineLock/>
                        <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        placeholder={t('auth.signup.passwordPlaceholder')}
                        required/>
                    </div>
                    
                </div>
            </div>
            <div className="role-select-cont">
                <p className="role-label">{t('auth.signup.roleLabel')}</p>
                <div className="role-options">
                    <label className="role-option">
                        <input
                        type="radio"
                        name="role"
                        value="athlete"
                        checked={formData.role === 'athlete'}
                        onChange={handleChange}
                        required/>
                        <span>{t('common.role.athlete')}</span>
                    </label>
                    <label className="role-option">
                        <input
                        type="radio"
                        name="role"
                        value="trainer"
                        checked={formData.role === 'trainer'}
                        onChange={handleChange}
                        required/>
                        <span>{t('common.role.trainer')}</span>
                    </label>
                </div>
            </div>
            <div className="submit-btn-cont">
                <button type="submit" className="submit-btn">{t('auth.signup.submit')}</button>
            </div>
        </form>
    )
}

export default SignUpForm;
