const dashboard = {
    stats: {
        stepsToday: 'Steps Today',
        caloriesBurned: 'Calories Burned',
        activeMinutes: 'Active Minutes',
        avgHeartRate: 'AVG Heart Rate',
    },
    units: {
        steps: 'steps',
        kcal: 'kcal',
        min: 'min',
        bpm: 'bpm',
    },
    activity: {
        title: 'Activity Overview'
    },
    goalCard:{
        goalHeader: 'Today\'s Goals',
        label:{
            steps: 'Steps',
            calories: 'Calories',
            activeMin: 'Active Min'
        },
        unit:{
            calories:' kcal',
            activeMin:' min'
        }
    },
    workoutCalendar:{
        calendarHeader: 'Workout Calendar'
    },
    recentWorkouts:{
        recentWorkoutsHeader: 'Recent Workouts',
        viewAll: 'View All ',
        noWorkouts: 'No completed workouts yet.',
    },
    noData: 'No data available.',
    loading: 'Loading dashboard data...',
    errorFallback: 'Failed to load dashboard data',
};

export default dashboard;
