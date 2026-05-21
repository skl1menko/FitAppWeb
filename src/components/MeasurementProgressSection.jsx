import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import "./MeasurementProgressSection.scss";

const formatMeasurementValue = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "0";
    }

    return Number(value).toLocaleString(undefined, {
        maximumFractionDigits: 1
    });
};

const MeasurementProgressTooltip = ({active, payload, unit}) => {
    if (!active || !payload?.length) {
        return null;
    }

    const point = payload[0]?.payload || {};

    return (
        <div className="measurement-progress-chart-tooltip">
            <p>{point.fullLabel || point.label}</p>
            <strong>{formatMeasurementValue(payload[0]?.value)} {unit}</strong>
        </div>
    );
};

const MeasurementProgressSection = ({
    title,
    fields,
    activeField,
    onFieldChange,
    data,
    unit,
    isLoading,
    loadingText,
    emptyText
}) => {
    const activePoint = data.at(-1) || null;
    const previousPoint = data.length > 1 ? data.at(-2) : null;
    const delta = activePoint && previousPoint ? activePoint.value - previousPoint.value : null;

    return (
        <div className="measurement-progress-section">
            <div className="measurement-progress-header-cont">
                <div className="measurement-progress-header">
                    <h2>{title}</h2>
                </div>
            </div>

            <div className="measurement-progress-selector-row">
                <div className="measurement-progress-selector-cont measurement-progress-selector-cont-wrap">
                    {fields.map((field) => (
                        <button
                            key={field.key}
                            type="button"
                            className={`measurement-progress-selector-btn ${activeField === field.key ? "measurement-progress-selector-btn-active" : ""}`}
                            onClick={() => onFieldChange(field.key)}
                        >
                            {field.label}
                        </button>
                    ))}
                </div>
                <div className="measurement-progress-summary">
                    <div className="measurement-progress-stat">
                        <span className="measurement-progress-stat-label">Latest value</span>
                        <strong>
                            {activePoint ? `${formatMeasurementValue(activePoint.value)} ${unit}` : "No data"}
                        </strong>
                    </div>
                    <div className="measurement-progress-stat">
                        <span className="measurement-progress-stat-label">Change value</span>
                        <strong className={delta === null ? "" : delta >= 0 ? "positive" : "negative"}>
                            {delta === null ? "No data" : `${delta >= 0 ? "+" : ""}${formatMeasurementValue(delta)} ${unit}`}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="measurement-progress-grid">
                <div className="measurement-progress-chart-wrap">
                    {isLoading ? (
                        <p className="measurement-progress-hint-text">{loadingText}</p>
                    ) : data.length > 0 ? (
                        <ResponsiveContainer width="100%" height={340}>
                            <LineChart data={data} margin={{top: 12, right: 12, left: -12, bottom: 0}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5edf8" vertical={false} />
                                <XAxis
                                    dataKey="chartKey"
                                    tick={{fontSize: 12, fill: "#8a97ab"}}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(_, index) => data[index]?.label || ""}
                                    minTickGap={24}
                                />
                                <YAxis
                                    tick={{fontSize: 12, fill: "#8a97ab"}}
                                    axisLine={false}
                                    tickLine={false}
                                    width={58}
                                    tickFormatter={(value) => formatMeasurementValue(value)}
                                />
                                <Tooltip content={<MeasurementProgressTooltip unit={unit} />} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={{r: 5, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2}}
                                    activeDot={{r: 7, fill: "#1d4ed8", stroke: "#ffffff", strokeWidth: 2}}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="measurement-progress-empty">
                            <p>{emptyText}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MeasurementProgressSection;
