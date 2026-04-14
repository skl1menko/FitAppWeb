
import axios from 'axios';
import api from './api';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'daehniaa8';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const exercisesService = {
    create: (exerciseData) => {
        return api.post('/exercises', exerciseData);
    },

    uploadImage: (file) => {
        if (!file) {
            throw new Error('Image file is required');
        }

        if (!CLOUDINARY_UPLOAD_PRESET) {
            throw new Error('Missing VITE_CLOUDINARY_UPLOAD_PRESET in frontend env');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'fitapp/exercises');

        const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

        return axios.post(uploadUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    getAll: () => {
        return api.get('/exercises');
    },

    getByMuscleGroup: (muscleGroup) => {
        return api.get(`/exercises/muscle/${muscleGroup}`);
    },

    getMyCustomExercise: () => {
        return api.get('/exercises/my');
    },

    getExerciseById: (exerciseId) => {
        return api.get(`/exercises/${exerciseId}`);
    },

    updateExercise: (exerciseId, name, muscleGroup, description, imageUrl) => {
        return api.put(`/exercises/${exerciseId}`, {name, muscle_group: muscleGroup, description, image_url: imageUrl});
    },
    
    deleteExercise: (exerciseId) => {
        return api.delete(`/exercises/${exerciseId}`);
    }
}

export default exercisesService;