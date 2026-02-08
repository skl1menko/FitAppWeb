import LandingHeader from "./sections/LandingHeader"
import AboutSection from './sections/AboutSection'
import FeaturesSection from "./sections/FeaturesSection"
import TrackingSection from './sections/TrackingSection'
const LandingPage = () => {
    return (
        <div>
            <LandingHeader />
            <AboutSection />
            <FeaturesSection />
            <TrackingSection />
        </div>
    )
}
export default LandingPage;