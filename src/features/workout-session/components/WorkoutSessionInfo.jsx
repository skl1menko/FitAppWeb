import { FaRegClock, GiWeight } from "../../../assets/icons";
import Timer from "./Timer";
import { formatGroupedNumber } from "../../../utils/formatNumber";

const formatPlannedStart = (dateValue) => {
    if (!dateValue) {
        return "Starts when launched";
    }

    return new Date(dateValue).toLocaleDateString("en-US", {
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
    return (
        <div className="workout-info-cont">
            {isPlannedMode ? (
                <>
                    <div className="info-block">
                        <div className="info-icon timer">
                            <FaRegClock size={28} />
                        </div>
                        <div className="info-cont timer">
                            <span className="info-label timer">SCHEDULED</span>
                            <span className="tonnage-value">{formatPlannedStart(scheduledStartAt)}</span>
                        </div>
                    </div>
                    <div className="info-block">
                        <div className="info-icon tonnage">
                            <GiWeight size={28} />
                        </div>
                        <div className="info-cont tonnage">
                            <span className="info-label tonnage">TONNAGE</span>
                            <span className="tonnage-value">{formatGroupedNumber(tonnage)} KG</span>
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
                            <span className="info-label timer">TIME</span>
                            {isSessionReady && <Timer startAt={timerStartAt} />}
                        </div>
                    </div>
                    <div className="info-block">
                        <div className="info-icon tonnage">
                            <GiWeight size={28} />
                        </div>
                        <div className="info-cont tonnage">
                            <span className="info-label tonnage">TONNAGE</span>
                            <span className="tonnage-value">{formatGroupedNumber(tonnage)} KG</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default WorkoutSessionInfo;
