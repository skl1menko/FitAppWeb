import { FormControl, MenuItem, Select } from "@mui/material";
import { IoMdPerson } from "../../../../assets/icons";

const ManagedClientsSection = ({
    clients = [],
    programs = [],
    selectedProgramByClient = {},
    isLoadingClients = false,
    activeActionKey = "",
    activeProgramClientId = null,
    onProgramChange,
    onAssignProgram,
    onOpenClientTracking,
    onRemoveClient
}) => {
    return (
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
                            <span>Training program</span>
                            <div className="clients-program-dropdown">
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={selectedProgramByClient[client.clientId] || "none"}
                                        onChange={(event) => onProgramChange(client.clientId, event.target.value)}
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
                                    onClick={() => onAssignProgram(client.clientId)}
                                    disabled={activeProgramClientId === client.clientId}
                                >
                                    {activeProgramClientId === client.clientId ? "Applying..." : "Apply"}
                                </button>
                            </div>
                        </div>
                        <div className="action-cont">
                            <button
                                type="button"
                                className="clients-secondary-btn"
                                onClick={() => onOpenClientTracking(client)}
                            >
                                Track progress
                            </button>

                            <button
                                type="button"
                                className="clients-secondary-btn"
                                onClick={() => onRemoveClient(client.clientId)}
                                disabled={activeActionKey === `remove-${client.clientId}`}
                            >
                                {activeActionKey === `remove-${client.clientId}` ? "Removing..." : "Remove client"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagedClientsSection;
