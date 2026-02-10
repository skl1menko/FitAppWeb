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
            <div id="about">
                <AboutSection />
            </div>
            <div id="features">
                <FeaturesSection />
            </div>
            <div id="tracking">
                <TrackingSection />
            </div>
            <div id="analytics">
                <AnalyticsSection />
            </div>
            <div id="apple-health">
                <AppleHealthSection />
            </div>
        </div>
    )
}
export default LandingPage;