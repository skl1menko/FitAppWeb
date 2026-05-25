import "./FeaturesSection.scss"
import FeaturesSectionCards from "../components/FeaturesSectionCards";
import { LuDumbbell, GoPulse, VscGraph } from "../../../assets/icons";
import { useTranslation } from "react-i18next";




const FeaturesSection = () =>{
    const { t } = useTranslation();
    return(
        <div className="features-section-container">
            <div className="top-cont">
                <h1>{t('landing.features.title')}</h1>
                <span>{t('landing.features.subtitle')}</span>
            </div>
            <div className="bottom-cont">
                <FeaturesSectionCards
                    bgcolor="#EFF6FF"
                    icon={<LuDumbbell size={24} color="#2563EB" />}
                    headingText={t('landing.features.cards.tracking.title')}
                    parText={t('landing.features.cards.tracking.text')}
                />
                <FeaturesSectionCards
                    bgcolor="#EEF2FF"
                    icon={<GoPulse size={24} color="#4F46E5" />}
                    headingText={t('landing.features.cards.workouts.title')}
                    parText={t('landing.features.cards.workouts.text')}
                />
                <FeaturesSectionCards
                    bgcolor="#FAF5FF"
                    icon={<VscGraph size={24} color="#9333EA" />}
                    headingText={t('landing.features.cards.analytics.title')}
                    parText={t('landing.features.cards.analytics.text')}
                /> 
            </div>
        </div>
    )
}

export default FeaturesSection;
