import './TrackingSection.scss'
import TrackingSectionSets from '../components/TrackingSectionSets';
import { GoCheckCircleFill } from "react-icons/go";
import { FaBalanceScale } from "react-icons/fa";
import { FiRepeat } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa6";
import { GoPulse } from "react-icons/go";
import TrackingSectionGridCards from '../components/TrackingSectionGridCards';

const TrackingSecton = () => {
    return(
        <div className="tracking-section-container">
            <div className="left-cont">
                <div className="exercise-cont-gradient"></div>
                    <div className="exercise-cont">
                        <div className="left-heading-cont">
                            <div className="exercise-name-cont">
                                <h4>Deadlift</h4>
                                <p>Compound movement</p>
                            </div>
                            <div className="span-cont">
                                <span>ACTIVE</span>
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
                    <h2>Precision Tracking for<br/>
                    <span className='highlight'>Maximum Gains</span></h2>
                </div>
                <div className="right-p-cont">
                    <p>Forget the notebook. Log every detail of your workout with an interface<br/>
                    designed for speed and accuracy in the gym.</p>
                </div>
                <div className="grid-info-cont">
                    <TrackingSectionGridCards bgColor="#F0F0F0" icon={<FaBalanceScale size={20} color='#4F46E5' />} h4Text="Weight & Sets" pText={<>Log weight in kg or lbs with<br/>automatic plate calculation.</>}/>
                    <TrackingSectionGridCards bgColor="#FCE7F3" icon={<FiRepeat size={20} color='#4F46E5' />} h4Text="Repetitions" pText={<>Track reps and RPE (Rate of<br/>Perceived Exertion).</>}/>
                    <TrackingSectionGridCards bgColor="#FCE7F3" icon={<FaRegClock size={20} color='#4F46E5' />} h4Text="Duration & Rest" pText={<>Built-in rest timer and workout<br/>duration tracking.</>}/>
                    <TrackingSectionGridCards bgColor="#DBEAFE" icon={<GoPulse size={20} color='#4F46E5' />} h4Text="History" pText={<>Instant access to previous<br/>performance for every exercise.</>}/>
                </div>
            </div>
        </div>
    )
}

export default TrackingSecton;