import { useEffect, useState } from "react";
import trainerService from "../../../services/trainerService";
import trainingProgramService from "../../../services/trainingProgramService";
import { getErrorMessage } from "./useAsyncFeedback";

const useClientProgramAssignments = ({
    clients = [],
    onSuccess,
    onError
} = {}) => {
    const [programs, setPrograms] = useState([]);
    const [selectedProgramByClient, setSelectedProgramByClient] = useState({});
    const [activeProgramClientId, setActiveProgramClientId] = useState(null);

    const syncSelectedPrograms = () => {
        setSelectedProgramByClient((previous) => {
            const next = { ...previous };
            clients.forEach((client) => {
                if (!next[client.clientId]) {
                    next[client.clientId] = "none";
                }
            });
            return next;
        });
    };

    const loadPrograms = async () => {
        const response = await trainingProgramService.getMyCreated();
        const list = response?.data?.data || [];
        setPrograms(list);
    };

    useEffect(() => {
        syncSelectedPrograms();
    }, [clients]);

    const handleProgramChange = (clientId, programId) => {
        setSelectedProgramByClient((previous) => ({
            ...previous,
            [clientId]: programId
        }));
    };

    const handleAssignProgram = async (clientId) => {
        const selectedProgramId = selectedProgramByClient[clientId] || "none";
        setActiveProgramClientId(clientId);

        try {
            if (selectedProgramId === "none") {
                const response = await trainerService.unassignAllProgramsFromAthlete(clientId);
                onSuccess?.(response?.data?.message || "Program removed");
            } else {
                const response = await trainerService.assignProgramToAthlete(selectedProgramId, clientId);
                onSuccess?.(response?.data?.message || "Program assigned successfully");
            }
        } catch (error) {
            onError?.(getErrorMessage(error, "Failed to apply program selection"));
        } finally {
            setActiveProgramClientId(null);
        }
    };

    return {
        programs,
        selectedProgramByClient,
        activeProgramClientId,
        loadPrograms,
        syncSelectedPrograms,
        handleProgramChange,
        handleAssignProgram
    };
};

export default useClientProgramAssignments;
