import LandingHeader from "./sections/LandingHeader"
import AboutSection from './sections/AboutSection'
import FeaturesSection from "./sections/FeaturesSection"
import TrackingSection from './sections/TrackingSection'
import AnalyticsSection from "./sections/AnalyticsSection"
const LandingPage = () => {
    return (
        <div>
            <LandingHeader />
            <AboutSection />
            <FeaturesSection />
            <TrackingSection />
            <AnalyticsSection />
        </div>
    )
}
export default LandingPage;