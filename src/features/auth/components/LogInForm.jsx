import { MdEmail, MdOutlineLock } from "../../../assets/icons";
import '../components/AuthForm.scss'
import { useNavigate } from "react-router";
import { useState } from "react";
import authService from "../../../services/authService";
import { useTranslation } from "react-i18next";

const LogInForm = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
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
            setError(error.response?.data?.message || t('auth.login.errorFallback'));
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
                     placeholder={t('auth.login.emailPlaceholder')}
                     required
                     name="email"
                     value={formData.email}
                     onChange={handleChange}/>
                </div>
                <div className="input-cont password">
                    <MdOutlineLock className="password-icon"/>
                    <input 
                    type="password"
                    placeholder={t('auth.login.passwordPlaceholder')}
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}/>
                </div>
            </div>
            {error ? <p className="auth-form-error">{error}</p> : null}
           
            <div className="forgot-password-cont">
                <a href="#">{t('auth.forgotPassword')}</a>
            </div>
            <div className="submit-btn-cont">
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? `${t('auth.login.submit')}...` : t('auth.login.submit')}
                </button>
            </div>
        </form>

    )
}

export default LogInForm;
