import { useNavigate } from "react-router";
import authService from "../../../services/authService";
import useBodyClass from "../../../hooks/useBodyClass";
import { normalizeTrainerClientInfo } from "../utils/normalizeTrainerClient";
import useClientsDirectory from "../hooks/useClientsDirectory";
import RoleGate from "../components/RoleGate";
import AthleteSearchSection from "./components/AthleteSearchSection";
import IncomingClientRequestsSection from "./components/IncomingClientRequestsSection";
import ManagedClientsSection from "./components/ManagedClientsSection";
import "./ClientsPage.scss";
import { useTranslation } from "react-i18next";

const ClientsPage = () => {
    useBodyClass("clients-page-body");
    const { t } = useTranslation();

    const navigate = useNavigate();
    const role = authService.getUser()?.role;
    const {
        query,
        setQuery,
        athletes,
        clients,
        incomingRequests,
        programs,
        selectedProgramByClient,
        message,
        error,
        isSearching,
        isLoadingClients,
        activeActionKey,
        activeProgramClientId,
        pendingOutgoingByAthleteId,
        handleSendRequest,
        handleApprove,
        handleReject,
        handleRemoveClient,
        handleProgramChange,
        handleAssignProgram
    } = useClientsDirectory({ role });

    const openClientTracking = (client) => {
        const normalizedClient = normalizeTrainerClientInfo(client);

        navigate(`/clients/${client.clientId}/tracking`, {
            state: {
                clientName: normalizedClient.clientName,
                clientEmail: normalizedClient.clientEmail
            }
        });
    };

    return (
        <RoleGate
            role={role}
            allow="trainer"
            title={t("trainer_clients.roleGate.clientsTitle")}
            message={t("trainer_clients.roleGate.clientsMessage")}
            containerClassName="clients-page-cont"
            contentClassName="clients-page-content"
        >
            <div className="clients-page-cont">
                <div className="clients-page-content">
                    <div className="clients-list-cont">
                        <AthleteSearchSection
                            query={query}
                            onQueryChange={setQuery}
                            athletes={athletes}
                            message={message}
                            error={error}
                            isSearching={isSearching}
                            activeActionKey={activeActionKey}
                            pendingOutgoingByAthleteId={pendingOutgoingByAthleteId}
                            onSendRequest={handleSendRequest}
                        />

                        <IncomingClientRequestsSection
                            incomingRequests={incomingRequests}
                            activeActionKey={activeActionKey}
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />
                    </div>

                    <ManagedClientsSection
                        clients={clients}
                        programs={programs}
                        selectedProgramByClient={selectedProgramByClient}
                        isLoadingClients={isLoadingClients}
                        activeActionKey={activeActionKey}
                        activeProgramClientId={activeProgramClientId}
                        onProgramChange={handleProgramChange}
                        onAssignProgram={handleAssignProgram}
                        onOpenClientTracking={openClientTracking}
                        onRemoveClient={handleRemoveClient}
                    />
                </div>
            </div>
        </RoleGate>
    );
};

export default ClientsPage;
