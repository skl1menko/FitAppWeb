
import healthMetricsService from "../../../../services/healthMetricsService";
import { useEffect, useMemo, useState } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from "recharts";
import "./ActivityChart.scss";
import { STAT_CONFIG, transformMetrics, transformMonthMetrics } from "./chartUtils";

const CustomTooltip = ({ active, payload, label, unit }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="activity-chart-tooltip">
            <p className="tooltip-day">{label}</p>
            <p className="tooltip-value">
                {payload[0].value.toLocaleString()}{unit}
            </p>
        </div>
    );
};

const ActivityChart = ({
    startDate,
    endDate,
    activeStat = 0,
    activePeriod = 0,
    chartData: externalChartData,
    loading: externalLoading,
    emptyText = "Loading..."
}) => {
    const [internalChartData, setInternalChartData] = useState([]);
    const [internalLoading, setInternalLoading] = useState(true);

    const { dataKey, color, unit } = STAT_CONFIG[activeStat];
    const isMonth = activePeriod === 1;
    const hasExternalData = Array.isArray(externalChartData);

    useEffect(() => {
        if (hasExternalData) {
            return;
        }

        setInternalLoading(true);
        const periodType = isMonth ? 'monthly' : 'weekly';
        healthMetricsService.getByPeriod(periodType, startDate, endDate)
            .then(res => {
                const metrics = res.data?.data?.detailedMetrics ?? [];
                const sorted = [...metrics].sort((a, b) => a.endDate.localeCompare(b.endDate));
                setInternalChartData(
                    isMonth
                        ? transformMonthMetrics(sorted, startDate, endDate)
                        : transformMetrics(sorted, startDate, endDate)
                );
            })
            .catch(err => {
                console.error('Error fetching metrics:', err);
                setInternalChartData([]);
            })
            .finally(() => setInternalLoading(false));
    }, [endDate, hasExternalData, isMonth, startDate]);

    const chartData = useMemo(
        () => (hasExternalData ? externalChartData : internalChartData),
        [externalChartData, hasExternalData, internalChartData]
    );

    const loading = hasExternalData ? Boolean(externalLoading) : internalLoading;

    const gradientId = `gradient-${dataKey}-${activePeriod}`;

    if (loading) {
        return <div className="activity-chart-empty">{emptyText}</div>;
    }

    if (!chartData?.length) {
        return <div className="activity-chart-empty">No data available.</div>;
    }

    return (
        <div className="activity-chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.18} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12, fill: "#9CA3AF" }}
                        axisLine={false}
                        tickLine={false}
                        interval={isMonth ? 4 : 0}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "#9CA3AF" }}
                        axisLine={false}
                        tickLine={false}
                        width={50}
                        tickFormatter={(v) => v.toLocaleString()}
                    />
                    <Tooltip
                        content={<CustomTooltip unit={unit} />}
                        cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "4 4" }}
                    />
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={2.5}
                        fill={`url(#${gradientId})`}
                        dot={{ r: 4, fill: "#fff", stroke: color, strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: color, stroke: "#fff", strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActivityChart;
