import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickerDay } from '@mui/x-date-pickers/PickerDay';
import { Popover } from '@mui/material';
import useDashboardWorkouts from '../../hooks/useDashboardWorkouts';
import {
    formatWorkoutTime,
    getWorkoutDateKey,
    getWorkoutDurationMinutes
} from '../../utils/dashboardWorkoutUtils';
import './WorkoutCalendarCard.scss';
import { useTranslation } from 'react-i18next';
import dashboard from '../../../../i18n/locales/en/dashboard';

const DayWithWorkoutBadge = (props) => {
    const { day, outsideCurrentMonth, workoutsByDate, onDayClick, ...other } = props;
    const dateKey = day.format('YYYY-MM-DD');
    const hasWorkout = !outsideCurrentMonth && Boolean(workoutsByDate[dateKey]?.length);
    const dayClassName = hasWorkout ? "has-workout-day" : undefined;

    return (
        <PickerDay
            {...other}
            day={day}
            outsideCurrentMonth={outsideCurrentMonth}
            className={dayClassName}
            onClick={(event) => {
                other.onClick?.(event);
                onDayClick(event, dateKey, hasWorkout);
            }}
        />
    );
};

const WorkoutCalendarCard = () => {
    const { workouts } = useDashboardWorkouts();
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeDateKey, setActiveDateKey] = useState(null);

    const workoutsByDate = useMemo(() => {
        return workouts.reduce((acc, workout) => {
            const dateKey = getWorkoutDateKey(workout);

            if (!dateKey) {
                return acc;
            }

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
    const { t } = useTranslation();
    return (
        <div className="workout-calendar-card">
            <div className="calendar-header">
                <h2>{t('dashboard.workoutCalendar.calendarHeader')}</h2>
            </div>
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
                        const duration = getWorkoutDurationMinutes(workout);

                        return (
                            <div key={workout.workoutId} className="workout-day-popover__item">
                                <p className="workout-day-popover__name">{workout.workoutName || 'Workout'}</p>
                                <p className="workout-day-popover__meta">
                                    {formatWorkoutTime(workout)}
                                    {duration ? ` · ${duration} min` : ''}
                                    {workout.caloriesBurned != null ? ` · ${Math.round(workout.caloriesBurned)} kcal` : ''}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </Popover>
        </div>
    );
};

export default WorkoutCalendarCard;
