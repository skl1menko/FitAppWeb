import IncomingRequestCard from "../../components/IncomingRequestCard";
import { useTranslation } from "react-i18next";

const IncomingClientRequestsSection = ({
    incomingRequests = [],
    activeActionKey = "",
    onApprove,
    onReject
}) => {
    const { t } = useTranslation();
    return (
        <div className="clients-panel-cont">
            <h2>{t("trainer_clients.clientsPage.incomingRequests")}</h2>
            <div className="clients-results-list">
                {incomingRequests.length === 0 && <p className="clients-hint-text">{t("trainer_clients.clientsPage.noIncomingRequests")}</p>}
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
