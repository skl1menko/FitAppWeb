import CustomBtn from "../../../components/CustomBtn";

const WorkoutSessionActions = ({
    isPlannedMode = false,
    onCancel = null,
    onFinish = null,
    onOpenCancelConfirm = null,
    onStartNow = null
}) => {
    return (
        <div className="end-workout-btn">
            <CustomBtn
                text={isPlannedMode ? "SAVE WORKOUT" : "FINISH WORKOUT"}
                onClick={onFinish}
            />
            {isPlannedMode ? (
                <CustomBtn
                    text="START NOW"
                    onClick={onStartNow}
                    className="start-now-btn"
                />
            ) : null}
            <CustomBtn
                text={isPlannedMode ? "DELETE" : "CANCEL"}
                onClick={isPlannedMode ? onCancel : onOpenCancelConfirm}
                className="cancel-btn"
            />
        </div>
    );
};

export default WorkoutSessionActions;
