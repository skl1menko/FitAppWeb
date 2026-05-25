import authService from "../../../services/authService";
import useBodyClass from "../../../hooks/useBodyClass";
import IncomingRequestCard from "../components/IncomingRequestCard";
import SearchPanel from "../components/SearchPanel";
import SearchResultCard from "../components/SearchResultCard";
import RoleGate from "../components/RoleGate";
import useTrainerDirectory from "../hooks/useTrainerDirectory";
import "./TrainerPage.scss";
import { useTranslation } from "react-i18next";

const TrainerPage = () => {
    useBodyClass("trainer-page-body");
    const { t } = useTranslation();

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
            title={t("trainer_clients.roleGate.trainerTitle")}
            message={t("trainer_clients.roleGate.trainerMessage")}
            containerClassName="trainer-page-cont"
            contentClassName="trainer-page-content"
        >
            <div className="trainer-page-cont">
                <div className="trainer-page-content">
                    <div className="trainer-hero-grid">
                        <div className="trainer-status-card">
                            <span>{t("trainer_clients.trainerPage.currentTrainer")}</span>
                            <strong>{myTrainer?.trainerName || t("trainer_clients.trainerPage.notSelectedYet")}</strong>
                            {myTrainer?.trainerEmail && <p>{myTrainer.trainerEmail}</p>}
                            <button
                                type="button"
                                className="trainer-secondary-btn"
                                onClick={handleUnlinkTrainer}
                                disabled={!myTrainer?.trainerId || activeActionKey === "unlink-trainer"}
                            >
                                {activeActionKey === "unlink-trainer" ? t("trainer_clients.trainerPage.unlinking") : t("trainer_clients.trainerPage.unlinkTrainer")}
                            </button>
                        </div>

                        <div className="trainer-status-card trainer-status-card-requests">
                            <span>{t("trainer_clients.trainerPage.incomingRequests")}</span>
                            <div className="trainer-results-list">
                                {incomingRequests.length === 0 && <p className="trainer-hint-text">{t("trainer_clients.trainerPage.noIncomingRequests")}</p>}
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
                        title={t("trainer_clients.trainerPage.findTrainers")}
                        query={query}
                        onQueryChange={setQuery}
                        placeholder={t("trainer_clients.trainerPage.trainerSearchPlaceholder")}
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
                                    buttonLabel={isCurrent ? t("trainer_clients.trainerPage.currentTrainerBadge") : isPending ? t("trainer_clients.trainerPage.requestSent") : isLoading ? t("trainer_clients.trainerPage.sending") : t("trainer_clients.trainerPage.sendRequest")}
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
