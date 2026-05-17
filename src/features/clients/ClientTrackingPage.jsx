import {useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router";
import {ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line} from "recharts";
import {FiArrowLeft, IoMdPerson, RiFireLine, IoFootstepsOutline, CiHeart, BsChevronDown} from "../../assets/icons";
import DatePickerCustom from "../../components/DatePickerCustom";
import trainerService from "../../services/trainerService";
import authService from "../../services/authService";
import useBodyClass from "../../hooks/useBodyClass";
import usePill from "../dashboard/components/ActivityOverview/usePill";
import {getWeekLabel, getWeekRange, getMonthLabel, getMonthRange} from "../dashboard/components/ActivityOverview/dateRangeUtils";
import {STAT_CONFIG, transformMetrics, transformMonthMetrics} from "../dashboard/components/ActivityOverview/chartUtils";
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

const CustomTooltip = ({active, payload, label, unit}) => {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="client-tracking-page__chart-tooltip">
            <p className="client-tracking-page__chart-tooltip-day">{label}</p>
            <p className="client-tracking-page__chart-tooltip-value">
                {Number(payload[0].value || 0).toLocaleString()}
                {unit}
            </p>
        </div>
    );
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

const MeasurementTooltip = ({active, payload, unit}) => {
    if (!active || !payload?.length) {
        return null;
    }

    const point = payload[0]?.payload || {};

    return (
        <div className="client-tracking-page__chart-tooltip">
            <p className="client-tracking-page__chart-tooltip-day">{point.fullLabel || point.label}</p>
            <p className="client-tracking-page__chart-tooltip-value">
                {Number(payload[0].value || 0).toLocaleString(undefined, {maximumFractionDigits: 1})}
                {unit}
            </p>
        </div>
    );
};

const ClientTrackingPage = () => {
    useBodyClass("client-tracking-body");

    const navigate = useNavigate();
    const {state} = useLocation();
    const {clientId} = useParams();
    const role = authService.getUser()?.role;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeStat, setActiveStat] = useState(0);
    const [activePeriod, setActivePeriod] = useState(0);
    const [weekOffset, setWeekOffset] = useState(0);
    const [monthOffset, setMonthOffset] = useState(0);
    const [clientInfo, setClientInfo] = useState({
        clientName: state?.clientName || "Client",
        clientEmail: state?.clientEmail || ""
    });
    const [workouts, setWorkouts] = useState([]);
    const [dailyMetrics, setDailyMetrics] = useState({
        totalEnergyBurned: 0,
        totalStepCount: 0,
        avgHeartRate: 0
    });
    const [chartData, setChartData] = useState([]);
    const [measurementProgressData, setMeasurementProgressData] = useState([]);
    const [activeMeasurementField, setActiveMeasurementField] = useState("body_weight");
    const [isStatsLoading, setIsStatsLoading] = useState(false);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [isMeasurementsLoading, setIsMeasurementsLoading] = useState(false);
    const [error, setError] = useState("");
    const [warning, setWarning] = useState("");

    const selectedDateString = useMemo(() => formatDateInput(selectedDate), [selectedDate]);
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

        const loadDailyMetrics = async () => {
            setWarning("");
            setIsStatsLoading(true);

            const result = await Promise.allSettled([
                trainerService.getClientDailyHealthMetrics(clientId, selectedDateString)
            ]);
            const dailyResult = result[0];

            if (dailyResult.status === "fulfilled") {
                const summary = dailyResult.value?.data?.data?.summary || {};
                const clientData = dailyResult.value?.data?.data?.client;
                setDailyMetrics({
                    totalEnergyBurned: Number(summary.totalEnergyBurned) || 0,
                    totalStepCount: Number(summary.totalStepCount) || 0,
                    avgHeartRate: Number(summary.avgHeartRate) || 0
                });
                if (clientData) {
                    setClientInfo({
                        clientName: clientData.clientName || state?.clientName || "Client",
                        clientEmail: clientData.clientEmail || state?.clientEmail || ""
                    });
                }
                setIsStatsLoading(false);
                return;
            }

            if (isNotFoundError(dailyResult.reason)) {
                setDailyMetrics(buildFallbackDailyMetricsFromWorkouts(workouts, selectedDateString));
                setWarning("Health metrics API is unavailable on current backend, so day stats are built from workouts.");
            } else {
                setDailyMetrics({
                    totalEnergyBurned: 0,
                    totalStepCount: 0,
                    avgHeartRate: 0
                });
                setError(dailyResult.reason?.response?.data?.message || "Failed to load daily metrics.");
            }

            setIsStatsLoading(false);
        };

        loadDailyMetrics();
    }, [clientId, role, selectedDateString, workouts, state?.clientEmail, state?.clientName]);

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

    const latestMeasurementPoint = measurementProgressData.at(-1) || null;
    const previousMeasurementPoint = measurementProgressData.length > 1 ? measurementProgressData.at(-2) : null;
    const measurementDelta = latestMeasurementPoint && previousMeasurementPoint
        ? latestMeasurementPoint.value - previousMeasurementPoint.value
        : null;

    if (role !== "trainer") {
        return (
            <div className="client-tracking-page">
                <div className="client-tracking-page__content">
                    <h1>Client tracking</h1>
                    <p>This page is available only for trainers.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="client-tracking-page">
            <div className="client-tracking-page__content">
                <button
                    type="button"
                    className="client-tracking-page__back-btn"
                    onClick={() => navigate("/clients")}
                >
                    <FiArrowLeft/>
                    Back to clients
                </button>

                <div className="client-tracking-page__hero">
                    <div className="client-tracking-page__hero-main">
                        <div className="client-tracking-page__avatar">
                            <IoMdPerson/>
                        </div>
                        <div>
                            <h1>{clientInfo.clientName}</h1>
                            <p>{clientInfo.clientEmail}</p>
                        </div>
                    </div>
                    <div className="client-tracking-page__date-box">
                        <label>Date</label>
                        <DatePickerCustom value={selectedDate} onChange={setSelectedDate}/>
                    </div>
                </div>

                {error && <p className="client-tracking-page__error">{error}</p>}
                {warning && <p className="client-tracking-page__warning">{warning}</p>}
                {(isStatsLoading || isChartLoading) && <p className="client-tracking-page__hint">Loading data...</p>}

                <div className="client-tracking-page__stats-grid">
                    <div className="client-tracking-page__stat-card">
                        <RiFireLine/>
                        <div>
                            <span>Energy burned</span>
                            <strong>{dailyMetrics.totalEnergyBurned}</strong>
                        </div>
                    </div>
                    <div className="client-tracking-page__stat-card">
                        <IoFootstepsOutline/>
                        <div>
                            <span>Steps</span>
                            <strong>{dailyMetrics.totalStepCount}</strong>
                        </div>
                    </div>
                    <div className="client-tracking-page__stat-card">
                        <CiHeart/>
                        <div>
                            <span>Avg heart rate</span>
                            <strong>{dailyMetrics.avgHeartRate}</strong>
                        </div>
                    </div>
                </div>

                <div className="client-tracking-page__chart-card">
                    <div className="client-tracking-page__chart-header-container">
                        <div className="client-tracking-page__chart-header">
                            <h2>Health metrics trend</h2>
                            <div className="client-tracking-page__week-picker">
                                <button
                                    type="button"
                                    className="client-tracking-page__week-picker-btn"
                                    onClick={() => (isWeek ? setWeekOffset((value) => value - 1) : setMonthOffset((value) => value - 1))}
                                >
                                    <BsChevronDown size={12} className="client-tracking-page__week-arrow client-tracking-page__week-arrow--left"/>
                                </button>
                                <span className="client-tracking-page__week-picker-label">{pickerLabel}</span>
                                <button
                                    type="button"
                                    className="client-tracking-page__week-picker-btn"
                                    onClick={() => (isWeek ? setWeekOffset((value) => value + 1) : setMonthOffset((value) => value + 1))}
                                >
                                    <BsChevronDown size={12} className="client-tracking-page__week-arrow client-tracking-page__week-arrow--right"/>
                                </button>
                            </div>
                        </div>
                        <div className="client-tracking-page__selector-row">
                            <div className="client-tracking-page__selector-cont">
                                <div className="client-tracking-page__selector-pill" style={statPill.style}/>
                                {STAT_CONFIG.map((item, index) => (
                                    <button
                                        key={item.dataKey}
                                        ref={(element) => {
                                            statPill.refs.current[index] = element;
                                        }}
                                        type="button"
                                        className={`client-tracking-page__selector-btn ${activeStat === index ? "client-tracking-page__selector-btn--active" : ""}`}
                                        onClick={() => setActiveStat(index)}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                            <div className="client-tracking-page__selector-cont">
                                <div className="client-tracking-page__selector-pill" style={periodPill.style}/>
                                {["Week", "Month"].map((label, index) => (
                                    <button
                                        key={label}
                                        ref={(element) => {
                                            periodPill.refs.current[index] = element;
                                        }}
                                        type="button"
                                        className={`client-tracking-page__selector-btn ${activePeriod === index ? "client-tracking-page__selector-btn--active" : ""}`}
                                        onClick={() => setActivePeriod(index)}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="client-tracking-page__chart-wrap">
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={chartData} margin={{top: 10, right: 10, left: -10, bottom: 0}}>
                                <defs>
                                    <linearGradient id="client-tracking-gradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={STAT_CONFIG[activeStat].color} stopOpacity={0.18}/>
                                        <stop offset="95%" stopColor={STAT_CONFIG[activeStat].color} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                                <XAxis
                                    dataKey="day"
                                    tick={{fontSize: 12, fill: "#9CA3AF"}}
                                    axisLine={false}
                                    tickLine={false}
                                    interval={activePeriod === 1 ? 4 : 0}
                                />
                                <YAxis
                                    tick={{fontSize: 12, fill: "#9CA3AF"}}
                                    axisLine={false}
                                    tickLine={false}
                                    width={50}
                                    tickFormatter={(value) => Number(value || 0).toLocaleString()}
                                />
                                <Tooltip
                                    content={<CustomTooltip unit={STAT_CONFIG[activeStat].unit}/>}
                                    cursor={{
                                        stroke: STAT_CONFIG[activeStat].color,
                                        strokeWidth: 1,
                                        strokeDasharray: "4 4"
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={STAT_CONFIG[activeStat].dataKey}
                                    stroke={STAT_CONFIG[activeStat].color}
                                    strokeWidth={2.5}
                                    fill="url(#client-tracking-gradient)"
                                    dot={{r: 4, fill: "#fff", stroke: STAT_CONFIG[activeStat].color, strokeWidth: 2}}
                                    activeDot={{r: 6, fill: STAT_CONFIG[activeStat].color, stroke: "#fff", strokeWidth: 2}}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="client-tracking-page__chart-card">
                    <div className="client-tracking-page__chart-header-container">
                        <div className="client-tracking-page__chart-header">
                            <h2>Body measurements progress</h2>
                            <p className="client-tracking-page__subtext">See how the client measurements change across saved snapshots.</p>
                        </div>
                        <div className="client-tracking-page__selector-row">
                            <div className="client-tracking-page__selector-cont client-tracking-page__selector-cont--wrap">
                                {MEASUREMENT_FIELDS.map((field) => (
                                    <button
                                        key={field.key}
                                        type="button"
                                        className={`client-tracking-page__selector-btn ${activeMeasurementField === field.key ? "client-tracking-page__selector-btn--active" : ""}`}
                                        onClick={() => setActiveMeasurementField(field.key)}
                                    >
                                        {field.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="client-tracking-page__measurements-grid">
                        <div className="client-tracking-page__chart-wrap client-tracking-page__chart-wrap--measurements">
                            {isMeasurementsLoading ? (
                                <p className="client-tracking-page__hint">Loading body measurements...</p>
                            ) : measurementProgressData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={320}>
                                    <LineChart data={measurementProgressData} margin={{top: 10, right: 10, left: -10, bottom: 0}}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                                        <XAxis
                                            dataKey="chartKey"
                                            tick={{fontSize: 12, fill: "#9CA3AF"}}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(_, index) => measurementProgressData[index]?.label || ""}
                                            minTickGap={24}
                                        />
                                        <YAxis
                                            tick={{fontSize: 12, fill: "#9CA3AF"}}
                                            axisLine={false}
                                            tickLine={false}
                                            width={50}
                                            tickFormatter={(value) => Number(value || 0).toLocaleString(undefined, {maximumFractionDigits: 1})}
                                        />
                                        <Tooltip content={<MeasurementTooltip unit={activeMeasurementMeta.unit}/>}/>
                                        <Line
                                            type="linear"
                                            dataKey="value"
                                            stroke="#2563eb"
                                            strokeWidth={2.5}
                                            dot={{r: 4, fill: "#fff", stroke: "#2563eb", strokeWidth: 2}}
                                            activeDot={{r: 6, fill: "#2563eb", stroke: "#fff", strokeWidth: 2}}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="client-tracking-page__hint">No body measurement history yet.</p>
                            )}
                        </div>

                        <div className="client-tracking-page__measurements-summary">
                            <div className="client-tracking-page__measurement-card">
                                <span>Latest value</span>
                                <strong>
                                    {latestMeasurementPoint
                                        ? `${latestMeasurementPoint.value.toLocaleString(undefined, {maximumFractionDigits: 1})}${activeMeasurementMeta.unit}`
                                        : "No data"}
                                </strong>
                            </div>
                            <div className="client-tracking-page__measurement-card">
                                <span>Change vs previous</span>
                                <strong className={measurementDelta === null ? "" : measurementDelta >= 0 ? "positive" : "negative"}>
                                    {measurementDelta === null
                                        ? "No data"
                                        : `${measurementDelta >= 0 ? "+" : ""}${measurementDelta.toLocaleString(undefined, {maximumFractionDigits: 1})}${activeMeasurementMeta.unit}`}
                                </strong>
                            </div>
                            <div className="client-tracking-page__measurement-card">
                                <span>Saved points</span>
                                <strong>{measurementProgressData.length}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="client-tracking-page__workouts">
                    <h2>Client workouts</h2>
                    {workouts.length === 0 && (
                        <p className="client-tracking-page__hint">No workouts yet.</p>
                    )}
                    {workouts.map((workout) => (
                        <div key={workout.workoutId} className="client-tracking-page__workout-card">
                            <div>
                                <strong>{workout.workoutName || "Workout"}</strong>
                                <p>{workout.startTime ? new Date(workout.startTime).toLocaleString() : "No time"}</p>
                            </div>
                            <div className="client-tracking-page__workout-stats">
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
