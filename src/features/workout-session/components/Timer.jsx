import useWorkoutTimer from "../hooks/useWorkoutTimer";

function Timer({ startAt: externalStartAt = null }) {
    const { timeText } = useWorkoutTimer(externalStartAt);

    return <span className="timer-span">{timeText}</span>;
}

export default Timer;
