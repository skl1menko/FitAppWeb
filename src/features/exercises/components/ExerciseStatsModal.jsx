import { useState } from "react";
import { FiClock, FiCalendar } from "../../../assets/icons";
import { IoStatsChart } from "../../../assets/icons";
import { FaArrowTrendUp } from "react-icons/fa6";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { formatGroupedNumber } from "../../../utils/formatNumber";
import "./ExerciseStatsModal.scss";

const StatCard = ({ label, value, suffix }) => {
    return (
        <div className="exercise-stat-card">
            <span className="exercise-stat-label">{label}</span>
            <span className="exercise-stat-value">
                {value}
                {suffix ? <span className="exercise-stat-suffix">{suffix}</span> : null}
            </span>
        </div>
    );
};

const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) {
        return null;
    }

    const point = payload[0]?.payload || {};

    return (
        <div className="exercise-chart-tooltip">
            <p className="tooltip-date">{label}</p>
            <p className="tooltip-row">
                <span>Weight</span>
                <strong>{formatGroupedNumber(point.weightKg || 0)} kg</strong>
            </p>
        </div>
    );
};

const renderSelectableDot = (selectedWorkoutId, setSelectedPoint, totalPoints) => (props) => {
    const { cx, cy, payload, index } = props;

    if (cx == null || cy == null || !payload) {
        return null;
    }

    const isSelected = payload.workoutId === selectedWorkoutId;
    const labelY = cy + 24;
    const isLeftEdge = index === 0;
    const isRightEdge = index === totalPoints - 1;
    const labelX = isLeftEdge ? cx + 8 : isRightEdge ? cx - 8 : cx;
    const labelAnchor = isLeftEdge ? "start" : isRightEdge ? "end" : "middle";

    return (
        <g>
            <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 9 : 7}
                fill={isSelected ? "#2563eb" : "#fff"}
                stroke="#2563eb"
                strokeWidth={2}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedPoint(payload)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedPoint(payload);
                    }
                }}
                role="button"
                tabIndex={0}
            />
            <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 4 : 3}
                fill={isSelected ? "#fff" : "#2563eb"}
                style={{ pointerEvents: "none" }}
            />
            {isSelected ? (
                <text
                    x={labelX}
                    y={labelY}
                    textAnchor={labelAnchor}
                    className="exercise-chart-point-label"
                >
                    {formatGroupedNumber(payload.weightKg || 0)} kg
                </text>
            ) : null}
        </g>
    );
};

const ExerciseStatsModal = ({ isOpen, exercise, stats = {}, isLoading = false, error = "", onClose }) => {
    const [selectedPoint, setSelectedPoint] = useState(null);

    if (!isOpen) {
        return null;
    }

    const chartData = Array.isArray(stats?.chartData) ? stats.chartData : [];
    const hasData = chartData.length > 0;
    const exerciseName = exercise?.exerciseName || exercise?.name || "Exercise";
    const muscleGroup = exercise?.muscleGroup || "General";
    const imageUrl = exercise?.imageUrl || exercise?.image_url || "";
    const lastSession = chartData.at(-1);

    return (
        <div className="exercise-stats-modal" role="dialog" aria-modal="true" aria-labelledby="exercise-stats-title">
            <div className="exercise-stats-backdrop" onClick={onClose} />
            <div className="exercise-stats-card" onClick={(event) => event.stopPropagation()}>
                <div className="exercise-stats-head">
                    <div className="exercise-stats-hero">
                        <div className="exercise-stats-image">
                            {imageUrl ? <img src={imageUrl} alt={exerciseName} /> : <IoStatsChart aria-hidden="true" />}
                        </div>
                        <div className="exercise-stats-title-block">
                            <span className="exercise-stats-kicker">Exercise statistics</span>
                            <h2 id="exercise-stats-title">{exerciseName}</h2>
                            <div className="exercise-stats-meta">
                                <span>{muscleGroup}</span>
                                {stats?.trackedWorkouts ? (
                                    <span>{formatGroupedNumber(stats.trackedWorkouts)} tracked workouts</span>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <button type="button" className="exercise-stats-close" onClick={onClose} aria-label="Close exercise statistics">
                        x
                    </button>
                </div>

                {error ? <div className="exercise-stats-state error">{error}</div> : null}
                {isLoading ? <div className="exercise-stats-state">Loading stats...</div> : null}

                {!isLoading && !error ? (
                    <>
                        <div className="exercise-stats-grid">
                            <StatCard
                                label="Max reps in a set"
                                value={formatGroupedNumber(stats?.maxReps || 0)}
                                suffix=" reps"
                            />
                            <StatCard
                                label="Max weight"
                                value={formatGroupedNumber(stats?.maxWeight || 0)}
                                suffix=" kg"
                            />
                            <StatCard
                                label="Max workout volume"
                                value={formatGroupedNumber(stats?.maxVolume || 0)}
                                suffix=" kg"
                            />
                            <StatCard
                                label="Tracked workouts"
                                value={formatGroupedNumber(stats?.trackedWorkouts || 0)}
                            />
                        </div>

                        <div className="exercise-stats-main">
                            <div className="exercise-stats-chart-card">
                                <div className="exercise-stats-section-head">
                                    <span className="section-kicker"><FaArrowTrendUp aria-hidden="true" /> Weight trend</span>
                                    <span className="section-note">
                                        {hasData ? `Last session: ${lastSession?.label || "-"}` : "No completed workouts yet"}
                                    </span>
                                </div>

                                <div className="exercise-stats-chart-wrap">
                                    {hasData ? (
                                        <ResponsiveContainer width="100%" height={280}>
                                            <LineChart data={chartData} margin={{ top: 12, right: 12, left: -12, bottom: 26 }}>
                                                <defs>
                                                    <linearGradient id="exercise-weight-gradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e8eef8" vertical={false} />
                                                <XAxis
                                                    dataKey="label"
                                                    tick={{ fontSize: 12, fill: "#8a97ab" }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <YAxis
                                                    tick={{ fontSize: 12, fill: "#8a97ab" }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    width={52}
                                                    tickFormatter={(value) => formatGroupedNumber(value)}
                                                />
                                                <Tooltip content={<ChartTooltip />} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="weightKg"
                                                    stroke="#2563eb"
                                                    strokeWidth={3}
                                                    fill="url(#exercise-weight-gradient)"
                                                    dot={renderSelectableDot(selectedPoint?.workoutId, setSelectedPoint, chartData.length)}
                                                    activeDot={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="exercise-stats-empty">
                                            <IoStatsChart aria-hidden="true" />
                                            <p>There is not enough completed workout history for this exercise yet.</p>
                                        </div>
                                    )}
                                </div>

                            </div>

                            <div className="exercise-stats-list-card">
                                <div className="exercise-stats-section-head">
                                    <span className="section-kicker"><FiCalendar aria-hidden="true" /> Recent sessions</span>
                                    <span className="section-note">Workout volume and best set per session</span>
                                </div>

                                <div className="exercise-session-list">
                                    {chartData.length === 0 ? (
                                        <div className="exercise-session-empty">
                                            <FiClock aria-hidden="true" />
                                            <span>No sessions to show</span>
                                        </div>
                                    ) : chartData.slice().reverse().map((point) => (
                                        <div className="exercise-session-row" key={`${point.workoutId}-${point.dateValue}`}>
                                            <div>
                                                <strong>{point.workoutName}</strong>
                                                <span>{point.label}</span>
                                            </div>
                                            <div className="exercise-session-values">
                                                <span>{formatGroupedNumber(point.weightKg)} kg</span>
                                                <span>{formatGroupedNumber(point.volumeKg)} kg volume</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default ExerciseStatsModal;
