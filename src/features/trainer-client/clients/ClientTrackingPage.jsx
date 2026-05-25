import {useMemo, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router";
import {FiArrowLeft, IoMdPerson, BsChevronDown, PiBarbellLight, CiCircleCheck, FiCalendar, FaRegClock, GiWeight, RiFireLine} from "../../../assets/icons";
import MeasurementProgressSection from "../../../components/MeasurementProgressSection";
import authService from "../../../services/authService";
import useBodyClass from "../../../hooks/useBodyClass";
import ActivityChart from "../../dashboard/components/ActivityOverview/ActivityChart";
import usePill from "../../dashboard/components/ActivityOverview/usePill";
import {getWeekLabel, getWeekRange, getMonthLabel, getMonthRange} from "../../dashboard/components/ActivityOverview/dateRangeUtils";
import {getPeriodConfig, getStatConfig} from "../../dashboard/components/ActivityOverview/chartUtils";
import {isWorkoutCompleted} from "../../workout/utils/workoutStatus";
import {formatGroupedNumber} from "../../../utils/formatNumber";
import { normalizeTrainerClientInfo } from "../utils/normalizeTrainerClient";
import {
    formatWorkoutDuration,
    getMeasurementFields
} from "../utils/clientTrackingUtils";
import useClientWorkouts from "../hooks/useClientWorkouts";
import useClientHealthMetrics from "../hooks/useClientHealthMetrics";
import useClientMeasurementProgress from "../hooks/useClientMeasurementProgress";
import RoleGate from "../components/RoleGate";
import "./ClientTrackingPage.scss";
import "../../workout/components/WorkoutsListCard.scss";
import { useTranslation } from "react-i18next";

const ClientTrackingPage = () => {
    useBodyClass("client-tracking-body");
    const { t } = useTranslation();

    const navigate = useNavigate();
    const {state} = useLocation();
    const {clientId} = useParams();
    const role = authService.getUser()?.role;
    const optimisticClientInfo = normalizeTrainerClientInfo(state);

    const [activeStat, setActiveStat] = useState(0);
    const [activePeriod, setActivePeriod] = useState(0);
    const [weekOffset, setWeekOffset] = useState(0);
    const [monthOffset, setMonthOffset] = useState(0);
    const [activeMeasurementField, setActiveMeasurementField] = useState("body_weight");
    const measurementFields = useMemo(() => getMeasurementFields(t), [t]);
    const statConfig = getStatConfig(t);
    const periodConfig = getPeriodConfig(t);

    const isWeek = activePeriod === 0;
    const pickerLabel = isWeek ? getWeekLabel(weekOffset) : getMonthLabel(monthOffset);
    const {startDate, endDate} = isWeek ? getWeekRange(weekOffset) : getMonthRange(monthOffset);
    const {
        clientInfo,
        workouts,
        workoutsError
    } = useClientWorkouts({
        clientId,
        role,
        optimisticClientInfo
    });
    const {
        chartData,
        isChartLoading,
        chartError,
        warning
    } = useClientHealthMetrics({
        clientId,
        role,
        startDate,
        endDate,
        workouts,
        activePeriod
    });
    const {
        measurementProgressData,
        isMeasurementsLoading,
        measurementsError
    } = useClientMeasurementProgress({
        clientId,
        role,
        activeMeasurementField
    });

    const statPill = usePill(activeStat);
    const periodPill = usePill(activePeriod);
    const activeMeasurementMeta = useMemo(
        () => measurementFields.find((field) => field.key === activeMeasurementField) || measurementFields[0],
        [activeMeasurementField, measurementFields]
    );
    const completedWorkouts = useMemo(() => {
        return workouts
            .filter((workout) => isWorkoutCompleted(workout))
            .sort((a, b) => new Date(b?.endTime || b?.end_time || 0) - new Date(a?.endTime || a?.end_time || 0));
    }, [workouts]);
    const error = workoutsError || chartError || measurementsError;

    return (
        <RoleGate
            role={role}
            allow="trainer"
            title={t("trainer_clients.roleGate.trackingTitle")}
            message={t("trainer_clients.roleGate.trackingMessage")}
            containerClassName="client-tracking-page-cont"
            contentClassName="client-tracking-page-content"
        >
            <div className="client-tracking-page-cont">
                <div className="client-tracking-page-content">
                    <button
                        type="button"
                        className="client-tracking-back-btn"
                        onClick={() => navigate("/clients")}
                    >
                        <FiArrowLeft/>
                        {t("trainer_clients.tracking.backToClients")}
                    </button>

                <div className="client-tracking-hero">
                    <div className="client-tracking-hero-main">
                        <div className="client-tracking-avatar">
                            <IoMdPerson/>
                        </div>
                        <div>
                            <h1>{clientInfo.clientName}</h1>
                            <p>{clientInfo.clientEmail}</p>
                        </div>
                    </div>
                </div>

                {error && <p className="client-tracking-error-text">{error}</p>}
                {warning && <p className="client-tracking-warning-text">{warning}</p>}


                <div className="client-tracking-panel-cont metrics">
                    <div className="client-tracking-chart-header-cont">
                        <div className="client-tracking-chart-header">
                            <h2>{t("trainer_clients.tracking.healthMetricsTrend")}</h2>
                            <div className="client-tracking-period-picker">
                                <button
                                    type="button"
                                    className="client-tracking-period-picker-btn"
                                    onClick={() => (isWeek ? setWeekOffset((value) => value - 1) : setMonthOffset((value) => value - 1))}
                                >
                                    <BsChevronDown size={12} className="client-tracking-period-arrow left"/>
                                </button>
                                <span className="client-tracking-period-picker-label">{pickerLabel}</span>
                                <button
                                    type="button"
                                    className="client-tracking-period-picker-btn"
                                    onClick={() => (isWeek ? setWeekOffset((value) => value + 1) : setMonthOffset((value) => value + 1))}
                                >
                                    <BsChevronDown size={12} className="client-tracking-period-arrow right"/>
                                </button>
                            </div>
                        </div>
                        <div className="client-tracking-selector-row">
                            <div className="client-tracking-selector-cont">
                                <div className="client-tracking-selector-pill" style={statPill.style}/>
                                {statConfig.map((item, index) => (
                                    <button
                                        key={item.dataKey}
                                        ref={(element) => {
                                            statPill.refs.current[index] = element;
                                        }}
                                        type="button"
                                        className={`client-tracking-selector-btn ${activeStat === index ? "client-tracking-selector-btn active" : ""}`}
                                        onClick={() => setActiveStat(index)}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                            <div className="client-tracking-selector-cont">
                                <div className="client-tracking-selector-pill" style={periodPill.style}/>
                                {periodConfig.map((period, index) => (
                                    <button
                                        key={period.value}
                                        ref={(element) => {
                                            periodPill.refs.current[index] = element;
                                        }}
                                        type="button"
                                        className={`client-tracking-selector-btn ${activePeriod === index ? "client-tracking-selector-btn active" : ""}`}
                                        onClick={() => setActivePeriod(index)}
                                    >
                                        {period.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="client-tracking-chart-wrap">
                        <ActivityChart
                            startDate={startDate}
                            endDate={endDate}
                            activeStat={activeStat}
                            activePeriod={activePeriod}
                            statConfig={statConfig}
                            chartData={chartData}
                            loading={isChartLoading}
                            emptyText={t('dashboard.loading')}
                        />
                    </div>
                </div>

                <div className="client-tracking-panel-cont measurements">
                        <MeasurementProgressSection
                        title={t("trainer_clients.tracking.bodyMeasurementsProgress")}
                        description={t("trainer_clients.tracking.bodyMeasurementsDescription")}
                        fields={measurementFields}
                        activeField={activeMeasurementField}
                        onFieldChange={setActiveMeasurementField}
                        data={measurementProgressData}
                        unit={activeMeasurementMeta.unit}
                        isLoading={isMeasurementsLoading}
                        emptyText={t("trainer_clients.tracking.noBodyMeasurements")}
                    />
                </div>

                <div className="client-tracking-panel-cont workouts">
                    <div className="client-tracking-workouts-header">
                        <div>
                            <h2>{t("trainer_clients.tracking.completedWorkouts")}</h2>
                        </div>
                    </div>
                    {completedWorkouts.length === 0 && (
                        <p className="client-tracking-hint-text">{t("trainer_clients.tracking.noCompletedWorkouts")}</p>
                    )}
                    {completedWorkouts.map((workout) => {
                        const workoutId = workout.workoutId || workout.id;
                        const workoutDate = workout.startTime || workout.start_time;
                        const endTime = workout.endTime || workout.end_time;

                        return (
                            <div
                                key={workoutId}
                                className="workout-cont client-tracking-workout-card"
                                onClick={() => navigate(`/clients/${clientId}/workouts/${workoutId}`, {
                                    state: {
                                        clientName: clientInfo.clientName,
                                        clientEmail: clientInfo.clientEmail
                                    }
                                })}
                            >
                                <div className="workout-left-cont">
                                    <div className="workout-icon-cont">
                                        <PiBarbellLight size={24} color="#3B82F6" />
                                    </div>
                                    <div className="workout-info-cont">
                                        <div className="workout-label">
                                            <span>{workout.workoutName || t("trainer_clients.tracking.workoutFallback")}</span>
                                            <CiCircleCheck size={18} color="#10B981" className="completed-icon" />
                                        </div>
                                        <div className="workout-stat-cont">
                                            <span className="workout-stat">
                                                <FiCalendar size={14} className="calendar-icon" />
                                                {workoutDate ? new Date(workoutDate).toLocaleDateString(t("common.localeCode"), {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                }) : t("trainer_clients.tracking.noDate")}
                                            </span>
                                            <span className="workout-stat">
                                                <FaRegClock size={14} className="clock-icon" />
                                                {formatWorkoutDuration(workout.startTime || workout.start_time, endTime, t)}
                                            </span>
                                            <span className="workout-stat">
                                                {t("trainer_clients.tracking.exercisesCount", { count: Number(workout.exerciseCount) || 0 })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="workout-right-cont">
                                    <span className="workout-stat">
                                        <GiWeight size={18} className="weight-icon" />
                                        {formatGroupedNumber(workout.totalTonnage || 0)} kg
                                    </span>
                                    <span className="workout-stat">
                                        <RiFireLine size={18} className="calories-icon" color="#FF8904" />
                                        {workout.caloriesBurned || 0} kcal
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                </div>
            </div>
        </RoleGate>
    );
};

export default ClientTrackingPage;
