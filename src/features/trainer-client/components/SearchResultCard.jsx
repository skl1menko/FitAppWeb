import {IoMdPerson} from "../../../assets/icons";

const SearchResultCard = ({
    name,
    email,
    meta,
    buttonLabel,
    onAction,
    disabled,
    cardClassName,
    headClassName,
    avatarClassName,
    infoClassName,
    metaClassName,
    actionButtonClassName
}) => {
    return (
        <div className={cardClassName}>
            <div className={headClassName}>
                <div className={avatarClassName}>
                    <IoMdPerson />
                </div>
                <div className={infoClassName}>
                    <strong>{name}</strong>
                    <p>{email}</p>
                    {meta && <p className={metaClassName}>{meta}</p>}
                </div>
            </div>
            <button
                type="button"
                className={actionButtonClassName}
                onClick={onAction}
                disabled={disabled}
            >
                {buttonLabel}
            </button>
        </div>
    );
};

export default SearchResultCard;
