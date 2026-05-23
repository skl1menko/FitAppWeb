import IncomingRequestCard from "../../components/IncomingRequestCard";

const IncomingClientRequestsSection = ({
    incomingRequests = [],
    activeActionKey = "",
    onApprove,
    onReject
}) => {
    return (
        <div className="clients-panel-cont">
            <h2>Incoming requests</h2>
            <div className="clients-results-list">
                {incomingRequests.length === 0 && <p className="clients-hint-text">No incoming requests.</p>}
                {incomingRequests.map((request) => (
                    <IncomingRequestCard
                        variant="clients"
                        key={`${request.athlete?.athleteId}-${request.trainer?.trainerId}`}
                        athleteId={request.athlete?.athleteId}
                        trainerId={request.trainer?.trainerId}
                        name={request.athlete?.athleteName}
                        email={request.athlete?.athleteEmail}
                        activeActionKey={activeActionKey}
                        onApprove={onApprove}
                        onReject={onReject}
                    />
                ))}
            </div>
        </div>
    );
};

export default IncomingClientRequestsSection;
