import {useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router";
import {FiArrowLeft, IoMdPerson, RiFireLine, IoFootstepsOutline, CiHeart, BsChevronDown} from "../../../assets/icons";
import MeasurementProgressSection from "../../../components/MeasurementProgressSection";
import DatePickerCustom from "../../../components/DatePickerCustom";
import trainerService from "../../../services/trainerService";
import authService from "../../../services/authService";
import useBodyClass from "../../../hooks/useBodyClass";
import ActivityChart from "../../dashboard/components/ActivityOverview/ActivityChart";
import usePill from "../../dashboard/components/ActivityOverview/usePill";
import {getWeekLabel, getWeekRange, getMonthLabel, getMonthRange} from "../../dashboard/components/ActivityOverview/dateRangeUtils";
import {STAT_CONFIG, transformMetrics, transformMonthMetrics} from "../../dashboard/components/ActivityOverview/chartUtils";
import "./ClientTrackingPage.scss";

const formatDateInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const isNotFoundError = (error) => Number(error?.response?.status) === 404;

const getWorkoutDateKey = (workout) => {
    const source = workout?.startTime || workout?.createdAt;
    if (!source) {
        return "";
    }
    return String(source).slice(0, 10);
};

const getWorkoutCalories = (workout) => Number(workout?.caloriesBurned) || 0;

const buildFallbackDailyMetricsFromWorkouts = (workouts, dateValue) => {
    const totalEnergyBurned = workouts
        .filter((workout) => getWorkoutDateKey(workout) === dateValue)
        .reduce((sum, workout) => sum + getWorkoutCalories(workout), 0);

    return {
        totalEnergyBurned: Math.round(totalEnergyBurned),
        totalStepCount: 0,
        avgHeartRate: 0
    };
};

const normalizeMetricPoint = (metric) => {
    const dateKey = String(metric.endDate || metric.startDate || metric.date || "").slice(0, 10);
    if (!dateKey) {
        return null;
    }

    return {
        endDate: dateKey,
        totalStepCount: Number(metric.totalStepCount) || 0,
        totalEnergyBurned: Number(metric.totalEnergyBurned) || 0,
        avgHeartRate: Number(metric.avgHeartRate) || 0
    };
};

const buildChartData = (metrics, startDate, endDate, activePeriod) => {
    const normalized = metrics
        .map(normalizeMetricPoint)
        .filter(Boolean)
        .sort((a, b) => a.endDate.localeCompare(b.endDate));

    return activePeriod === 1
        ? transformMonthMetrics(normalized, startDate, endDate)
        : transformMetrics(normalized, startDate, endDate);
};

const buildFallbackChartDataFromWorkouts = (workouts, startDate, endDate, activePeriod) => {
    const aggregated = workouts.reduce((acc, workout) => {
        const key = getWorkoutDateKey(workout);
        if (!key) {
            return acc;
        }
        acc.set(key, (acc.get(key) || 0) + getWorkoutCalories(workout));
        return acc;
    }, new Map());

    const pseudoMetrics = Array.from(aggregated.entries()).map(([endDate, calories]) => ({
        endDate,
        totalStepCount: 0,
        totalEnergyBurned: Math.round(calories),
        avgHeartRate: 0
    }));

    return buildChartData(pseudoMetrics, startDate, endDate, activePeriod);
};

const MEASUREMENT_FIELDS = [
    {key: "body_weight", label: "Weight", unit: "kg"},
    {key: "height", label: "Height", unit: "cm"},
    {key: "chest", label: "Chest", unit: "cm"},
    {key: "waist", label: "Waist", unit: "cm"},
    {key: "hips", label: "Hips", unit: "cm"},
    {key: "biceps", label: "Biceps", unit: "cm"}
];

const formatMeasurementLabel = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short"
    });
};

const formatMeasurementDateTime = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const ClientTrackingPage = () => {
    useBodyClass("client-tracking-body");

    const navigate = useNavigate();
    const {state} = useLocation();
    const {clientId} = useParams();
    const role = authService.getUser()?.role;

    const [activeStat, setActiveStat] = useState(0);
    const [activePeriod, setActivePeriod] = useState(0);
    const [weekOffset, setWeekOffset] = useState(0);
    const [monthOffset, setMonthOffset] = useState(0);
    const [clientInfo, setClientInfo] = useState({
        clientName: state?.clientName || "Client",
        clientEmail: state?.clientEmail || ""
    });
    const [workouts, setWorkouts] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [measurementProgressData, setMeasurementProgressData] = useState([]);
    const [activeMeasurementField, setActiveMeasurementField] = useState("body_weight");
    const [isStatsLoading, setIsStatsLoading] = useState(false);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [isMeasurementsLoading, setIsMeasurementsLoading] = useState(false);
    const [error, setError] = useState("");
    const [warning, setWarning] = useState("");

    const isWeek = activePeriod === 0;
    const pickerLabel = isWeek ? getWeekLabel(weekOffset) : getMonthLabel(monthOffset);
    const {startDate, endDate} = isWeek ? getWeekRange(weekOffset) : getMonthRange(monthOffset);

    const statPill = usePill(activeStat);
    const periodPill = usePill(activePeriod);
    const activeMeasurementMeta = useMemo(
        () => MEASUREMENT_FIELDS.find((field) => field.key === activeMeasurementField) || MEASUREMENT_FIELDS[0],
        [activeMeasurementField]
    );

    useEffect(() => {
        if (role !== "trainer") {
            return;
        }

        const loadWorkouts = async () => {
            setError("");
            const result = await Promise.allSettled([trainerService.getClientsWorkouts(clientId)]);
            const workoutsResult = result[0];

            if (workoutsResult.status === "fulfilled") {
                const workoutsData = workoutsResult.value?.data?.data?.workouts || [];
                const clientData = workoutsResult.value?.data?.data?.client;
                setWorkouts(workoutsData);
                if (clientData) {
                    setClientInfo({
                        clientName: clientData.clientName || state?.clientName || "Client",
                        clientEmail: clientData.clientEmail || state?.clientEmail || ""
                    });
                }
                return;
            }

            setWorkouts([]);
            setError(workoutsResult.reason?.response?.data?.message || "Failed to load client workouts.");
        };

        loadWorkouts();
    }, [clientId, role, state?.clientEmail, state?.clientName]);

   
    useEffect(() => {
        if (role !== "trainer") {
            return;
        }

        const loadChart = async () => {
            setIsChartLoading(true);

            const result = await Promise.allSettled([
                trainerService.getClientHealthMetricsRange(clientId, startDate, endDate)
            ]);
            const chartResult = result[0];

            if (chartResult.status === "fulfilled") {
                const metrics = chartResult.value?.data?.data?.metrics || [];
                setChartData(buildChartData(metrics, startDate, endDate, activePeriod));
                setIsChartLoading(false);
                return;
            }

            if (isNotFoundError(chartResult.reason)) {
                setChartData(buildFallbackChartDataFromWorkouts(workouts, startDate, endDate, activePeriod));
                setWarning("Health metrics API is unavailable on current backend, so chart is built from workouts.");
            } else {
                setChartData([]);
                setError(chartResult.reason?.response?.data?.message || "Failed to load chart metrics.");
            }

            setIsChartLoading(false);
        };

        loadChart();
    }, [activePeriod, clientId, endDate, role, startDate, workouts]);

    useEffect(() => {
        if (role !== "trainer") {
            return;
        }

        const loadMeasurementProgress = async () => {
            setIsMeasurementsLoading(true);

            try {
                const rangeEnd = new Date();
                const rangeStart = new Date();
                rangeStart.setMonth(rangeStart.getMonth() - 6);

                const response = await trainerService.getClientBodyMeasurementProgress(
                    clientId,
                    activeMeasurementField,
                    formatDateInput(rangeStart),
                    formatDateInput(rangeEnd)
                );

                const points = response?.data?.data?.progressData || [];
                setMeasurementProgressData(points.map((point) => ({
                    chartKey: point.date,
                    label: formatMeasurementLabel(point.date),
                    fullLabel: formatMeasurementDateTime(point.date),
                    value: Number(point.value) || 0
                })));
            } catch (progressError) {
                if (isNotFoundError(progressError)) {
                    setMeasurementProgressData([]);
                } else {
                    setError(progressError?.response?.data?.message || "Failed to load body measurement progress.");
                }
            } finally {
                setIsMeasurementsLoading(false);
            }
        };

        loadMeasurementProgress();
    }, [activeMeasurementField, clientId, role]);

    if (role !== "trainer") {
        return (
            <div className="client-tracking-page-cont">
                <div className="client-tracking-page-content">
                    <h1>Client tracking</h1>
                    <p>This page is available only for trainers.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="client-tracking-page-cont">
            <div className="client-tracking-page-content">
                <button
                    type="button"
                    className="client-tracking-back-btn"
                    onClick={() => navigate("/clients")}
                >
                    <FiArrowLeft/>
                    Back to clients
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
                {(isStatsLoading || isChartLoading) && <p className="client-tracking-hint-text">Loading data...</p>}


                <div className="client-tracking-panel-cont">
                    <div className="client-tracking-chart-header-cont">
                        <div className="client-tracking-chart-header">
                            <h2>Health metrics trend</h2>
                            <div className="client-tracking-period-picker">
                                <button
                                    type="button"
                                    className="client-tracking-period-picker-btn"
                                    onClick={() => (isWeek ? setWeekOffset((value) => value - 1) : setMonthOffset((value) => value - 1))}
                                >
                                    <BsChevronDown size={12} className="client-tracking-period-arrow client-tracking-period-arrow-left"/>
                                </button>
                                <span className="client-tracking-period-picker-label">{pickerLabel}</span>
                                <button
                                    type="button"
                                    className="client-tracking-period-picker-btn"
                                    onClick={() => (isWeek ? setWeekOffset((value) => value + 1) : setMonthOffset((value) => value + 1))}
                                >
                                    <BsChevronDown size={12} className="client-tracking-period-arrow client-tracking-period-arrow-right"/>
                                </button>
                            </div>
                        </div>
                        <div className="client-tracking-selector-row">
                            <div className="client-tracking-selector-cont">
                                <div className="client-tracking-selector-pill" style={statPill.style}/>
                                {STAT_CONFIG.map((item, index) => (
                                    <button
                                        key={item.dataKey}
                                        ref={(element) => {
                                            statPill.refs.current[index] = element;
                                        }}
                                        type="button"
                                        className={`client-tracking-selector-btn ${activeStat === index ? "client-tracking-selector-btn-active" : ""}`}
                                        onClick={() => setActiveStat(index)}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                            <div className="client-tracking-selector-cont">
                                <div className="client-tracking-selector-pill" style={periodPill.style}/>
                                {["Week", "Month"].map((label, index) => (
                                    <button
                                        key={label}
                                        ref={(element) => {
                                            periodPill.refs.current[index] = element;
                                        }}
                                        type="button"
                                        className={`client-tracking-selector-btn ${activePeriod === index ? "client-tracking-selector-btn-active" : ""}`}
                                        onClick={() => setActivePeriod(index)}
                                    >
                                        {label}
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
                            chartData={chartData}
                            loading={isChartLoading}
                            emptyText="Loading data..."
                        />
                    </div>
                </div>

                <div className="client-tracking-panel-cont">
                    <MeasurementProgressSection
                        title="Body measurements progress"
                        description="Track how the client's body measurements change across saved snapshots."
                        fields={MEASUREMENT_FIELDS}
                        activeField={activeMeasurementField}
                        onFieldChange={setActiveMeasurementField}
                        data={measurementProgressData}
                        unit={activeMeasurementMeta.unit}
                        isLoading={isMeasurementsLoading}
                        loadingText="Loading body measurements..."
                        emptyText="No body measurement history yet."
                    />
                </div>

                <div className="client-tracking-workouts-cont">
                    <h2>Client workouts</h2>
                    {workouts.length === 0 && (
                        <p className="client-tracking-hint-text">No workouts yet.</p>
                    )}
                    {workouts.map((workout) => (
                        <div key={workout.workoutId} className="client-tracking-workout-card">
                            <div>
                                <strong>{workout.workoutName || "Workout"}</strong>
                                <p>{workout.startTime ? new Date(workout.startTime).toLocaleString() : "No time"}</p>
                            </div>
                            <div className="client-tracking-workout-stats">
                                <span>Tonnage: {Number(workout.totalTonnage) || 0}</span>
                                <span>Calories: {Number(workout.caloriesBurned) || 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClientTrackingPage;
