import { useEffect, useState } from "react"
import "./DashboardPage.scss"
import WelcomeBoardStat from "./components/DashboardStat"
const DashboardPage = () => {
    
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.fullName) {
            setUserName(user.fullName);
        }
    })
    
    return(
        <div className="dashboard-main-cont">
           
        </div>
    )
}

export default DashboardPage;