const profile = {
    hero: {
        title: "My profile",
        description: "Manage your personal details, profile photo and body measurements in one place.",
    },
    personalInfo: {
        title: "Personal info",
        description: "Update the photo and the name shown across the app.",
        loading: "Loading profile...",
        uploadAria: "Upload profile photo",
        avatarAlt: "Profile",
        photoTitle: "Profile photo",
        photoDescription: "Upload a square image to personalize your account.",
        changePhoto: "Change photo",
        name: "Name",
        namePlaceholder: "Enter your name",
        email: "Registered email",
        emailPlaceholder: "Email",
    },
    measurements: {
        title: "Body measurements",
        description: "Save a new snapshot of your stats to build measurement history over time.",
        progressTitle: "Measurement progress",
        progressDescription: "Track how your body measurements change across saved snapshots.",
        progressLoading: "Loading progress...",
        progressEmpty: "No measurement history yet. Save your stats to start tracking changes.",
        fields: {
            height: "Height",
            weight: "Weight",
            chest: "Chest",
            waist: "Waist",
            hips: "Hips",
            biceps: "Biceps",
        },
        units: {
            cm: "cm",
            kg: "kg",
        },
    },
    summary: {
        title: "Your summary",
        description: "Quick access to the key personal details stored on this page.",
        name: "Name",
        email: "Email",
        measurementsFilled: "Measurements filled",
        notSet: "Not set",
        tip: "Keep measurements up to date to make future progress tracking easier.",
        saving: "Saving...",
        saveChanges: "Save changes",
    },
    errors: {
        loadProfileFailed: "Failed to load profile.",
        nameRequired: "Name is required.",
        saveProfileFailed: "Failed to save profile. Check Cloudinary preset and backend availability.",
    },
    success: {
        profileUpdated: "Profile updated successfully.",
    },
};

export default profile;
