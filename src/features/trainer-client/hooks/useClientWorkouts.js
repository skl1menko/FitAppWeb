import { useEffect, useState } from "react";
import trainerService from "../../../services/trainerService";
import {
    normalizeClientWorkouts,
    normalizeTrainerClientInfo
} from "../utils/normalizeTrainerClient";
import { getErrorMessage } from "./useAsyncFeedback";
import { useTranslation } from "react-i18next";

const useClientWorkouts = ({ clientId, role, optimisticClientInfo } = {}) => {
    const { t } = useTranslation();
    const [clientInfo, setClientInfo] = useState(optimisticClientInfo);
    const [workouts, setWorkouts] = useState([]);
    const [error, setError] = useState("");

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
                setWorkouts(normalizeClientWorkouts(workoutsData));

                if (clientData) {
                    setClientInfo(normalizeTrainerClientInfo(clientData));
                }

                return;
            }

            setWorkouts([]);
            setError(getErrorMessage(workoutsResult.reason, t("trainer_clients.errors.loadClientWorkoutsFailed")));
        };

        loadWorkouts();
    }, [clientId, role, t]);

    return {
        clientInfo,
        workouts,
        workoutsError: error
    };
};

export default useClientWorkouts;
