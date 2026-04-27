import "./CustomBtn.scss"
const CustomBtn = ({icon, text, onClick, className = "", disabled = false, type = "button"}) => {
    const buttonClassName = ["custom-btn", className].filter(Boolean).join(" ");

    return(
        <button className={buttonClassName} onClick={onClick} disabled={disabled} type={type}>
            {icon}
            {text}
        </button>
    )
}

export default CustomBtn;
