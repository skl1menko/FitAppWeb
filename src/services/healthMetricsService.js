import api from './api';

const healthMetricsService = {
    getAll: (period_type = null) => {
        const params = period_type ? {period_type} : {};
        return api.get('/health-metrics',{params});
    },

    getByWorkout: (workout_id) =>{
        return api.get(`/health-metrics/workout/${workout_id}`);
    },

    getByPeriod: (type, start_date, end_date) => {
        return api.get(`/health-metrics/period/${type}`,{
            params:{
                start_date,
                end_date
            }
        });
    }
};

export default healthMetricsService;