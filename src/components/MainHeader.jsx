import './MainHeader.scss'
import Logo from '../assets/Logo.svg'
import Avatar from '../assets/mobile-bg.jpg'
import { LuLayoutDashboard } from "react-icons/lu";
import { PiBarbellLight } from "react-icons/pi";
import { MdSportsGymnastics } from "react-icons/md";
import { GiProgression } from "react-icons/gi";
import { FiCalendar } from "react-icons/fi";
import { BsChevronDown } from "react-icons/bs";
import { NavLink } from 'react-router';
import { useEffect, useState } from 'react';
import authService from '../services/authService';




const MainHeader = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() =>{
        const user = authService.getUser();
        if (user && user.fullName) {
            setUserName(user.fullName);
        }
    },[]);
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return(
        <header className='main-header'>
            <div className="main-header logo-cont">
                <img src={Logo} alt="FitApp Logo" className='logo-cont logo' />
                <h1 className='logo-cont title'>PowerFit</h1>
            </div>
            <div className="main-header nav-cont">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                    <LuLayoutDashboard className="main-header-icon"/> Dashboard
                </NavLink>
                <NavLink to="/workouts" className={({ isActive }) => isActive ? 'active' : ''}>
                    <PiBarbellLight className="main-header-icon"/> Workouts
                </NavLink>
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
                <span className='main-header-username'>{userName}</span>
                <BsChevronDown className="main-header-icon" />
                {isMenuOpen && (
                    <div className="user-dropdown">
                        <NavLink>Profile</NavLink>
                        <NavLink>Settings</NavLink>
                        <NavLink className="logout">Logout</NavLink>
                    </div>
                )}
                
            </div>
        </header>
    )
}

export default MainHeader;