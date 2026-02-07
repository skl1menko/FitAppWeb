import "./FeaturesSection.scss"
import FeaturesSectionCards from "../components/FeaturesSectionCards";
import { LuDumbbell } from "react-icons/lu";
import { GoPulse } from "react-icons/go";
import { VscGraph } from "react-icons/vsc";




const FeaturesSection = () =>{
    return(
        <div className="features-section-container">
            <div className="top-cont">
                <h1>Why Choose PowerFit?</h1>
                <span>Everything you need to crush your fitness goals, all in one powerful app.</span>
            </div>
            <div className="bottom-cont">
                <FeaturesSectionCards
                    bgcolor="#EFF6FF"
                    icon={<LuDumbbell size={24} color="#2563EB" />}
                    headingText="Real-Time Tracking"
                    parText={<>Don’t wait until the workout is over. See your<br/>
                    stats in real-time to optimize your intensity and<br/>
                    stay in the right zone for maximum results.</>}
                />
                <FeaturesSectionCards
                    bgcolor="#EEF2FF"
                    icon={<GoPulse size={24} color="#4F46E5" />}
                    headingText="Personalized Workouts"
                    parText={<>Custom workout plans tailored to your <br/>
                    goals, fitness level, and preferences.<br/>
                    Adapts as you get stronger.</>}
                />
                <FeaturesSectionCards
                    bgcolor="#FAF5FF"
                    icon={<VscGraph size={24} color="#9333EA" />}
                    headingText="Real-Time Analytics"
                    parText={<>Detailed insights into your progress with<br/>
                    advanced analytics and visualizations.<br/>
                    Track volume, 1RM, and more.</>}
                /> 
            </div>
        </div>
    )
}

export default FeaturesSection;