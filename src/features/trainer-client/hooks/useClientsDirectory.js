import { useEffect, useMemo, useState } from "react";
import trainerService from "../../../services/trainerService";
import {
    normalizeAthletes,
    normalizeClients,
    normalizeTrainerRequests
} from "../utils/normalizeTrainerClient";
import useActionKey from "./useActionKey";
import useAsyncFeedback, { getErrorMessage } from "./useAsyncFeedback";
import useClientProgramAssignments from "./useClientProgramAssignments";

const useClientsDirectory = ({ role } = {}) => {
    const [query, setQuery] = useState("");
    const [athletes, setAthletes] = useState([]);
    const [clients, setClients] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingClients, setIsLoadingClients] = useState(false);
    const {
        message,
        error,
        clearFeedback,
        setSuccess,
        setFailure
    } = useAsyncFeedback();
    const {
        activeActionKey,
        startAction,
        finishAction
    } = useActionKey();
    const {
        programs,
        selectedProgramByClient,
        activeProgramClientId,
        loadPrograms,
        handleProgramChange,
        handleAssignProgram
    } = useClientProgramAssignments({
        clients,
        onSuccess: setSuccess,
        onError: setFailure
    });

    const loadClients = async () => {
        setIsLoadingClients(true);
        try {
            const response = await trainerService.getClients();
            setClients(normalizeClients(response?.data?.data));
        } catch {
            setClients([]);
        } finally {
            setIsLoadingClients(false);
        }
    };

    const loadRequests = async () => {
        const [incomingRes, outgoingRes] = await Promise.all([
            trainerService.getIncomingRequests(),
            trainerService.getOutgoingRequests()
        ]);
        setIncomingRequests(normalizeTrainerRequests(incomingRes?.data?.data));
        setOutgoingRequests(normalizeTrainerRequests(outgoingRes?.data?.data));
    };

    const searchAthletes = async (searchValue) => {
        const response = await trainerService.searchAthletes(searchValue);
        const results = normalizeAthletes(response?.data?.data);
        setAthletes(results.filter((athlete) => !athlete.isAssignedToYou));
    };

    useEffect(() => {
        if (role !== "trainer") {
            return;
        }

        Promise.all([loadClients(), loadRequests(), loadPrograms()]).catch(() => {
            setClients([]);
            setIncomingRequests([]);
            setOutgoingRequests([]);
        });
    }, [role]);

    useEffect(() => {
        if (role !== "trainer") {
            return;
        }

        if (!query.trim()) {
            setAthletes([]);
            setIsSearching(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            clearFeedback();
            setIsSearching(true);

            try {
                await searchAthletes(query);
            } catch (searchError) {
                setFailure(getErrorMessage(searchError, "Failed to search athletes"));
                setAthletes([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, role]);

    const pendingOutgoingByAthleteId = useMemo(() => {
        const map = new Map();
        outgoingRequests.forEach((request) => {
            map.set(Number(request.athlete?.athleteId), true);
        });
        return map;
    }, [outgoingRequests]);

    const handleSendRequest = async (clientId) => {
        clearFeedback();
        startAction(`send-${clientId}`);

        try {
            const response = await trainerService.addClientById(clientId);
            setSuccess(response?.data?.message || "Request sent to athlete");
            await Promise.all([loadRequests(), searchAthletes(query)]);
        } catch (actionError) {
            setFailure(getErrorMessage(actionError, "Failed to send request"));
        } finally {
            finishAction();
        }
    };

    const handleApprove = async (athleteId, trainerId) => {
        clearFeedback();
        startAction(`approve-${athleteId}-${trainerId}`);

        try {
            const response = await trainerService.approveRequest(athleteId, trainerId);
            setSuccess(response?.data?.message || "Request approved");
            await Promise.all([loadClients(), loadRequests(), searchAthletes(query)]);
        } catch (actionError) {
            setFailure(getErrorMessage(actionError, "Failed to approve request"));
        } finally {
            finishAction();
        }
    };

    const handleReject = async (athleteId, trainerId) => {
        clearFeedback();
        startAction(`reject-${athleteId}-${trainerId}`);

        try {
            const response = await trainerService.rejectRequest(athleteId, trainerId);
            setSuccess(response?.data?.message || "Request rejected");
            await loadRequests();
            setAthletes((previous) => previous.filter((athlete) => Number(athlete.clientId) !== Number(athleteId)));
        } catch (actionError) {
            setFailure(getErrorMessage(actionError, "Failed to reject request"));
        } finally {
            finishAction();
        }
    };

    const handleRemoveClient = async (clientId) => {
        clearFeedback();
        startAction(`remove-${clientId}`);

        try {
            const response = await trainerService.removeClientById(clientId);
            setSuccess(response?.data?.message || "Client removed");
            await loadClients();
            setAthletes((previous) => previous.filter((athlete) => Number(athlete.clientId) !== Number(clientId)));
        } catch (actionError) {
            setFailure(getErrorMessage(actionError, "Failed to remove client"));
        } finally {
            finishAction();
        }
    };

    return {
        query,
        setQuery,
        athletes,
        clients,
        incomingRequests,
        programs,
        selectedProgramByClient,
        message,
        error,
        isSearching,
        isLoadingClients,
        activeActionKey,
        activeProgramClientId,
        pendingOutgoingByAthleteId,
        handleSendRequest,
        handleApprove,
        handleReject,
        handleRemoveClient,
        handleProgramChange,
        handleAssignProgram
    };
};

export default useClientsDirectory;
