import { useState } from "react";

const useWorkoutSessionModals = () => {
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
    const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);

    const openFinishModal = () => {
        setIsCancelConfirmOpen(false);
        setIsAddExerciseModalOpen(false);
        setIsFinishModalOpen(true);
    };

    const closeFinishModal = () => {
        setIsFinishModalOpen(false);
    };

    const openCancelConfirmModal = () => {
        setIsFinishModalOpen(false);
        setIsAddExerciseModalOpen(false);
        setIsCancelConfirmOpen(true);
    };

    const closeCancelConfirmModal = () => {
        setIsCancelConfirmOpen(false);
    };

    const openAddExerciseModal = () => {
        setIsFinishModalOpen(false);
        setIsCancelConfirmOpen(false);
        setIsAddExerciseModalOpen(true);
    };

    const closeAddExerciseModal = () => {
        setIsAddExerciseModalOpen(false);
    };

    const resetModals = () => {
        setIsFinishModalOpen(false);
        setIsCancelConfirmOpen(false);
        setIsAddExerciseModalOpen(false);
    };

    return {
        isFinishModalOpen,
        isCancelConfirmOpen,
        isAddExerciseModalOpen,
        openFinishModal,
        closeFinishModal,
        openCancelConfirmModal,
        closeCancelConfirmModal,
        openAddExerciseModal,
        closeAddExerciseModal,
        resetModals
    };
};

export default useWorkoutSessionModals;
