import { useCallback, useEffect, useState } from "react";
import trainerService from "../../../services/trainerService";
import trainingProgramService from "../../../services/trainingProgramService";
import { getErrorMessage } from "./useAsyncFeedback";
import { useTranslation } from "react-i18next";

const useClientProgramAssignments = ({
    clients = [],
    onSuccess,
    onError
} = {}) => {
    const { t } = useTranslation();
    const [programs, setPrograms] = useState([]);
    const [selectedProgramByClient, setSelectedProgramByClient] = useState({});
    const [activeProgramClientId, setActiveProgramClientId] = useState(null);

    const syncSelectedPrograms = useCallback(() => {
        setSelectedProgramByClient((previous) => {
            const next = { ...previous };
            clients.forEach((client) => {
                const initialProgramValue = client?.programId ? String(client.programId) : "none";
                next[client.clientId] = initialProgramValue;
            });
            return next;
        });
    }, [clients]);

    const loadPrograms = useCallback(async () => {
        const response = await trainingProgramService.getMyCreated();
        const list = response?.data?.data || [];
        setPrograms(list);
    }, []);

    useEffect(() => {
        syncSelectedPrograms();
    }, [syncSelectedPrograms]);

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
                onSuccess?.(response?.data?.message || t("trainer_clients.errors.programRemoved"));
            } else {
                const response = await trainerService.assignProgramToAthlete(selectedProgramId, clientId);
                onSuccess?.(response?.data?.message || t("trainer_clients.errors.programAssigned"));
            }
        } catch (error) {
            onError?.(getErrorMessage(error, t("trainer_clients.errors.applyProgramFailed")));
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
