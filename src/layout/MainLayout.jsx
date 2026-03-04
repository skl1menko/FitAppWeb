import { Outlet } from "react-router";
import MainHeader from "../components/MainHeader";

const MainLayout = () => {
    return(
        <>

            <MainHeader />
                <Outlet />
        </>
        
    )
}

export default MainLayout;