import './TrackingSection.scss'
import TrackingSectionSets from '../components/TrackingSectionSets';
import { GoCheckCircleFill, FaBalanceScale, FiRepeat, FaRegClock, GoPulse } from "../../../assets/icons";
import TrackingSectionGridCards from '../components/TrackingSectionGridCards';
import { useTranslation } from 'react-i18next';

const TrackingSecton = () => {
    const { t } = useTranslation();
    return(
        <div className="tracking-section-container">
            <div className="left-cont">
                <div className="exercise-cont-gradient"></div>
                    <div className="exercise-cont">
                        <div className="left-heading-cont">
                            <div className="exercise-name-cont">
                                <h4>{t('landing.tracking.exerciseName')}</h4>
                                <p>{t('landing.tracking.exerciseType')}</p>
                            </div>
                            <div className="span-cont">
                                <span>{t('landing.tracking.active')}</span>
                            </div>
                        </div>
                        <div className="set-cont">
                            <TrackingSectionSets idSet={1} weightKg={140} repsCount={5} check={<GoCheckCircleFill size={24} color='#22C55E' />} />
                            <TrackingSectionSets idSet={2} weightKg={140} repsCount={5} check={<GoCheckCircleFill size={24} color='#22C55E' />} />
                            <TrackingSectionSets idSet={3} weightKg={140} repsCount={5} check={<GoCheckCircleFill size={24} color='#22C55E' />} />
                            <TrackingSectionSets idSet={4} weightKg={140} repsCount={5} check={<span></span>} />
                        </div>
                </div>
            </div>
            <div className="right-cont">
                <div className="right-heading-cont">
                    <h2>{t('landing.tracking.titleLine1')}<br/>
                    <span className='highlight'>{t('landing.tracking.titleHighlight')}</span></h2>
                </div>
                <div className="right-p-cont">
                    <p>{t('landing.tracking.descriptionLine1')}<br/>
                    {t('landing.tracking.descriptionLine2')}</p>
                </div>
                <div className="grid-info-cont">
                    <TrackingSectionGridCards bgColor="#F0F0F0" icon={<FaBalanceScale size={20} color='#4F46E5' />} h4Text={t('landing.tracking.cards.weight.title')} pText={<>{t('landing.tracking.cards.weight.textLine1')}<br/> {t('landing.tracking.cards.weight.textLine2')}</>}/>
                    <TrackingSectionGridCards bgColor="#FCE7F3" icon={<FiRepeat size={20} color='#4F46E5' />} h4Text={t('landing.tracking.cards.reps.title')} pText={<>{t('landing.tracking.cards.reps.textLine1')}<br/> {t('landing.tracking.cards.reps.textLine2')}</>}/>
                    <TrackingSectionGridCards bgColor="#FCE7F3" icon={<FaRegClock size={20} color='#4F46E5' />} h4Text={t('landing.tracking.cards.duration.title')} pText={<>{t('landing.tracking.cards.duration.textLine1')}<br/> {t('landing.tracking.cards.duration.textLine2')}</>}/>
                    <TrackingSectionGridCards bgColor="#DBEAFE" icon={<GoPulse size={20} color='#4F46E5' />} h4Text={t('landing.tracking.cards.history.title')} pText={<>{t('landing.tracking.cards.history.textLine1')}<br/> {t('landing.tracking.cards.history.textLine2')}</>}/>
                </div>
            </div>
        </div>
    )
}

export default TrackingSecton;
