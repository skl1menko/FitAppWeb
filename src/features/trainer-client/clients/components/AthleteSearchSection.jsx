import SearchPanel from "../../components/SearchPanel";
import SearchResultCard from "../../components/SearchResultCard";
import { useTranslation } from "react-i18next";

const AthleteSearchSection = ({
    query,
    onQueryChange,
    athletes = [],
    message = "",
    error = "",
    isSearching = false,
    activeActionKey = "",
    pendingOutgoingByAthleteId,
    onSendRequest
}) => {
    const { t } = useTranslation();
    return (
        <SearchPanel
            title={t("trainer_clients.clientsPage.addNewClient")}
            variant="clients"
            query={query}
            onQueryChange={onQueryChange}
            placeholder={t("trainer_clients.clientsPage.athleteSearchPlaceholder")}
            isSearching={isSearching}
            showResults={Boolean(query.trim())}
            message={message}
            error={error}
        >
            {athletes.map((athlete) => {
                const unavailable = athlete.assignedTrainer && !athlete.isAssignedToYou;
                const isMine = athlete.isAssignedToYou;
                const isPending = pendingOutgoingByAthleteId.get(Number(athlete.clientId));
                const isLoading = activeActionKey === `send-${athlete.clientId}`;

                return (
                    <SearchResultCard
                        variant="clients"
                        key={athlete.clientId}
                        name={athlete.clientName}
                        email={athlete.clientEmail}
                        meta={athlete.assignedTrainer
                            ? t("trainer_clients.clientsPage.assignedTo", { name: athlete.assignedTrainer.trainerName || t("trainer_clients.clientsPage.anotherTrainer") })
                            : ""}
                        buttonLabel={isMine
                            ? t("trainer_clients.clientsPage.alreadyYourClient")
                            : unavailable
                                ? t("trainer_clients.clientsPage.unavailable")
                                : isPending
                                    ? t("trainer_clients.clientsPage.requestSent")
                                    : isLoading
                                        ? t("trainer_clients.clientsPage.sending")
                                        : t("trainer_clients.clientsPage.sendRequest")}
                        onAction={() => onSendRequest(athlete.clientId)}
                        disabled={unavailable || isMine || isPending || isLoading}
                    />
                );
            })}
        </SearchPanel>
    );
};

export default AthleteSearchSection;
