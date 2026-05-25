import { FaRegClock, GiWeight } from "../../../assets/icons";
import Timer from "./Timer";
import { formatGroupedNumber } from "../../../utils/formatNumber";
import { useTranslation } from "react-i18next";

const formatPlannedStart = (dateValue, t, language) => {
    if (!dateValue) {
        return t('workout_session.info.startsWhenLaunched');
    }

    return new Date(dateValue).toLocaleDateString(language === 'uk' ? 'uk-UA' : 'en-US', {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
};

const WorkoutSessionInfo = ({
    isPlannedMode = false,
    isSessionReady = false,
    scheduledStartAt = null,
    timerStartAt = null,
    tonnage = 0
}) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="workout-info-cont">
            {isPlannedMode ? (
                <>
                    <div className="info-block">
                        <div className="info-icon timer">
                            <FaRegClock size={28} />
                        </div>
                        <div className="info-cont timer">
                            <span className="info-label timer">{t('workout_session.workoutSessionInfo.scheduled')}</span>
                            <span className="tonnage-value">{formatPlannedStart(scheduledStartAt, t, i18n.resolvedLanguage)}</span>
                        </div>
                    </div>
                    <div className="info-block">
                        <div className="info-icon tonnage">
                            <GiWeight size={28} />
                        </div>
                        <div className="info-cont tonnage">
                            <span className="info-label tonnage">{t('workout_session.workoutSessionInfo.tonnage')}</span>
                            <span className="tonnage-value">{formatGroupedNumber(tonnage)} {t('workout_session.common.kg')}</span>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="info-block">
                        <div className="info-icon timer">
                            <FaRegClock size={28} />
                        </div>
                        <div className="info-cont timer">
                            <span className="info-label timer">{t('workout_session.workoutSessionInfo.time')}</span>
                            {isSessionReady && <Timer startAt={timerStartAt} />}
                        </div>
                    </div>
                    <div className="info-block">
                        <div className="info-icon tonnage">
                            <GiWeight size={28} />
                        </div>
                        <div className="info-cont tonnage">
                            <span className="info-label tonnage">{t('workout_session.workoutSessionInfo.tonnage')}</span>
                            <span className="tonnage-value">{formatGroupedNumber(tonnage)} {t('workout_session.common.kg')}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default WorkoutSessionInfo;
