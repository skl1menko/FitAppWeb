import './FeaturesSectionCards.scss'


const FeaturesSectionCards = ({bgcolor,icon,headingText,parText}) =>{
    return(
        <div className="card-cont">
            <div className="icon-cont" style={{backgroundColor: bgcolor}}>
                {icon}
            </div>
            <div className="heading-cont">
                <h3>{headingText}</h3>
            </div>
            <div className="par-cont">
                <p>{parText}</p>
            </div>
        </div>
    )
}

export default FeaturesSectionCards;