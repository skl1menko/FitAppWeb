import './MainHeader.scss'
import Logo from '../assets/Logo.svg'
import Avatar from '../assets/mobile-bg.jpg'
import { LuLayoutDashboard, LuMenu, LuX, PiBarbellLight, MdSportsGymnastics, GiProgression, FiCalendar, BsChevronDown } from "../assets/icons";
import { NavLink, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import authService from '../services/authService';

const TIMER_START_AT_KEY = 'workoutSessionStartAt';
const WORKOUT_STATUS_CHANGED_EVENT = 'workoutSessionStatusChanged';



const MainHeader = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const [isWorkoutsDropdownOpen, setIsWorkoutsDropdownOpen] = useState(false);
    const [isWorkoutsDropdownLocked, setIsWorkoutsDropdownLocked] = useState(false);
    const [isWorkoutActive, setIsWorkoutActive] = useState(() => {
        const startAt = Number(localStorage.getItem(TIMER_START_AT_KEY));
        return Number.isFinite(startAt) && startAt > 0;
    });
    const navigate = useNavigate();

    useEffect(() =>{
        const user = authService.getUser();
        if (user && user.fullName) {
            setUserName(user.fullName);
        }
        if (user && user.role) {
            setUserRole(user.role);
        }
    },[]);

    useEffect(() => {
        const syncWorkoutStatus = () => {
            const startAt = Number(localStorage.getItem(TIMER_START_AT_KEY));
            setIsWorkoutActive(Number.isFinite(startAt) && startAt > 0);
        };

        const onStorage = (event) => {
            if (!event.key || event.key === TIMER_START_AT_KEY) {
                syncWorkoutStatus();
            }
        };

        syncWorkoutStatus();
        window.addEventListener('storage', onStorage);
        window.addEventListener('focus', syncWorkoutStatus);
        document.addEventListener('visibilitychange', syncWorkoutStatus);
        window.addEventListener(WORKOUT_STATUS_CHANGED_EVENT, syncWorkoutStatus);

        return () => {
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
                <button className="burger-btn" onClick={toggleBurger} aria-label="Toggle navigation">
                    {isBurgerOpen ? <LuX className="burger-icon" /> : <LuMenu className="burger-icon" />}
                </button>
                <div className="main-header logo-cont">
                    <img src={Logo} alt="FitApp Logo" className='logo-cont logo' />
                    <h1 className="logo-cont title">PowerFit</h1>
                </div>
            </div>
            <div className="main-header nav-cont">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                    <LuLayoutDashboard className="main-header-icon"/> Dashboard
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
                        Workouts
                        {isWorkoutActive && <span className="workout-live-dot" aria-label="Workout in progress" />}
                    </NavLink>
                    {isWorkoutActive && (
                        <div className="workouts-dropdown-menu">
                            <NavLink to="/workout/session" className="workouts-dropdown-link" onClick={handleActiveWorkoutClick}>
                                Аctive workout
                            </NavLink>
                        </div>
                    )}
                </div>
                <NavLink to="/exercises" className={({ isActive }) => isActive ? 'active' : ''}>
                    <MdSportsGymnastics className="main-header-icon"/> Exercises
                </NavLink>
                <NavLink to="/progress" className={({ isActive }) => isActive ? 'active' : ''}>
                    <GiProgression className="main-header-icon"/> Progress
                </NavLink>
                <NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>
                    <FiCalendar className="main-header-icon"/> Schedule
                </NavLink>
            </div>
            <div className="main-header user-cont" onClick={toggleMenu}>
                <img src={Avatar} alt="" className="user-avatar" />
                <div className="main-header-username-cont">
                    <h1 className='main-header-username'>{userName}</h1>
                    <span className='main-header-user-role'>{userRole}</span>
                </div>
                <BsChevronDown className="main-header-icon" />
                {isMenuOpen && (
                    <div className={`user-dropdown ${isAnimating ? 'closing' : ''}`}>
                        <NavLink to="/profile">Profile</NavLink>
                        <NavLink to="/settings">Settings</NavLink>
                        <button className="logout" onClick={handleLogout}>Logout</button>
                    </div>
                )}
                
            </div>
            {isBurgerOpen && (
                <div className="mobile-nav">
                    <NavLink to="/dashboard" onClick={() => setIsBurgerOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <LuLayoutDashboard className="main-header-icon"/> Dashboard
                    </NavLink>
                    <NavLink to="/workouts" onClick={() => setIsBurgerOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <PiBarbellLight className="main-header-icon"/>
                        Workouts
                        {isWorkoutActive && <span className="workout-live-dot" aria-label="Workout in progress" />}
                    </NavLink>
                    {isWorkoutActive && (
                        <NavLink to="/workout/session" onClick={() => setIsBurgerOpen(false)} className="workouts-active-link">
                            Аctive workout
                        </NavLink>
                    )}
                    <NavLink to="/exercises" onClick={() => setIsBurgerOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <MdSportsGymnastics className="main-header-icon"/> Exercises
                    </NavLink>
                    <NavLink to="/progress" onClick={() => setIsBurgerOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <GiProgression className="main-header-icon"/> Progress
                    </NavLink>
                    <NavLink to="/schedule" onClick={() => setIsBurgerOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                        <FiCalendar className="main-header-icon"/> Schedule
                    </NavLink>
                </div>
            )}
        </header>
    )
}

export default MainHeader;