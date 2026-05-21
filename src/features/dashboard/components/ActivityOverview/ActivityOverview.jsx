import { useState } from "react";
import { BsChevronDown } from "../../../../assets/icons";
import "./ActivityOverview.scss";
import ActivityChart from "./ActivityChart";
import { getWeekRange, getWeekLabel, getMonthRange, getMonthLabel } from "./dateRangeUtils";
import usePill from "./usePill";
import { PERIOD_CONFIG, STAT_CONFIG } from "./chartUtils";

const ActivityOverview = () => {
    const [weekOffset, setWeekOffset] = useState(0);
    const [monthOffset, setMonthOffset] = useState(0);
    const [activePeriod, setActivePeriod] = useState(0);
    const [activeStat, setActiveStat] = useState(0);

    const statPill = usePill(activeStat);
    const periodPill = usePill(activePeriod);

    const isWeek = activePeriod === 0;
    const pickerLabel = isWeek ? getWeekLabel(weekOffset) : getMonthLabel(monthOffset);
    const onPrev = () => isWeek ? setWeekOffset(w => w - 1) : setMonthOffset(m => m - 1);
    const onNext = () => isWeek ? setWeekOffset(w => w + 1) : setMonthOffset(m => m + 1);

    const { startDate, endDate } = isWeek
        ? getWeekRange(weekOffset)
        : getMonthRange(monthOffset);

    return (
        <div className="activity-overview-container">
            <div className="overview-header-container">
                <div className="overview-header">
                    <h2>Activity Overview</h2>
                    <div className="week-picker">
                        <button className="week-picker-btn" onClick={onPrev}>
                            <BsChevronDown size={12} className="week-arrow week-arrow--left" />
                        </button>
                        <span className="week-picker-label">{pickerLabel}</span>
                        <button className="week-picker-btn" onClick={onNext}>
                            <BsChevronDown size={12} className="week-arrow week-arrow--right" />
                        </button>
                    </div>
                </div>
                <div className="overview-selector-cont">
                    <div className="selector-cont">
                        <div className="selector-pill" style={statPill.style} />
                        {STAT_CONFIG.map((stat, i) => (
                            <button
                                key={stat.dataKey}
                                ref={el => statPill.refs.current[i] = el}
                                className={`selector-btn ${activeStat === i ? "selector-btn--active" : ""}`}
                                onClick={() => setActiveStat(i)}
                            >
                                {stat.label}
                            </button>
                        ))}
                    </div>
                    <div className="selector-cont">
                        <div className="selector-pill" style={periodPill.style} />
                        {PERIOD_CONFIG.map((period, i) => (
                            <button
                                key={period.value}
                                ref={el => periodPill.refs.current[i] = el}
                                className={`selector-btn ${activePeriod === i ? "selector-btn--active" : ""}`}
                                onClick={() => setActivePeriod(i)}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="overview-chart-cont">
                <ActivityChart
                    startDate={startDate}
                    endDate={endDate}
                    activeStat={activeStat}
                    activePeriod={activePeriod}
                />
            </div>
        </div>
    );
};

export default ActivityOverview;
