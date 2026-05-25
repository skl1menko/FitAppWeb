import { useEffect, useMemo, useState } from "react";
import exerciseService from "../../../services/exercisesService";
import { normalizeExercise, normalizeExercises } from "../utils/normalizeExercise";
import { filterExercises } from "../utils/filterExercises";
import { useTranslation } from "react-i18next";

const useExercisesPageData = () => {
    const { t } = useTranslation();
    const [exercises, setExercises] = useState([]);
    const [customExercises, setCustomExercises] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("all");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isExercisesLoading, setIsExercisesLoading] = useState(true);
    const [exercisesError, setExercisesError] = useState("");
    const [isCustomLoading, setIsCustomLoading] = useState(false);
    const [customError, setCustomError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadExercises = async () => {
            setIsExercisesLoading(true);
            setExercisesError("");

            try {
                const response = await exerciseService.getAll();
                if (!isMounted) {
                    return;
                }

                setExercises(normalizeExercises(response?.data?.data));
            } catch {
                if (!isMounted) {
                    return;
                }

                setExercises([]);
                setExercisesError(t('exercises.errors.loadExercisesFailed'));
            } finally {
                if (isMounted) {
                    setIsExercisesLoading(false);
                }
            }
        };

        loadExercises();

        return () => {
            isMounted = false;
        };
    }, [t]);

    const handleGroupChange = (group) => {
        setSelectedGroup(group);

        if (group === "custom") {
            setIsCustomLoading(true);
            setCustomError("");

            exerciseService.getMyCustomExercise().then((response) => {
                setCustomExercises(normalizeExercises(response?.data?.data));
            }).catch(() => {
                setCustomExercises([]);
                setCustomError(t('exercises.errors.loadCustomExercisesFailed'));
            }).finally(() => {
                setIsCustomLoading(false);
            });
        }
    };

    const handleOpenCreateModal = () => {
        setIsCreateOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateOpen(false);
    };

    const handleCreatedExercise = (created) => {
        const normalizedExercise = normalizeExercise(created);

        setExercises((prev) => [normalizedExercise, ...prev]);
        setCustomExercises((prev) => [normalizedExercise, ...prev]);
        setSelectedGroup("custom");
        setIsCreateOpen(false);
    };

    const handleDeleteCustomExercise = (exercise) => {
        const exerciseId = exercise?.id;
        if (!exerciseId) {
            return;
        }

        exerciseService.deleteExercise(exerciseId).then(() => {
            setCustomExercises((prev) => prev.filter((item) => item?.id !== exerciseId));
            setExercises((prev) => prev.filter((item) => item?.id !== exerciseId));
        });
    };

    const filteredExercises = useMemo(() => (
        filterExercises({
            exercises,
            customExercises,
            selectedGroup
        })
    ), [customExercises, exercises, selectedGroup]);

    return {
        filteredExercises,
        selectedGroup,
        isCreateOpen,
        isExercisesLoading,
        exercisesError,
        isCustomLoading,
        customError,
        handleGroupChange,
        handleOpenCreateModal,
        handleCloseCreateModal,
        handleCreatedExercise,
        handleDeleteCustomExercise
    };
};

export default useExercisesPageData;
