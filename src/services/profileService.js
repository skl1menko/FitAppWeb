import authService from "./authService";
import profileApi from "./profile/profileApi";
import {
    buildBodyMeasurementsPayload,
    buildSaveProfilePayload,
    DEFAULT_BODY_MEASUREMENTS,
    formatProfileDateParam,
    MEASUREMENT_FIELD_MAP,
    mergeProfileSources,
    normalizeProfileBodyMeasurements,
    normalizeSaveProfileResult
} from "./profile/profileMappers";

const profileService = {
    getDefaultBodyMeasurements: () => ({...DEFAULT_BODY_MEASUREMENTS}),

    uploadProfileImage: profileApi.uploadProfileImage,

    getProfile: async () => {
        const responseUser = await profileApi.getProfile();
        const authUser = authService.getUser() || {};
        const profile = mergeProfileSources(authUser, responseUser);
        authService.mergeUser(profile);

        let latestMeasurement = {};
        try {
            latestMeasurement = await profileApi.getLatestBodyMeasurements();
        } catch (error) {
            if (Number(error?.response?.status) !== 404) {
                throw error;
            }
        }

        return {
            profile,
            bodyMeasurements: normalizeProfileBodyMeasurements(latestMeasurement)
        };
    },

    getMeasurementProgress: async (fieldKey, monthsBack = 6) => {
        const apiField = MEASUREMENT_FIELD_MAP[fieldKey];
        if (!apiField) {
            throw new Error("Unsupported measurement field");
        }

        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - monthsBack);

        return profileApi.getMeasurementProgress({
            field: apiField,
            startDate: formatProfileDateParam(startDate),
            endDate: formatProfileDateParam(endDate)
        });
    },

    saveProfile: async ({fullName, email, avatarUrl}) => {
        const profilePayload = buildSaveProfilePayload({fullName, email, avatarUrl});
        const responseUser = await profileApi.saveProfile(profilePayload);
        const mergedProfile = normalizeSaveProfileResult(
            responseUser,
            {
                fullName,
                email,
                avatarUrl
            },
            authService.getUser() || {}
        );

        authService.mergeUser(mergedProfile);

        return {profile: mergedProfile, savedToServer: true};
    },

    saveBodyMeasurements: async (bodyMeasurements) => {
        const {normalizedMeasurements, payload} = buildBodyMeasurementsPayload(bodyMeasurements);

        await profileApi.saveBodyMeasurements(payload);

        return {bodyMeasurements: normalizedMeasurements, savedToServer: true};
    }
};

export default profileService;
