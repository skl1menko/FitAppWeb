import LandingHeader from "./sections/LandingHeader"
import AboutSection from './sections/AboutSection'
import FeaturesSection from "./sections/FeaturesSection"
import TrackingSection from './sections/TrackingSection'
import AnalyticsSection from "./sections/AnalyticsSection"
import AppleHealthSection from "./sections/AppleHealthSection"
const LandingPage = () => {
    return (
        <div>
            <LandingHeader />
            <AboutSection />
            <FeaturesSection />
            <TrackingSection />
            <AnalyticsSection />
            <AppleHealthSection />
        </div>
    )
}
export default LandingPage;