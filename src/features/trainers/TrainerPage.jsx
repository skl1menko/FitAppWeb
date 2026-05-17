import {useEffect, useMemo, useState} from "react";
import {GoCheckCircleFill, IoMdPerson} from "../../assets/icons";
import authService from "../../services/authService";
import trainerService from "../../services/trainerService";
import useBodyClass from "../../hooks/useBodyClass";
import "./TrainerPage.scss";

const TrainerPage = () => {
    useBodyClass("trainer-page-body");

    const role = authService.getUser()?.role;
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [myTrainer, setMyTrainer] = useState(null);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [activeActionKey, setActiveActionKey] = useState("");

    const loadPageData = async () => {
        const [trainerRes, incomingRes, outgoingRes] = await Promise.all([
            trainerService.getMyTrainer(),
            trainerService.getIncomingRequests(),
            trainerService.getOutgoingRequests()
        ]);

        setMyTrainer(trainerRes?.data?.data || null);
        setIncomingRequests(incomingRes?.data?.data || []);
        setOutgoingRequests(outgoingRes?.data?.data || []);
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

        const timeoutId = setTimeout(async () => {
            setError("");
            setIsSearching(true);

            try {
                const response = await trainerService.searchTrainers(query);
                setResults(response?.data?.data || []);
            } catch (searchError) {
                setError(searchError?.response?.data?.message || "Failed to search trainers");
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
        setError("");
        setMessage("");
        setActiveActionKey(`send-${trainerId}`);

        try {
            const response = await trainerService.selectTrainer(trainerId);
            setMessage(response?.data?.message || "Request sent to trainer");
            await loadPageData();
        } catch (actionError) {
            setError(actionError?.response?.data?.message || "Failed to send request");
        } finally {
            setActiveActionKey("");
        }
    };

    const handleUnlinkTrainer = async () => {
        if (!myTrainer?.trainerId) {
            return;
        }

        setError("");
        setMessage("");
        setActiveActionKey("unlink-trainer");

        try {
            const response = await trainerService.unlinkMyTrainer();
            setMessage(response?.data?.message || "Trainer unlinked");
            await loadPageData();
        } catch (actionError) {
            setError(actionError?.response?.data?.message || "Failed to unlink trainer");
        } finally {
            setActiveActionKey("");
        }
    };

    const handleApprove = async (athleteId, trainerId) => {
        setError("");
        setMessage("");
        setActiveActionKey(`approve-${athleteId}-${trainerId}`);

        try {
            const response = await trainerService.approveRequest(athleteId, trainerId);
            setMessage(response?.data?.message || "Request approved");
            await loadPageData();
        } catch (actionError) {
            setError(actionError?.response?.data?.message || "Failed to approve request");
        } finally {
            setActiveActionKey("");
        }
    };

    const handleReject = async (athleteId, trainerId) => {
        setError("");
        setMessage("");
        setActiveActionKey(`reject-${athleteId}-${trainerId}`);

        try {
            const response = await trainerService.rejectRequest(athleteId, trainerId);
            setMessage(response?.data?.message || "Request rejected");
            await loadPageData();
        } catch (actionError) {
            setError(actionError?.response?.data?.message || "Failed to reject request");
        } finally {
            setActiveActionKey("");
        }
    };

    if (role !== "athlete") {
        return (
            <div className="trainer-page-cont">
                <div className="trainer-page-content">
                    <h1>Trainer</h1>
                    <p>This page is available only for athletes.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="trainer-page-cont">
            <div className="trainer-page-content">
                <div className="trainer-hero-grid">
                    <div className="trainer-hero-title">
                        <div className="trainer-hero-icon">
                            <IoMdPerson />
                        </div>
                        <div>
                            <h1>Trainer</h1>
                            <p>Send request to trainer and wait for confirmation.</p>
                        </div>
                    </div>
                    <div className="trainer-status-card">
                        <span>Current trainer</span>
                        <strong>{myTrainer?.trainerName || "Not selected yet"}</strong>
                        {myTrainer?.trainerEmail && <p>{myTrainer.trainerEmail}</p>}
                        <button
                            type="button"
                            className="trainer-secondary-btn"
                            onClick={handleUnlinkTrainer}
                            disabled={!myTrainer?.trainerId || activeActionKey === "unlink-trainer"}
                        >
                            {activeActionKey === "unlink-trainer" ? "Unlinking..." : "Unlink trainer"}
                        </button>
                    </div>
                </div>

                <div className="trainer-panel-cont">
                    <h2>Find trainers</h2>
                    <div className="trainer-search-row">
                        <input
                            type="text"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Trainer name or email"
                        />
                    </div>
                    {isSearching && <p className="trainer-hint-text">Searching...</p>}

                    {message && (
                        <p className="trainer-message-text">
                            <GoCheckCircleFill />
                            {message}
                        </p>
                    )}
                    {error && <p className="trainer-error-text">{error}</p>}

                    <div className="trainer-results-list">
                        {results.map((trainer) => {
                            const trainerId = Number(trainer.trainerId);
                            const isCurrent = Number(myTrainer?.trainerId) === trainerId;
                            const isPending = pendingOutgoingByTrainerId.get(trainerId);
                            const isLoading = activeActionKey === `send-${trainerId}`;

                            return (
                                <div key={trainer.trainerId} className="trainer-result-card">
                                    <div className="trainer-card-head">
                                        <div className="trainer-card-avatar">
                                            <IoMdPerson />
                                        </div>
                                        <div className="trainer-result-info">
                                            <strong>{trainer.trainerName}</strong>
                                            <p>{trainer.trainerEmail}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="trainer-action-btn"
                                        onClick={() => handleSendRequest(trainer.trainerId)}
                                        disabled={isCurrent || isPending || isLoading}
                                    >
                                        {isCurrent ? "Current trainer" : isPending ? "Request sent" : isLoading ? "Sending..." : "Send request"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="trainer-panel-cont">
                    <h2>Incoming requests</h2>
                    <div className="trainer-results-list">
                        {incomingRequests.length === 0 && <p className="trainer-hint-text">No incoming requests.</p>}
                        {incomingRequests.map((request) => {
                            const athleteId = request.athlete?.athleteId;
                            const trainerId = request.trainer?.trainerId;
                            const approveKey = `approve-${athleteId}-${trainerId}`;
                            const rejectKey = `reject-${athleteId}-${trainerId}`;
                            const isApproving = activeActionKey === approveKey;
                            const isRejecting = activeActionKey === rejectKey;

                            return (
                                <div key={`${athleteId}-${trainerId}`} className="trainer-result-card trainer-result-card-stacked">
                                    <div className="trainer-card-head">
                                        <div className="trainer-card-avatar">
                                            <IoMdPerson />
                                        </div>
                                        <div className="trainer-result-info">
                                            <strong>{request.trainer?.trainerName}</strong>
                                            <p>{request.trainer?.trainerEmail}</p>
                                            <p className="trainer-meta-text">Wants to work with you</p>
                                        </div>
                                    </div>
                                    <div className="trainer-request-actions">
                                        <button
                                            type="button"
                                            className="trainer-action-btn"
                                            onClick={() => handleApprove(athleteId, trainerId)}
                                            disabled={isApproving || isRejecting}
                                        >
                                            {isApproving ? "Approving..." : "Approve"}
                                        </button>
                                        <button
                                            type="button"
                                            className="trainer-secondary-btn"
                                            onClick={() => handleReject(athleteId, trainerId)}
                                            disabled={isApproving || isRejecting}
                                        >
                                            {isRejecting ? "Rejecting..." : "Reject"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerPage;
