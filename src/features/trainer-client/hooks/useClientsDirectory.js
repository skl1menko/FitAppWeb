import { useCallback, useEffect, useMemo, useState } from "react";
import trainerService from "../../../services/trainerService";
import {
    normalizeAthletes,
    normalizeClients,
    normalizeTrainerRequests
} from "../utils/normalizeTrainerClient";
import useActionKey from "./useActionKey";
import useAsyncFeedback, { getErrorMessage } from "./useAsyncFeedback";
import useClientProgramAssignments from "./useClientProgramAssignments";
import { useTranslation } from "react-i18next";

const useClientsDirectory = ({ role } = {}) => {
    const { t } = useTranslation();
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

    const loadClients = useCallback(async () => {
        setIsLoadingClients(true);
        try {
            const response = await trainerService.getClients();
            setClients(normalizeClients(response?.data?.data));
        } catch {
            setClients([]);
        } finally {
            setIsLoadingClients(false);
        }
    }, []);

    const loadRequests = useCallback(async () => {
        const [incomingRes, outgoingRes] = await Promise.all([
            trainerService.getIncomingRequests(),
            trainerService.getOutgoingRequests()
        ]);
        setIncomingRequests(normalizeTrainerRequests(incomingRes?.data?.data));
        setOutgoingRequests(normalizeTrainerRequests(outgoingRes?.data?.data));
    }, []);

    const searchAthletes = useCallback(async (searchValue) => {
        const response = await trainerService.searchAthletes(searchValue);
        const results = normalizeAthletes(response?.data?.data);
        setAthletes(results.filter((athlete) => !athlete.isAssignedToYou));
    }, []);

    useEffect(() => {
        if (role !== "trainer") {
            return;
        }

        Promise.all([loadClients(), loadRequests(), loadPrograms()]).catch(() => {
            setClients([]);
            setIncomingRequests([]);
            setOutgoingRequests([]);
        });
    }, [loadClients, loadPrograms, loadRequests, role]);

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
                setFailure(getErrorMessage(searchError, t("trainer_clients.errors.searchAthletesFailed")));
                setAthletes([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [clearFeedback, query, role, searchAthletes, setFailure, t]);

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
            setSuccess(response?.data?.message || t("trainer_clients.errors.requestSentToAthlete"));
            await Promise.all([loadRequests(), searchAthletes(query)]);
        } catch (actionError) {
            setFailure(getErrorMessage(actionError, t("trainer_clients.errors.sendRequestFailed")));
        } finally {
            finishAction();
        }
    };

    const handleApprove = async (athleteId, trainerId) => {
        clearFeedback();
        startAction(`approve-${athleteId}-${trainerId}`);

        try {
            const response = await trainerService.approveRequest(athleteId, trainerId);
            setSuccess(response?.data?.message || t("trainer_clients.errors.requestApproved"));
            await Promise.all([loadClients(), loadRequests(), searchAthletes(query)]);
        } catch (actionError) {
            setFailure(getErrorMessage(actionError, t("trainer_clients.errors.approveRequestFailed")));
        } finally {
            finishAction();
        }
    };

    const handleReject = async (athleteId, trainerId) => {
        clearFeedback();
        startAction(`reject-${athleteId}-${trainerId}`);

        try {
            const response = await trainerService.rejectRequest(athleteId, trainerId);
            setSuccess(response?.data?.message || t("trainer_clients.errors.requestRejected"));
            await loadRequests();
            setAthletes((previous) => previous.filter((athlete) => Number(athlete.clientId) !== Number(athleteId)));
        } catch (actionError) {
            setFailure(getErrorMessage(actionError, t("trainer_clients.errors.rejectRequestFailed")));
        } finally {
            finishAction();
        }
    };

    const handleRemoveClient = async (clientId) => {
        clearFeedback();
        startAction(`remove-${clientId}`);

        try {
            const response = await trainerService.removeClientById(clientId);
            setSuccess(response?.data?.message || t("trainer_clients.errors.clientRemoved"));
            await loadClients();
            setAthletes((previous) => previous.filter((athlete) => Number(athlete.clientId) !== Number(clientId)));
        } catch (actionError) {
            setFailure(getErrorMessage(actionError, t("trainer_clients.errors.removeClientFailed")));
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
