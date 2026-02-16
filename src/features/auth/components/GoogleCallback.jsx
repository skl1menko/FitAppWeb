import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import authService from "../../../services/authService";

const GoogleCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        if (token) {
            localStorage.setItem('token', token);

            authService.getProfile()
                .then(data => {
                    localStorage.setItem('user', JSON.stringify(data));
                    navigate('/dashboard');
                })
                .catch(() => {
                    navigate('/auth?error=profile_fetch_failed');
                })
        } else if (error){
            navigate(`/auth?error=${error}`);
        } else{
            navigate('/auth');
        }
    }, [searchParams, navigate]);

    return(
        <div className="google-callback-container">
            <h2>Processing Google Sign-In...</h2>
        </div>
    )
}

export default GoogleCallback;