import { memo } from "react";
import "./ExerciseSetRow.scss";
import CustomBtn from "../../../components/CustomBtn";
import { LuX } from "../../../assets/icons";

const FIELD_CONFIG = [
    { key: "weight_kg", label: "WEIGHT KG", placeholder: "KG" },
    { key: "reps", label: "REPS", placeholder: "REPS" },
    { key: "rpe", label: "RPE", placeholder: "RPE" }
];

const ExerciseSetRow = ({
    index,
    set,
    values,
    checked,
    onValueChange,
    onCheckedChange,
    onDelete
}) => {
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
                        placeholder={field.placeholder}
                        disabled={isPendingCreate}
                        value={values[field.key]}
                        onChange={(event) => onValueChange(field.key, event.target.value)}
                    />
                </div>
            ))}
            <div className="check-box-cont">
                <input
                    type="checkbox"
                    disabled={isPendingCreate}
                    checked={checked}
                    onChange={(event) => onCheckedChange(event.target.checked)}
                />
            </div>
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
        prevProps.values?.weight_kg === nextProps.values?.weight_kg &&
        prevProps.values?.reps === nextProps.values?.reps &&
        prevProps.values?.rpe === nextProps.values?.rpe &&
        prevProps.checked === nextProps.checked
    );
};

export default memo(ExerciseSetRow, areEqual);
