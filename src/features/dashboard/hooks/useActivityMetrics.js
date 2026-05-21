import { useEffect, useState } from "react";
import healthMetricsService from "../../../services/healthMetricsService";
import { transformMetrics, transformMonthMetrics } from "../components/ActivityOverview/chartUtils";

const useActivityMetrics = ({ startDate, endDate, isMonth, enabled = true }) => {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(enabled);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!enabled) {
            return;
        }

        let isCancelled = false;

        const loadMetrics = async () => {
            setIsLoading(true);
            setError("");

            try {
                const periodType = isMonth ? "monthly" : "weekly";
                const response = await healthMetricsService.getByPeriod(periodType, startDate, endDate);
                const metrics = response?.data?.data?.detailedMetrics ?? [];
                const sortedMetrics = [...metrics].sort((a, b) => a.endDate.localeCompare(b.endDate));
                const nextChartData = isMonth
                    ? transformMonthMetrics(sortedMetrics, startDate, endDate)
                    : transformMetrics(sortedMetrics, startDate, endDate);

                if (isCancelled) {
                    return;
                }

                setChartData(nextChartData);
            } catch (loadError) {
                if (isCancelled) {
                    return;
                }

                setChartData([]);
                setError(loadError?.response?.data?.message || "Failed to load activity data");
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadMetrics();

        return () => {
            isCancelled = true;
        };
    }, [enabled, endDate, isMonth, startDate]);

    return {
        chartData,
        isLoading,
        error
    };
};

export default useActivityMetrics;
