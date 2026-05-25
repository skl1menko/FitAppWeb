import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import authService from "../../../services/authService";
import AuthPageHeader from "./AuthPageHeader";
import "./AuthCont.scss";
import "../components/AuthForm.scss";
import { useTranslation } from "react-i18next";

const GoogleCallback = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [roleRequired, setRoleRequired] = useState(false);
    const [setupToken, setSetupToken] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const emailFromParams = searchParams.get("email") || "";
    
    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const roleRequiredFlag = searchParams.get('role_required');
        const incomingSetupToken = searchParams.get('setup_token');
        if (token) {
            localStorage.setItem('token', token);

            authService.getProfile()
                .then(response => {
                    // Сохраняем user из response.data
                    if (response.data) {
                        localStorage.setItem('user', JSON.stringify(response.data));
                    }
                    navigate('/dashboard');
                })
                .catch(() => {
                    navigate('/auth?error=profile_fetch_failed');
                })
        } else if (roleRequiredFlag === '1' && incomingSetupToken) {
            setRoleRequired(true);
            setSetupToken(incomingSetupToken);
        } else if (error){
            navigate(`/auth/login?error=${encodeURIComponent(error)}`);
        } else{
            navigate('/auth/login');
        }
    }, [searchParams, navigate]);

    const handleCompleteRole = async () => {
        if (!selectedRole) {
            setErrorMessage(t('auth.googleCallback.roleError'));
            return;
        }

        setErrorMessage("");
        setIsSubmitting(true);
        try {
            await authService.completeGoogleRole(setupToken, selectedRole);
            navigate('/dashboard');
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || t('auth.googleCallback.errorFallback'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (roleRequired) {
        return (
            <div className="auth-page-container">
                <AuthPageHeader />
                <div className="auth-content-container">
                    <div className="auth-content-heading-cont">
                        <h1>{t('auth.welcomeTitle')}</h1>
                        <p>{emailFromParams ? t('auth.googleCallback.accountLabel', { email: emailFromParams }) : t('auth.googleCallback.almostDone')}</p>
                    </div>
                    <div className="auth-form-cont">
                        <form
                            className="auth-form signup-form"
                            onSubmit={(event) => {
                                event.preventDefault();
                                handleCompleteRole();
                            }}
                        >
                            <div className="role-select-cont">
                                <p className="role-label">{t('auth.googleCallback.rolePrompt')}</p>
                                <div className="role-options">
                                    <label className="role-option">
                                        <input
                                            type="radio"
                                            name="googleRole"
                                            value="athlete"
                                            checked={selectedRole === "athlete"}
                                            onChange={(event) => setSelectedRole(event.target.value)}
                                            required
                                        />
                                        <span>{t('common.role.athlete')}</span>
                                    </label>
                                    <label className="role-option">
                                        <input
                                            type="radio"
                                            name="googleRole"
                                            value="trainer"
                                            checked={selectedRole === "trainer"}
                                            onChange={(event) => setSelectedRole(event.target.value)}
                                            required
                                        />
                                        <span>{t('common.role.trainer')}</span>
                                    </label>
                                </div>
                            </div>
                            {errorMessage ? <p className="auth-form-error">{errorMessage}</p> : null}
                            <div className="submit-btn-cont">
                                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                    {isSubmitting ? t('auth.googleCallback.submitting') : t('auth.googleCallback.submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div className="google-callback-container">
            <h2>{t('auth.googleCallback.processing')}</h2>
        </div>
    )
}

export default GoogleCallback;
