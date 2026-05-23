import authService from "../../../services/authService";
import useBodyClass from "../../../hooks/useBodyClass";
import IncomingRequestCard from "../components/IncomingRequestCard";
import SearchPanel from "../components/SearchPanel";
import SearchResultCard from "../components/SearchResultCard";
import RoleGate from "../components/RoleGate";
import useTrainerDirectory from "../hooks/useTrainerDirectory";
import "./TrainerPage.scss";

const TrainerPage = () => {
    useBodyClass("trainer-page-body");

    const role = authService.getUser()?.role;
    const {
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
    } = useTrainerDirectory({ role });

    return (
        <RoleGate
            role={role}
            allow="athlete"
            title="Trainer"
            message="This page is available only for athletes."
            containerClassName="trainer-page-cont"
            contentClassName="trainer-page-content"
        >
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
                        showResults={Boolean(query.trim())}
                        message={message}
                        error={error}
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
        </RoleGate>
    );
};

export default TrainerPage;
