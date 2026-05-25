import { useEffect, useState } from "react";
import trainerService from "../../../services/trainerService";
import {
    normalizeTrainerClientWorkoutDetails
} from "../utils/normalizeTrainerClient";
import { getErrorMessage } from "./useAsyncFeedback";
import { useTranslation } from "react-i18next";

const useClientWorkoutDetails = ({
    clientId,
    workoutId,
    optimisticClientInfo
} = {}) => {
    const { t } = useTranslation();
    const [clientInfo, setClientInfo] = useState(optimisticClientInfo);
    const [workout, setWorkout] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadWorkout = async () => {
            setError("");

            try {
                const response = await trainerService.getClientWorkoutDetails(clientId, workoutId);
                if (!active) {
                    return;
                }

                const details = normalizeTrainerClientWorkoutDetails(response?.data?.data);
                setWorkout(details.workout);

                if (details.client) {
                    setClientInfo(details.client);
                }
            } catch (loadError) {
                if (!active) {
                    return;
                }

                setWorkout(null);
                setError(getErrorMessage(loadError, t("trainer_clients.errors.loadClientWorkoutDetailsFailed")));
            }
        };

        loadWorkout();

        return () => {
            active = false;
        };
    }, [clientId, workoutId, t]);

    return {
        clientInfo,
        workout,
        workoutError: error
    };
};

export default useClientWorkoutDetails;
