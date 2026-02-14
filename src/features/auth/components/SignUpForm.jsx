import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";


const SignUpForm = () => {
    return(
         <form className="auth-form signup-form">
            <div className="input-container">
                <div className="input-cont">
                    <IoMdPerson/>
                    <input type="text" placeholder="Enter your full name" required/>
                </div>
                <div className="input-cont">
                    <MdEmail/>
                    <input type="email" placeholder="Enter email address" required/>
                </div>
                <div className="input-cont">
                    <FaLock/>
                    <input type="password" placeholder="Enter password" required/>
                </div>
            </div>
            <div className="submit-btn-cont">
                <button type="submit" className="submit-btn">Create Account</button>
            </div>
        </form>
    )
}

export default SignUpForm;