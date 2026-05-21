import api from './api';

const USER_STORAGE_KEY = 'user';
const TOKEN_STORAGE_KEY = 'token';
const PROFILE_UPDATED_EVENT = 'profileUpdated';

const getStoredUser = () => {
    const user = localStorage.getItem(USER_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
};

const saveStoredUser = (user) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, {detail: user}));
};

const authService ={
    register: async (email, password, full_name, role) => {
        const response = await api.post('/auth/register', {
            email,
            password,
            full_name,
            role
        });

        if (response.data.data) {
            localStorage.setItem(TOKEN_STORAGE_KEY, response.data.data.token);
            saveStoredUser(response.data.data);
        }

        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login',{
            email,
            password
        });

        if (response.data.data) {
            localStorage.setItem(TOKEN_STORAGE_KEY, response.data.data.token);
            saveStoredUser(response.data.data);
        }

        return response.data;
    },

    loginWithGoogle: async (role = '') => {
        const base = 'http://localhost:3000/api';
        window.location.href = `${base}/auth/google?role=${role}`;
    },

    completeGoogleRole: async (setupToken, role) => {
        const response = await api.post('/auth/google/complete-role', {
            setup_token: setupToken,
            role
        });

        if (response.data.data) {
            localStorage.setItem(TOKEN_STORAGE_KEY, response.data.data.token);
            saveStoredUser(response.data.data);
        }

        return response.data;
    },
    
    logout: () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_STORAGE_KEY);
    },

    getUser: () => {
        return getStoredUser();
    },

    setUser: (user) => {
        saveStoredUser(user);
    },

    mergeUser: (patch) => {
        const currentUser = getStoredUser() || {};
        const nextUser = {
            ...currentUser,
            ...patch
        };
        saveStoredUser(nextUser);
        return nextUser;
    },

    PROFILE_UPDATED_EVENT
};

export default authService;
