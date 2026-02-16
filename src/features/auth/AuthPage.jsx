import AuthPageHeader from "./components/AuthPageHeader"
import AuthCont from "./components/AuthCont"
import './AuthPage.scss'

export default function AuthPage() {
    return(
        <div className='auth-page-container'>
            <AuthPageHeader />
            <AuthCont />
        </div>
    )
}