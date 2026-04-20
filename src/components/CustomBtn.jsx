import "./CustomBtn.scss"
const CustomBtn = ({icon, text, onClick, className = ""}) => {
    const buttonClassName = ["custom-btn", className].filter(Boolean).join(" ");

    return(
        <button className={buttonClassName} onClick={onClick}>
            {icon}
            {text}
        </button>
    )
}

export default CustomBtn;