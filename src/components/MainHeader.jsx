import './MainHeader.scss'
import Logo from '../assets/Logo.svg'
import Avatar from '../assets/mobile-bg.jpg'
import { LuLayoutDashboard, LuMenu, LuX, PiBarbellLight, MdSportsGymnastics, FiCalendar, BsChevronDown, IoMdPerson } from "../assets/icons";
import { NavLink, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import authService from '../services/authService';
import { syncActiveWorkoutState } from '../features/workout/services/workoutSessionManager';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import {
    ACTIVE_WORKOUT_ID_KEY,
    TIMER_START_AT_KEY,
    WORKOUT_STATUS_CHANGED_EVENT,
    getStoredTimerStartAt
} from '../features/workout-session/utils/workoutSessionStorage';

const getUserProfile = (fallbackName = 'Користувач') => {
    const user = authService.getUser() || {};
    return {
        name: user.fullName || user.full_name || fallbackName,
        role: user.role || "",
        avatarUrl: user.avatarUrl || user.avatar_url || ""
    };
};

const MainHeader = () => {
    const { t } = useTranslation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [userName, setUserName] = useState(() => getUserProfile(t('common.userFallback')).name);
    const [userRole, setUserRole] = useState(() => getUserProfile(t('common.userFallback')).role);
    const [userAvatar, setUserAvatar] = useState(() => getUserProfile(t('common.userFallback')).avatarUrl);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const [isWorkoutsDropdownOpen, setIsWorkoutsDropdownOpen] = useState(false);
    const [isWorkoutsDropdownLocked, setIsWorkoutsDropdownLocked] = useState(false);
    const [isWorkoutActive, setIsWorkoutActive] = useState(() => {
        return getStoredTimerStartAt() !== null;
    });
    const navigate = useNavigate();
    const connectionsRoute = userRole === 'trainer' ? '/clients' : '/trainers';
    const connectionsLabel = userRole === 'trainer' ? t('navigation.clients') : t('navigation.trainers');
    const displayRole = userRole ? t(`common.role.${userRole}`, { defaultValue: userRole }) : '';

    useEffect(() =>{
        const syncUserProfile = () => {
            const profile = getUserProfile(t('common.userFallback'));
            setUserName(profile.name);
            setUserRole(profile.role);
            setUserAvatar(profile.avatarUrl);
        };

        syncUserProfile();
        window.addEventListener(authService.PROFILE_UPDATED_EVENT, syncUserProfile);

        return () => {
            window.removeEventListener(authService.PROFILE_UPDATED_EVENT, syncUserProfile);
        };
    }, [t]);

    useEffect(() => {
        let isMounted = true;

        const syncWorkoutStatus = async () => {
            const localActive = getStoredTimerStartAt() !== null;

            const { hasActiveWorkout: hasStorageOrServerActiveWorkout } = await syncActiveWorkoutState();

            if (isMounted) {
                setIsWorkoutActive(localActive || hasStorageOrServerActiveWorkout);
            }
        };

        const onStorage = (event) => {
            if (!event.key || event.key === TIMER_START_AT_KEY || event.key === ACTIVE_WORKOUT_ID_KEY) {
                syncWorkoutStatus();
            }
        };

        syncWorkoutStatus();
        window.addEventListener('storage', onStorage);
        window.addEventListener('focus', syncWorkoutStatus);
        document.addEventListener('visibilitychange', syncWorkoutStatus);
        window.addEventListener(WORKOUT_STATUS_CHANGED_EVENT, syncWorkoutStatus);

        return () => {
            isMounted = false;
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('focus', syncWorkoutStatus);
            document.removeEventListener('visibilitychange', syncWorkoutStatus);
            window.removeEventListener(WORKOUT_STATUS_CHANGED_EVENT, syncWorkoutStatus);
        };
    }, []);
    
    const toggleMenu = () => {
        if (isMenuOpen) {
            setIsAnimating(true);
            setTimeout(() => {
                setIsMenuOpen(false);
                setIsAnimating(false);
            }, 200); // должно совпадать с длительностью анимации в CSS
        } else {
            setIsMenuOpen(true);
        }
    }

    const toggleBurger = () => {
        setIsBurgerOpen(prev => !prev);
    }

    const openWorkoutsDropdown = () => {
        if (!isWorkoutsDropdownLocked) {
            setIsWorkoutsDropdownOpen(true);
        }
    };

    const closeWorkoutsDropdown = () => {
        setIsWorkoutsDropdownOpen(false);
        setIsWorkoutsDropdownLocked(false);
    };

    const handleActiveWorkoutClick = () => {
        setIsWorkoutsDropdownOpen(false);
        setIsWorkoutsDropdownLocked(true);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        e.stopPropagation();
        authService.logout();
        navigate('/auth/login');
    }

    return(
        <header className='main-header'>
            <div className="header-left">
                <button className="burger-btn" onClick={toggleBurger} aria-label={t('navigation.toggleMenu')}>
                    {isBurgerOpen ? <LuX className="burger-icon" /> : <LuMenu className="burger-icon" />}
                </button>
                <div className="main-header logo-cont">
                    <img src={Logo} alt="FitApp Logo" className='logo-cont logo' />
                    <h1 className="logo-cont title">PowerFit</h1>
                </div>
            </div>
            <div className="main-header nav-cont">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                    <LuLayoutDashboard className="main-header-icon"/> {t('navigation.dashboard')}
                </NavLink>
                <div
                    className={`workouts-dropdown ${isWorkoutsDropdownOpen ? 'open' : ''}`}
                    onMouseEnter={openWorkoutsDropdown}
                    onMouseLeave={closeWorkoutsDropdown}
                    onFocus={openWorkoutsDropdown}
                    onBlur={closeWorkoutsDropdown}
                >
                    <NavLink to="/workouts" className={({ isActive }) => isActive ? 'active workouts-nav-link' : 'workouts-nav-link'}>
                        <PiBarbellLight className="main-header-icon"/>
                        {t('navigation.workouts')}
                        {isWorkoutActive && <span className="workout-live-dot" aria-label={t('navigation.workoutInProgress')} />}
                    </NavLink>
                    {isWorkoutActive && (
                        <div className="workouts-dropdown-menu">
                            <NavLink to="/workout/session" className="workouts-dropdown-link" onClick={handleActiveWorkoutClick}>
                                {t('navigation.activeWorkout')}
                            </NavLink>
                        </div>
                    )}
                </div>
                <NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>
                    <FiCalendar className="main-header-icon" /> {t('navigation.schedule')}
                </NavLink>
                <NavLink to="/exercises" className={({ isActive }) => isActive ? 'active' : ''}>
                    <MdSportsGymnastics className="main-header-icon"/> {t('navigation.exercises')}
                </NavLink>
                <NavLink to={connectionsRoute} className={({ isActive }) => isActive ? 'active' : ''}>
                    <IoMdPerson className="main-header-icon"/> {connectionsLabel}
                </NavLink>
                
            </div>
            <div className="header-right">
                <LanguageSwitcher compact className="main-header-language-switcher" />
                <div className="main-header user-cont" onClick={toggleMenu}>
                    <img src={userAvatar || Avatar} alt="" className="user-avatar" />
                    <div className="main-header-username-cont">
                        <h1 className='main-header-username'>{userName}</h1>
                        <span className='main-header-user-role'>{displayRole}</span>
                    </div>
                    <BsChevronDown className="main-header-icon" />
                    {isMenuOpen && (
                        <div className={`user-dropdown ${isAnimating ? 'closing' : ''}`}>
                            <NavLink to="/profile">{t('navigation.profile')}</NavLink>
                            <button className="logout" onClick={handleLogout}>{t('navigation.logout')}</button>
                        </div>
                    )}
                </div>
            </div>
            {isBurgerOpen && (
                <div className="mobile-nav">
                    <NavLink to="/dashboard" onClick={() => setIsBurgerOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <LuLayoutDashboard className="main-header-icon"/> {t('navigation.dashboard')}
                    </NavLink>
                    <NavLink to="/workouts" onClick={() => setIsBurgerOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <PiBarbellLight className="main-header-icon"/>
                        {t('navigation.workouts')}
                        {isWorkoutActive && <span className="workout-live-dot" aria-label={t('navigation.workoutInProgress')} />}
                    </NavLink>
                    {isWorkoutActive && (
                        <NavLink to="/workout/session" onClick={() => setIsBurgerOpen(false)} className="workouts-active-link">
                            {t('navigation.activeWorkout')}
                        </NavLink>
                    )}
                    <NavLink to="/schedule" onClick={() => setIsBurgerOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <FiCalendar className="main-header-icon" /> {t('navigation.schedule')}
                    </NavLink>
                    <NavLink to="/exercises" onClick={() => setIsBurgerOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <MdSportsGymnastics className="main-header-icon"/> {t('navigation.exercises')}
                    </NavLink>
                    <NavLink to={connectionsRoute} onClick={() => setIsBurgerOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <IoMdPerson className="main-header-icon"/> {connectionsLabel}
                    </NavLink>
                </div>
            )}
        </header>
    )
}

export default MainHeader;
