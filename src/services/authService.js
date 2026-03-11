import api from './api';

const authService ={
    register: async (email, password, full_name, role) => {
        const response = await api.post('/auth/register', {
            email,
            password,
            full_name,
            role
        });

        if (response.data.data) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }

        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login',{
            email,
            password
        });

        if (response.data.data) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }

        return response.data;
    },

    loginWithGoogle: async (role = '') => {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        window.location.href = `${base}/auth/google?role=${role}`;
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export default authService;