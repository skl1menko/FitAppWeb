import "./CustomBtn.scss"
const CustomBtn = ({icon, text, onClick}) => {
    return(
        <button className="custom-btn" onClick={onClick}>
            {icon}
            {text}
        </button>
    )
}

export default CustomBtn;