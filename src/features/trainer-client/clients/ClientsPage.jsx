import { useEffect, useMemo, useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router";
import { IoMdPerson } from "../../../assets/icons";
import authService from "../../../services/authService";
import trainerService from "../../../services/trainerService";
import trainingProgramService from "../../../services/trainingProgramService";
import useBodyClass from "../../../hooks/useBodyClass";
import IncomingRequestCard from "../components/IncomingRequestCard";
import SearchPanel from "../components/SearchPanel";
import SearchResultCard from "../components/SearchResultCard";
import "./ClientsPage.scss";

const ClientsPage = () => {
    useBodyClass("clients-page-body");

    const navigate = useNavigate();
    const role = authService.getUser()?.role;
    const [query, setQuery] = useState("");
    const [athletes, setAthletes] = useState([]);
    const [clients, setClients] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [selectedProgramByClient, setSelectedProgramByClient] = useState({});
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingClients, setIsLoadingClients] = useState(false);
    const [activeActionKey, setActiveActionKey] = useState("");

    const loadClients = async () => {
        setIsLoadingClients(true);
        try {
            const response = await trainerService.getClients();
            setClients(response?.data?.data || []);
        } catch {
            setClients([]);
        } finally {
            setIsLoadingClients(false);
        }
    };

    const loadRequests = async () => {
        const [incomingRes, outgoingRes] = await Promise.all([
            trainerService.getIncomingRequests(),
            trainerService.getOutgoingRequests()
        ]);
        setIncomingRequests(incomingRes?.data?.data || []);
        setOutgoingRequests(outgoingRes?.data?.data || []);
    };

    const loadPrograms = async () => {
        const response = await trainingProgramService.getMyCreated();
        const list = response?.data?.data || [];
        setPrograms(list);
        setSelectedProgramByClient((previous) => {
            const next = { ...previous };
            clients.forEach((client) => {
                if (!next[client.clientId]) {
                    next[client.clientId] = "none";
                }
            });
            return next;
        });
    };

    const searchAthletes = async (searchValue) => {
        const response = await trainerService.searchAthletes(searchValue);
        const results = response?.data?.data || [];
        setAthletes(results.filter((athlete) => !athlete.isAssignedToYou));
    };

    useEffect(() => {
        if (role !== "trainer") {
            return;
        }

        Promise.all([loadClients(), loadRequests(), loadPrograms()]).catch(() => {
            setClients([]);
            setIncomingRequests([]);
            setOutgoingRequests([]);
            setPrograms([]);
        });
    }, [role]);

    useEffect(() => {
        if (clients.length === 0) {
            return;
        }
        setSelectedProgramByClient((previous) => {
            const next = { ...previous };
            clients.forEach((client) => {
                if (!next[client.clientId]) {
                    next[client.clientId] = "none";
                }
            });
            return next;
        });
    }, [clients]);

    useEffect(() => {
        if (role !== "trainer") {
            return;
        }

        if (!query.trim()) {
            setAthletes([]);
            setIsSearching(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setError("");
            setIsSearching(true);

            try {
                await searchAthletes(query);
            } catch (searchError) {
                setError(searchError?.response?.data?.message || "Failed to search athletes");
                setAthletes([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, role]);

    const pendingOutgoingByAthleteId = useMemo(() => {
        const map = new Map();
        outgoingRequests.forEach((request) => {
            map.set(Number(request.athlete?.athleteId), true);
        });
        return map;
    }, [outgoingRequests]);

    const handleSendRequest = async (clientId) => {
        setError("");
        setMessage("");
        setActiveActionKey(`send-${clientId}`);

        try {
            const response = await trainerService.addClientById(clientId);
            setMessage(response?.data?.message || "Request sent to athlete");
            await Promise.all([loadRequests(), searchAthletes(query)]);
        } catch (actionError) {
            setError(actionError?.response?.data?.message || "Failed to send request");
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
            await Promise.all([loadClients(), loadRequests(), searchAthletes(query)]);
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
            await loadRequests();
            setAthletes((previous) => previous.filter((athlete) => Number(athlete.clientId) !== Number(athleteId)));
        } catch (actionError) {
            setError(actionError?.response?.data?.message || "Failed to reject request");
        } finally {
            setActiveActionKey("");
        }
    };

    const handleRemoveClient = async (clientId) => {
        setError("");
        setMessage("");
        setActiveActionKey(`remove-${clientId}`);

        try {
            const response = await trainerService.removeClientById(clientId);
            setMessage(response?.data?.message || "Client removed");
            await loadClients();
            setAthletes((previous) => previous.filter((athlete) => Number(athlete.clientId) !== Number(clientId)));
        } catch (actionError) {
            setError(actionError?.response?.data?.message || "Failed to remove client");
        } finally {
            setActiveActionKey("");
        }
    };

    const handleProgramChange = (clientId, programId) => {
        setSelectedProgramByClient((previous) => ({
            ...previous,
            [clientId]: programId
        }));
    };

    const handleAssignProgram = async (clientId) => {
        const selectedProgramId = selectedProgramByClient[clientId] || "none";

        setError("");
        setMessage("");
        setActiveActionKey(`apply-program-${clientId}`);

        try {
            if (selectedProgramId === "none") {
                const response = await trainerService.unassignAllProgramsFromAthlete(clientId);
                setMessage(response?.data?.message || "Program removed");
            } else {
                const response = await trainerService.assignProgramToAthlete(selectedProgramId, clientId);
                setMessage(response?.data?.message || "Program assigned successfully");
            }
        } catch (actionError) {
            setError(actionError?.response?.data?.message || "Failed to apply program selection");
        } finally {
            setActiveActionKey("");
        }
    };

    const openClientTracking = (client) => {
        navigate(`/clients/${client.clientId}/tracking`, {
            state: {
                clientName: client.clientName,
                clientEmail: client.clientEmail
            }
        });
    };

    if (role !== "trainer") {
        return (
            <div className="clients-page-cont">
                <div className="clients-page-content">
                    <h1>Clients</h1>
                    <p>This page is available only for trainers.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="clients-page-cont">
            <div className="clients-page-content">
                <div className="clients-list-cont">
                    <SearchPanel
                        title="Add new client"
                        query={query}
                        onQueryChange={setQuery}
                        placeholder="Athlete name or email"
                        isSearching={isSearching}
                        showSearching={Boolean(query.trim())}
                        message={message}
                        error={error}
                        showResults={Boolean(query.trim())}
                        panelClassName="clients-panel-cont"
                        searchRowClassName="clients-search-row"
                        hintClassName="clients-hint-text"
                        messageClassName="clients-message-text"
                        errorClassName="clients-error-text"
                        resultsClassName="clients-results-list"
                    >
                        {athletes.map((athlete) => {
                            const unavailable = athlete.assignedTrainer && !athlete.isAssignedToYou;
                            const isMine = athlete.isAssignedToYou;
                            const isPending = pendingOutgoingByAthleteId.get(Number(athlete.clientId));
                            const isLoading = activeActionKey === `send-${athlete.clientId}`;

                            return (
                                <SearchResultCard
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
                                    onAction={() => handleSendRequest(athlete.clientId)}
                                    disabled={unavailable || isMine || isPending || isLoading}
                                    cardClassName="clients-result-card"
                                    headClassName="clients-card-head"
                                    avatarClassName="clients-card-avatar"
                                    infoClassName="clients-result-info"
                                    metaClassName="clients-meta-text"
                                    actionButtonClassName="clients-action-btn"
                                />
                            );
                        })}
                    </SearchPanel>

                    <div className="clients-panel-cont">
                        <h2>Incoming requests</h2>
                        <div className="clients-results-list">
                            {incomingRequests.length === 0 && <p className="clients-hint-text">No incoming requests.</p>}
                            {incomingRequests.map((request) => (
                                <IncomingRequestCard
                                    key={`${request.athlete?.athleteId}-${request.trainer?.trainerId}`}
                                    athleteId={request.athlete?.athleteId}
                                    trainerId={request.trainer?.trainerId}
                                    name={request.athlete?.athleteName}
                                    email={request.athlete?.athleteEmail}
                                    activeActionKey={activeActionKey}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                    cardClassName="clients-result-card clients-result-card-stacked"
                                    headClassName="clients-card-head"
                                    avatarClassName="clients-card-avatar"
                                    infoClassName="clients-result-info"
                                    actionsClassName="clients-request-actions"
                                    approveButtonClassName="apply-btn"
                                    rejectButtonClassName="cancel-btn"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="clients-panel-cont clients">
                    <h2>Your clients</h2>
                    {isLoadingClients && clients.length === 0 && <p className="clients-hint-text">Loading clients...</p>}
                    <div className="clients-results-list">
                        {!isLoadingClients && clients.length === 0 && (
                            <p className="clients-hint-text">You do not have clients yet.</p>
                        )}
                        {clients.map((client) => (
                            <div key={client.clientId} className="clients-result-card clients">
                                <div className="clients-card-head">
                                    <div className="clients-card-avatar">
                                        <IoMdPerson />
                                    </div>
                                    <div className="clients-result-info">
                                        <strong>{client.clientName}</strong>
                                        <p>{client.clientEmail}</p>
                                    </div>
                                </div>
                                <div className="clients-program-actions">
                                    <span className="clients-program-label">Training program</span>
                                    <div className="clients-program-dropdown">
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={selectedProgramByClient[client.clientId] || "none"}
                                                onChange={(event) => handleProgramChange(client.clientId, event.target.value)}
                                                displayEmpty
                                                sx={{
                                                    width: "100%",
                                                    borderRadius: "12px",
                                                    "& .MuiSelect-select": {
                                                        padding: "10px 12px",
                                                        fontSize: "14px",
                                                        fontWeight: 500,
                                                        color: "#111827"
                                                    }
                                                }}
                                                MenuProps={{
                                                    slotProps: {
                                                        paper: {
                                                            className: "clients-program-menu-paper"
                                                        },
                                                        list: {
                                                            className: "clients-program-menu-list"
                                                        }
                                                    }
                                                }}
                                            >
                                                <MenuItem className="clients-program-menu-item" value="none">
                                                    No program
                                                </MenuItem>
                                                {programs.map((program) => (
                                                    <MenuItem
                                                        className="clients-program-menu-item"
                                                        key={program.programId}
                                                        value={String(program.programId)}
                                                    >
                                                        {program.programName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <button
                                            type="button"
                                            className="clients-action-btn"
                                            onClick={() => handleAssignProgram(client.clientId)}
                                            disabled={activeActionKey === `apply-program-${client.clientId}`}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                                <div className="action-cont">
                                    <button
                                        type="button"
                                        className="clients-secondary-btn"
                                        onClick={() => openClientTracking(client)}
                                    >
                                        Track progress
                                    </button>

                                    <button
                                        type="button"
                                        className="clients-secondary-btn"
                                        onClick={() => handleRemoveClient(client.clientId)}
                                        disabled={activeActionKey === `remove-${client.clientId}`}
                                    >
                                        {activeActionKey === `remove-${client.clientId}` ? "Removing..." : "Remove client"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientsPage;
