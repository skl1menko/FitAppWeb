import "./WorkoutSessionPage.scss";
import useBodyClass from "../../hooks/useBodyClass";
import { FaRegClock, GiWeight, FaPlus } from "../../assets/icons";
import Timer from "./components/Timer";
import FinishWorkoutModal from "./components/FinishWorkoutModal";
import CancelWorkoutConfirmModal from "./components/CancelWorkoutConfirmModal";
import CustomBtn from "../../components/CustomBtn";
import useWorkoutSession from "./hooks/useWorkoutSession";
import { formatDuration } from "./utils/sessionTime";

const WorkoutSessionPage = () => {
    const {
        isSessionReady,
        isFinishModalOpen,
        isCancelConfirmOpen,
        workoutName,
        workoutNameError,
        summaryStats,
        openFinishModal,
        closeFinishModal,
        openCancelConfirmModal,
        closeCancelConfirmModal,
        handleWorkoutNameChange,
        confirmFinishWorkout,
        cancelWorkout
    } = useWorkoutSession();

    useBodyClass("workout-session-page-body");

    return (
        <div className="workout-session-cont">
            <div className="workout-session-content">
                <div className="end-workout-btn">
                    <CustomBtn text="FINISH WORKOUT" onClick={openFinishModal} />
                    <CustomBtn text="CANCEL" onClick={openCancelConfirmModal} className="cancel-btn" />
                </div>
                <div className="workout-info-cont">
                    <div className="info-block">
                        <div className="info-icon timer">
                            <FaRegClock size={28} />
                        </div>
                        <div className="info-cont timer">
                            <span className="info-label timer">TIME</span>
                            {isSessionReady && <Timer  />}
                        </div>
                    </div>
                    <div className="info-block">
                        <div className="info-icon tonnage">
                            <GiWeight size={28} />
                        </div>
                        <div className="info-cont tonnage">
                            <span className="info-label tonnage">TONNAGE</span>

                        </div>
                    </div>
                </div>
                <div className="exercise-cont">
                    <div className="add-exercise">
                        <CustomBtn icon={<FaPlus />} text="Add exercise" onClick={() => { }} className="add-exercise-btn"/>
                    </div>
                    <div className="exercise-list">

                    </div>
                </div>
            </div>
            <FinishWorkoutModal
                isOpen={isFinishModalOpen}
                workoutName={workoutName}
                workoutNameError={workoutNameError}
                timeText={formatDuration(summaryStats.timeSeconds)}
                tonnage={summaryStats.tonnage}
                setsCount={summaryStats.setsCount}
                onClose={closeFinishModal}
                onCancel={openCancelConfirmModal}
                onSave={confirmFinishWorkout}
                onWorkoutNameChange={handleWorkoutNameChange}
            />
            <CancelWorkoutConfirmModal
                isOpen={isCancelConfirmOpen}
                onClose={closeCancelConfirmModal}
                onConfirm={cancelWorkout}
            />
        </div>
    )
}

export default WorkoutSessionPage;