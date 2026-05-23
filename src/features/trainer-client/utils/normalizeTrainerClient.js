import { normalizeWorkout } from "../../workout/utils/normalizeWorkout";

const toOptionalNumber = (value) => {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
};

const toOptionalBoolean = (value) => {
    if (typeof value === "boolean") {
        return value;
    }

    if (value === 1 || value === "1") {
        return true;
    }

    if (value === 0 || value === "0") {
        return false;
    }

    return null;
};

export const normalizeTrainer = (trainer = {}) => ({
    ...trainer,
    trainerId: toOptionalNumber(trainer?.trainerId ?? trainer?.trainer_id ?? trainer?.id),
    trainerName: trainer?.trainerName ?? trainer?.trainer_name ?? trainer?.name ?? "",
    trainerEmail: trainer?.trainerEmail ?? trainer?.trainer_email ?? trainer?.email ?? ""
});

export const normalizeTrainers = (trainers = []) => (
    Array.isArray(trainers) ? trainers.map(normalizeTrainer) : []
);

export const normalizeAthlete = (athlete = {}) => ({
    ...athlete,
    athleteId: toOptionalNumber(athlete?.athleteId ?? athlete?.athlete_id ?? athlete?.clientId ?? athlete?.client_id ?? athlete?.id),
    clientId: toOptionalNumber(athlete?.clientId ?? athlete?.client_id ?? athlete?.athleteId ?? athlete?.athlete_id ?? athlete?.id),
    athleteName: athlete?.athleteName ?? athlete?.athlete_name ?? athlete?.clientName ?? athlete?.client_name ?? athlete?.name ?? "",
    clientName: athlete?.clientName ?? athlete?.client_name ?? athlete?.athleteName ?? athlete?.athlete_name ?? athlete?.name ?? "",
    athleteEmail: athlete?.athleteEmail ?? athlete?.athlete_email ?? athlete?.clientEmail ?? athlete?.client_email ?? athlete?.email ?? "",
    clientEmail: athlete?.clientEmail ?? athlete?.client_email ?? athlete?.athleteEmail ?? athlete?.athlete_email ?? athlete?.email ?? "",
    isAssignedToYou: toOptionalBoolean(athlete?.isAssignedToYou ?? athlete?.is_assigned_to_you) ?? false,
    assignedTrainer: athlete?.assignedTrainer ? normalizeTrainer(athlete.assignedTrainer) : null
});

export const normalizeAthletes = (athletes = []) => (
    Array.isArray(athletes) ? athletes.map(normalizeAthlete) : []
);

export const normalizeClient = (client = {}) => ({
    ...client,
    clientId: toOptionalNumber(client?.clientId ?? client?.client_id ?? client?.athleteId ?? client?.athlete_id ?? client?.id),
    athleteId: toOptionalNumber(client?.athleteId ?? client?.athlete_id ?? client?.clientId ?? client?.client_id ?? client?.id),
    clientName: client?.clientName ?? client?.client_name ?? client?.athleteName ?? client?.athlete_name ?? client?.name ?? "",
    athleteName: client?.athleteName ?? client?.athlete_name ?? client?.clientName ?? client?.client_name ?? client?.name ?? "",
    clientEmail: client?.clientEmail ?? client?.client_email ?? client?.athleteEmail ?? client?.athlete_email ?? client?.email ?? "",
    athleteEmail: client?.athleteEmail ?? client?.athlete_email ?? client?.clientEmail ?? client?.client_email ?? client?.email ?? ""
});

export const normalizeClients = (clients = []) => (
    Array.isArray(clients) ? clients.map(normalizeClient) : []
);

export const normalizeTrainerRequest = (request = {}) => ({
    ...request,
    athlete: request?.athlete ? normalizeAthlete(request.athlete) : null,
    trainer: request?.trainer ? normalizeTrainer(request.trainer) : null
});

export const normalizeTrainerRequests = (requests = []) => (
    Array.isArray(requests) ? requests.map(normalizeTrainerRequest) : []
);

export const normalizeClientWorkout = (workout = {}) => ({
    ...normalizeWorkout(workout),
    exerciseCount: Number(workout?.exerciseCount ?? workout?.exercise_count ?? 0) || 0
});

export const normalizeClientWorkouts = (workouts = []) => (
    Array.isArray(workouts) ? workouts.map(normalizeClientWorkout) : []
);

export const normalizeTrainerClientInfo = (client = {}) => {
    const normalizedClient = normalizeClient(client);

    return {
        clientId: normalizedClient.clientId,
        clientName: normalizedClient.clientName || "Client",
        clientEmail: normalizedClient.clientEmail || ""
    };
};

export const normalizeTrainerClientWorkoutDetails = (payload = {}) => ({
    client: payload?.client ? normalizeTrainerClientInfo(payload.client) : null,
    workout: payload?.workout ? normalizeClientWorkout(payload.workout) : null
});
