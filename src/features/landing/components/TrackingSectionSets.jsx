import './TrackingSectionSets.scss'

const TrackingSectionSets = ({idSet,weightKg,repsCount,check}) => {
    return(
        <div className="sets-cont">
            <div className="id-set-cont">
                <span>{idSet}</span>
            </div>
            <div className="set-info-cont">
                <div className="info-cont">
                    <span>WEIGHT</span>
                    <p>{weightKg} kg</p>
                </div>
                <div className="info-cont">
                    <span>REPS</span>
                    <p>{repsCount}</p>
                </div>
            </div>
            <div className="set-done-cont">
                {check}
            </div>
        </div>
    )
}

export default TrackingSectionSets;