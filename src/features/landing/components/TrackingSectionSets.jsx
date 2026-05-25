import './TrackingSectionSets.scss'
import { useTranslation } from 'react-i18next'

const TrackingSectionSets = ({idSet,weightKg,repsCount,check}) => {
    const { t } = useTranslation();
    return(
        <div className="sets-cont">
            <div className="id-set-cont">
                <span>{idSet}</span>
            </div>
            <div className="set-info-cont">
                <div className="info-cont">
                    <span>{t('landing.tracking.set.weight')}</span>
                    <p>{weightKg} kg</p>
                </div>
                <div className="info-cont">
                    <span>{t('landing.tracking.set.reps')}</span>
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
