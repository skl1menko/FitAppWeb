import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickerDay } from '@mui/x-date-pickers/PickerDay';
import { Popover } from '@mui/material';
import workoutService from '../../../../services/WorkoutServices/workoutService';
import './WorkoutCalendarCard.scss';

const getDuration = (start, end) => {
    if (!start || !end) return null;
    const minutes = Math.round((new Date(end) - new Date(start)) / 60000);
    return minutes > 0 ? minutes : null;
};

const formatWorkoutTime = (startTime) => {
    if (!startTime) return 'No time';
    return dayjs(startTime).format('HH:mm');
};

const DayWithWorkoutBadge = (props) => {
    const { day, outsideCurrentMonth, workoutsByDate, onDayClick, ...other } = props;
    const dateKey = day.format('YYYY-MM-DD');
    const hasWorkout = !outsideCurrentMonth && Boolean(workoutsByDate[dateKey]?.length);

    const dayNode = (
        <PickerDay
            {...other}
            day={day}
            outsideCurrentMonth={outsideCurrentMonth}
            onClick={(event) => {
                other.onClick?.(event);
                onDayClick(event, dateKey, hasWorkout);
            }}
        />
    );

    if (!hasWorkout) {
        return dayNode;
    }

    return (
        <PickerDay
            {...other}
            day={day}
            outsideCurrentMonth={outsideCurrentMonth}
            className="has-workout-day"
            onClick={(event) => {
                other.onClick?.(event);
                onDayClick(event, dateKey, hasWorkout);
            }}
        />
    );
};

const WorkoutCalendarCard = () => {
    const [workouts, setWorkouts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeDateKey, setActiveDateKey] = useState(null);

    useEffect(() => {
        workoutService
            .getAll()
            .then((res) => {
                setWorkouts(res?.data?.data || []);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке тренировок для календаря:', error);
            });
    }, []);

    const workoutsByDate = useMemo(() => {
        return workouts.reduce((acc, workout) => {
            if (!workout?.startTime) return acc;

            const dateKey = dayjs(workout.startTime).format('YYYY-MM-DD');
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(workout);

            return acc;
        }, {});
    }, [workouts]);

    const activeDateWorkouts = activeDateKey ? workoutsByDate[activeDateKey] || [] : [];

    const handleDateClick = (event, dateKey, hasWorkout) => {
        if (!hasWorkout) {
            setAnchorEl(null);
            setActiveDateKey(null);
            return;
        }

        setAnchorEl(event.currentTarget);
        setActiveDateKey(dateKey);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setActiveDateKey(null);
    };

    useEffect(() => {
        if (!anchorEl || !activeDateWorkouts.length) return;

        const handleScroll = () => {
            handlePopoverClose();
        };

        // Use capture to catch scroll events from nested scrollable containers too.
        window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
        window.addEventListener('touchmove', handleScroll, { capture: true, passive: true });
        window.addEventListener('wheel', handleScroll, { capture: true, passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('touchmove', handleScroll, true);
            window.removeEventListener('wheel', handleScroll, true);
        };
    }, [anchorEl, activeDateWorkouts.length]);

    return(
        <div className="workout-calendar-card">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    views={['month', 'day']}
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    slots={{ day: DayWithWorkoutBadge }}
                    slotProps={{
                        day: ({ day, outsideCurrentMonth }) => ({
                            day,
                            outsideCurrentMonth,
                            workoutsByDate,
                            onDayClick: handleDateClick,
                        }),
                    }}
                />
            </LocalizationProvider>

            <Popover
                open={Boolean(anchorEl && activeDateWorkouts.length)}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                disableScrollLock
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{
                    paper: {
                        className: 'workout-day-popover-paper',
                    },
                }}
            >
                <div className="workout-day-popover">
                    
                    {activeDateWorkouts.map((workout) => {
                        const duration = getDuration(workout.startTime, workout.endTime);

                        return (
                            <div key={workout.workoutId} className="workout-day-popover__item">
                                <p className="workout-day-popover__name">{workout.workoutName || 'Workout'}</p>
                                <p className="workout-day-popover__meta">
                                    {formatWorkoutTime(workout.startTime)}
                                    {duration ? ` · ${duration} min` : ''}
                                    {workout.caloriesBurned != null ? ` · ${Math.round(workout.caloriesBurned)} kcal` : ''}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </Popover>

        </div>
         
    )
}

export default WorkoutCalendarCard;