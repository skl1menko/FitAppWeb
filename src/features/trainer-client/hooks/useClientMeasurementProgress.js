import { useEffect, useState } from "react";
import trainerService from "../../../services/trainerService";
import {
    formatDateInput,
    formatMeasurementDateTime,
    formatMeasurementLabel,
    isNotFoundError
} from "../utils/clientTrackingUtils";
import { getErrorMessage } from "./useAsyncFeedback";
import { useTranslation } from "react-i18next";

const useClientMeasurementProgress = ({
    clientId,
    role,
    activeMeasurementField
} = {}) => {
    const { t, i18n } = useTranslation();
    const [measurementProgressData, setMeasurementProgressData] = useState([]);
    const [isMeasurementsLoading, setIsMeasurementsLoading] = useState(false);
    const [measurementsError, setMeasurementsError] = useState("");

    useEffect(() => {
        if (role !== "trainer") {
            return;
        }

        const loadMeasurementProgress = async () => {
            setIsMeasurementsLoading(true);
            setMeasurementsError("");

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
                    label: formatMeasurementLabel(point.date, i18n.resolvedLanguage),
                    fullLabel: formatMeasurementDateTime(point.date, i18n.resolvedLanguage),
                    value: Number(point.value) || 0
                })));
            } catch (progressError) {
                if (isNotFoundError(progressError)) {
                    setMeasurementProgressData([]);
                } else {
                    setMeasurementsError(getErrorMessage(progressError, t("trainer_clients.errors.loadMeasurementProgressFailed")));
                }
            } finally {
                setIsMeasurementsLoading(false);
            }
        };

        loadMeasurementProgress();
    }, [activeMeasurementField, clientId, i18n.resolvedLanguage, role, t]);

    return {
        measurementProgressData,
        isMeasurementsLoading,
        measurementsError
    };
};

export default useClientMeasurementProgress;
