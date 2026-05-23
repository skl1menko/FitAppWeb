import SearchPanel from "../../components/SearchPanel";
import SearchResultCard from "../../components/SearchResultCard";

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
    return (
        <SearchPanel
            title="Add new client"
            variant="clients"
            query={query}
            onQueryChange={onQueryChange}
            placeholder="Athlete name or email"
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
                            ? `Assigned to: ${athlete.assignedTrainer.trainerName || "another trainer"}`
                            : ""}
                        buttonLabel={isMine
                            ? "Already your client"
                            : unavailable
                                ? "Unavailable"
                                : isPending
                                    ? "Request sent"
                                    : isLoading
                                        ? "Sending..."
                                        : "Send request"}
                        onAction={() => onSendRequest(athlete.clientId)}
                        disabled={unavailable || isMine || isPending || isLoading}
                    />
                );
            })}
        </SearchPanel>
    );
};

export default AthleteSearchSection;
