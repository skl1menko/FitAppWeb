import { useEffect, useMemo, useState } from "react";
import trainerService from "../../../services/trainerService";
import {
    normalizeTrainer,
    normalizeTrainerRequests,
    normalizeTrainers
} from "../utils/normalizeTrainerClient";
import useActionKey from "./useActionKey";
import useAsyncFeedback, { getErrorMessage } from "./useAsyncFeedback";

const useTrainerDirectory = ({ role } = {}) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [myTrainer, setMyTrainer] = useState(null);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
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

    const loadPageData = async () => {
        const [trainerRes, incomingRes, outgoingRes] = await Promise.all([
            trainerService.getMyTrainer(),
            trainerService.getIncomingRequests(),
            trainerService.getOutgoingRequests()
        ]);

        setMyTrainer(trainerRes?.data?.data ? normalizeTrainer(trainerRes.data.data) : null);
        setIncomingRequests(normalizeTrainerRequests(incomingRes?.data?.data));
        setOutgoingRequests(normalizeTrainerRequests(outgoingRes?.data?.data));
    };

    useEffect(() => {
        if (role !== "athlete") {
            return;
        }

        loadPageData().catch(() => {
            setMyTrainer(null);
            setIncomingRequests([]);
            setOutgoingRequests([]);
        });
    }, [role]);

    useEffect(() => {
        if (role !== "athlete") {
            return;
        }

        if (!query.trim()) {
            setResults([]);
            setIsSearching(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            clearFeedback();
            setIsSearching(true);

            try {
                const response = await trainerService.searchTrainers(query);
                setResults(normalizeTrainers(response?.data?.data));
            } catch (searchError) {
                setFailure(getErrorMessage(searchError, "Failed to search trainers"));
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, role]);

    const pendingOutgoingByTrainerId = useMemo(() => {
        const map = new Map();
        outgoingRequests.forEach((request) => {
            map.set(Number(request.trainer?.trainerId), true);
        });
        return map;
    }, [outgoingRequests]);

    const handleSendRequest = async (trainerId) => {
        clearFeedback();
        startAction(`send-${trainerId}`);

        try {
            const response = await trainerService.selectTrainer(trainerId);
            setSuccess(response?.data?.message || "Request sent to trainer");
            await loadPageData();
        } catch (actionError) {
            setFailure(getErrorMessage(actionError, "Failed to send request"));
        } finally {
            finishAction();
        }
    };

    const handleUnlinkTrainer = async () => {
        if (!myTrainer?.trainerId) {
            return;
        }

        clearFeedback();
        startAction("unlink-trainer");

        try {
            const response = await trainerService.unlinkMyTrainer();
            setSuccess(response?.data?.message || "Trainer unlinked");
            await loadPageData();
        } catch (actionError) {
            setFailure(getErrorMessage(actionError, "Failed to unlink trainer"));
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
            await loadPageData();
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
            await loadPageData();
        } catch (actionError) {
            setFailure(getErrorMessage(actionError, "Failed to reject request"));
        } finally {
            finishAction();
        }
    };

    return {
        query,
        setQuery,
        results,
        myTrainer,
        incomingRequests,
        message,
        error,
        isSearching,
        activeActionKey,
        pendingOutgoingByTrainerId,
        handleSendRequest,
        handleUnlinkTrainer,
        handleApprove,
        handleReject
    };
};

export default useTrainerDirectory;
