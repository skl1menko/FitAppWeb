import { useEffect, useState } from "react";
import trainerService from "../../../services/trainerService";
import {
    normalizeTrainerClientWorkoutDetails
} from "../utils/normalizeTrainerClient";
import { getErrorMessage } from "./useAsyncFeedback";

const useClientWorkoutDetails = ({
    clientId,
    workoutId,
    optimisticClientInfo
} = {}) => {
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
                setError(getErrorMessage(loadError, "Failed to load client workout details."));
            }
        };

        loadWorkout();

        return () => {
            active = false;
        };
    }, [clientId, workoutId]);

    return {
        clientInfo,
        workout,
        workoutError: error
    };
};

export default useClientWorkoutDetails;
