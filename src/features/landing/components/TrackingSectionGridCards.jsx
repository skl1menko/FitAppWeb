import './TrackingSectionGridCards.scss'
const TrackingSectionGridCards = ({bgColor, icon, h4Text, pText}) =>{
    return(
        <div className="grid-card-cont">
            <div className="grid-icon-cont" style={{backgroundColor: bgColor}}>
                {icon}
            </div>
            <div className="grid-text-cont">
                <h4>{h4Text}</h4>
                <p>{pText}</p>
            </div>
        </div>
    )
}

export default TrackingSectionGridCards;