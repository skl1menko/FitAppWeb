import { useCallback, useEffect, useMemo, useState } from "react";
import trainerService from "../../../services/trainerService";
import {
    normalizeTrainer,
    normalizeTrainerRequests,
    normalizeTrainers
} from "../utils/normalizeTrainerClient";
import useActionKey from "./useActionKey";
import useAsyncFeedback, { getErrorMessage } from "./useAsyncFeedback";
import { useTranslation } from "react-i18next";

const useTrainerDirectory = ({ role } = {}) => {
    const { t } = useTranslation();
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

    const loadPageData = useCallback(async () => {
        const [trainerRes, incomingRes, outgoingRes] = await Promise.all([
            trainerService.getMyTrainer(),
            trainerService.getIncomingRequests(),
            trainerService.getOutgoingRequests()
        ]);

        setMyTrainer(trainerRes?.data?.data ? normalizeTrainer(trainerRes.data.data) : null);
        setIncomingRequests(normalizeTrainerRequests(incomingRes?.data?.data));
        setOutgoingRequests(normalizeTrainerRequests(outgoingRes?.data?.data));
    }, []);

    useEffect(() => {
        if (role !== "athlete") {
            return;
        }

        loadPageData().catch(() => {
            setMyTrainer(null);
            setIncomingRequests([]);
            setOutgoingRequests([]);
        });
    }, [loadPageData, role]);

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
                setFailure(getErrorMessage(searchError, t("trainer_clients.errors.searchTrainersFailed")));
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [clearFeedback, query, role, setFailure, t]);

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
            setSuccess(response?.data?.message || t("trainer_clients.errors.requestSentToTrainer"));
            await loadPageData();
        } catch (actionError) {
            setFailure(getErrorMessage(actionError, t("trainer_clients.errors.sendRequestFailed")));
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
            setSuccess(response?.data?.message || t("trainer_clients.errors.trainerUnlinked"));
            await loadPageData();
        } catch (actionError) {
            setFailure(getErrorMessage(actionError, t("trainer_clients.errors.unlinkTrainerFailed")));
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
            await loadPageData();
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
            await loadPageData();
        } catch (actionError) {
            setFailure(getErrorMessage(actionError, t("trainer_clients.errors.rejectRequestFailed")));
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
