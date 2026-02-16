import { MdEmail } from "react-icons/md";
import { MdOutlineLock } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";


const SignUpForm = () => {
    return(
         <form className="auth-form signup-form">
            <div className="input-container signup">
                <div className="input-cont">
                    <MdEmail/>
                    <input type="email" placeholder="Enter email address" required/>
                </div>
                <div className="input-row">
                    <div className="input-cont">
                        <IoMdPerson/>
                        <input type="name" placeholder="Enter your full name" required/>
                    </div>
                    <div className="input-cont">
                        <MdOutlineLock/>
                        <input type="password" placeholder="Enter password" required/>
                    </div>
                </div>
            </div>
            <div className="role-select-cont">
                <p className="role-label">Select your role:</p>
                <div className="role-options">
                    <label className="role-option">
                        <input type="radio" name="role" value="athlete" required/>
                        <span>Athlete</span>
                    </label>
                    <label className="role-option">
                        <input type="radio" name="role" value="trainer" required/>
                        <span>Trainer</span>
                    </label>
                </div>
            </div>
            <div className="submit-btn-cont">
                <button type="submit" className="submit-btn">Create Account</button>
            </div>
        </form>
    )
}

export default SignUpForm;