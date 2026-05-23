import { useEffect, useState } from "react";
import trainerService from "../../../services/trainerService";
import {
    normalizeClientWorkouts,
    normalizeTrainerClientInfo
} from "../utils/normalizeTrainerClient";
import { getErrorMessage } from "./useAsyncFeedback";

const useClientWorkouts = ({ clientId, role, optimisticClientInfo } = {}) => {
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
            setError(getErrorMessage(workoutsResult.reason, "Failed to load client workouts."));
        };

        loadWorkouts();
    }, [clientId, role]);

    return {
        clientInfo,
        workouts,
        workoutsError: error
    };
};

export default useClientWorkouts;
