import {useEffect, useMemo, useState} from "react";
import authService from "../../../services/authService";
import trainerService from "../../../services/trainerService";
import useBodyClass from "../../../hooks/useBodyClass";
import IncomingRequestCard from "../components/IncomingRequestCard";
import SearchPanel from "../components/SearchPanel";
import SearchResultCard from "../components/SearchResultCard";
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

        if (!query.trim()) {
            setResults([]);
            setIsSearching(false);
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

                    <div className="trainer-status-card trainer-status-card-requests">
                        <span>Incoming requests</span>
                        <div className="trainer-results-list">
                            {incomingRequests.length === 0 && <p className="trainer-hint-text">No incoming requests.</p>}
                            {incomingRequests.map((request) => (
                                <IncomingRequestCard
                                    key={`${request.athlete?.athleteId}-${request.trainer?.trainerId}`}
                                    athleteId={request.athlete?.athleteId}
                                    trainerId={request.trainer?.trainerId}
                                    name={request.trainer?.trainerName}
                                    email={request.trainer?.trainerEmail}
                                    activeActionKey={activeActionKey}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <SearchPanel
                    title="Find trainers"
                    query={query}
                    onQueryChange={setQuery}
                    placeholder="Trainer name or email"
                    isSearching={isSearching}
                    showSearching={Boolean(query.trim())}
                    message={message}
                    error={error}
                    showResults={Boolean(query.trim())}
                >
                    {results.map((trainer) => {
                        const trainerId = Number(trainer.trainerId);
                        const isCurrent = Number(myTrainer?.trainerId) === trainerId;
                        const isPending = pendingOutgoingByTrainerId.get(trainerId);
                        const isLoading = activeActionKey === `send-${trainerId}`;

                        return (
                            <SearchResultCard
                                key={trainer.trainerId}
                                name={trainer.trainerName}
                                email={trainer.trainerEmail}
                                buttonLabel={isCurrent ? "Current trainer" : isPending ? "Request sent" : isLoading ? "Sending..." : "Send request"}
                                onAction={() => handleSendRequest(trainer.trainerId)}
                                disabled={isCurrent || isPending || isLoading}
                            />
                        );
                    })}
                </SearchPanel>
            </div>
        </div>
    );
};

export default TrainerPage;
