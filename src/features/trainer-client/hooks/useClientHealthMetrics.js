import { useEffect, useState } from "react";
import trainerService from "../../../services/trainerService";
import {
    buildChartData,
    buildFallbackChartDataFromWorkouts,
    isNotFoundError
} from "../utils/clientTrackingUtils";
import { getErrorMessage } from "./useAsyncFeedback";

const useClientHealthMetrics = ({
    clientId,
    role,
    startDate,
    endDate,
    workouts = [],
    activePeriod
} = {}) => {
    const [chartData, setChartData] = useState([]);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [chartError, setChartError] = useState("");
    const [warning, setWarning] = useState("");

    useEffect(() => {
        if (role !== "trainer") {
            return;
        }

        const loadChart = async () => {
            setIsChartLoading(true);
            setChartError("");
            setWarning("");

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
                setChartError(getErrorMessage(chartResult.reason, "Failed to load chart metrics."));
            }

            setIsChartLoading(false);
        };

        loadChart();
    }, [activePeriod, clientId, endDate, role, startDate, workouts]);

    return {
        chartData,
        isChartLoading,
        chartError,
        warning
    };
};

export default useClientHealthMetrics;
