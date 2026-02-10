import './AnalyticsSectionCards.scss'

const AnalyticsSectionCards = ({bgColor, icon, title, mainContent, pText}) => {
    return(
        <div className="analytics-cards-content-cont">
            <div className="analytics-cards-heading-cont">
                <div className="analytics-cards-icon-cont"  style={{backgroundColor: bgColor}}>
                    {icon}
                </div>
                <h3>{title}</h3>
            </div>
            <div className="analytics-cards-main-cont">
                {mainContent}
            </div>
            <p>{pText}</p>
                                
        </div>
    )
}

export default AnalyticsSectionCards;