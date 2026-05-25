import { useEffect, useState } from "react";
import trainerService from "../../../services/trainerService";
import {
    buildChartData,
    buildFallbackChartDataFromWorkouts,
    isNotFoundError
} from "../utils/clientTrackingUtils";
import { getErrorMessage } from "./useAsyncFeedback";
import { useTranslation } from "react-i18next";

const useClientHealthMetrics = ({
    clientId,
    role,
    startDate,
    endDate,
    workouts = [],
    activePeriod
} = {}) => {
    const { t } = useTranslation();
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
                setWarning(t("trainer_clients.tracking.unavailableMetricsWarning"));
            } else {
                setChartData([]);
                setChartError(getErrorMessage(chartResult.reason, t("trainer_clients.errors.loadChartMetricsFailed")));
            }

            setIsChartLoading(false);
        };

        loadChart();
    }, [activePeriod, clientId, endDate, role, startDate, workouts, t]);

    return {
        chartData,
        isChartLoading,
        chartError,
        warning
    };
};

export default useClientHealthMetrics;
