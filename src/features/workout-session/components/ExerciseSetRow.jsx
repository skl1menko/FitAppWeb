import { memo } from "react";
import "./ExerciseSetRow.scss";
import CustomBtn from "../../../components/CustomBtn";
import { LuX } from "../../../assets/icons";
import { useTranslation } from "react-i18next";

const ExerciseSetRow = ({
    index,
    set,
    isPlannedMode,
    values,
    checked,
    onValueChange,
    onCheckedChange,
    onDelete
}) => {
    const { t } = useTranslation();
    const FIELD_CONFIG = [
        { key: "weight_kg", label: t('workout_session.exerciseSetRow.weightKg'), placeholder: t('workout_session.exerciseSetRow.placeholders.kg'), inputMode: "numeric", pattern: "[0-9]*" },
        { key: "reps", label: t('workout_session.exerciseSetRow.reps'), placeholder: t('workout_session.exerciseSetRow.placeholders.reps'), inputMode: "numeric", pattern: "[0-9]*" },
        { key: "rpe", label: t('workout_session.exerciseSetRow.rpe'), placeholder: t('workout_session.exerciseSetRow.placeholders.rpe'), inputMode: "numeric", pattern: "[0-9]*" }
    ];
    const isPendingCreate = Boolean(set?.isPendingCreate);

    return (
        <div className="set-cont">
            <span className="id-set-cont">{index + 1}</span>
            {FIELD_CONFIG.map((field) => (
                <div className="set-value-cont" key={field.key}>
                    <span className="set-label">{field.label}</span>
                    <input
                        className="set-value"
                        type="text"
                        inputMode={field.inputMode}
                        pattern={field.pattern}
                        placeholder={field.placeholder}
                        disabled={isPendingCreate}
                        value={values[field.key]}
                        onChange={(event) => onValueChange(field.key, event.target.value)}
                    />
                </div>
            ))}
            {!isPlannedMode ? (
                <div className="check-box-cont">
                    <input
                        type="checkbox"
                        disabled={isPendingCreate}
                        checked={checked}
                        onChange={(event) => onCheckedChange(event.target.checked)}
                    />
                </div>
            ) : null}
            <div className="delete-set-btn-cont">
                <CustomBtn
                    icon={<LuX size={14} />}
                    disabled={isPendingCreate}
                    onClick={onDelete}
                    className="delete-set-btn"
                />
            </div>
        </div>
    );
};

const areEqual = (prevProps, nextProps) => {
    return (
        prevProps.index === nextProps.index &&
        prevProps.set?.setId === nextProps.set?.setId &&
        prevProps.set?.isPendingCreate === nextProps.set?.isPendingCreate &&
        prevProps.isPlannedMode === nextProps.isPlannedMode &&
        prevProps.values?.weight_kg === nextProps.values?.weight_kg &&
        prevProps.values?.reps === nextProps.values?.reps &&
        prevProps.values?.rpe === nextProps.values?.rpe &&
        prevProps.checked === nextProps.checked
    );
};

export default memo(ExerciseSetRow, areEqual);
