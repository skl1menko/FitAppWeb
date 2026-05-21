import {IoMdPerson} from "../../../assets/icons";
import "./SearchResultCard.scss";

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
    const cardClasses = cardClassName || "trainer-result-card";
    const headClasses = headClassName || "trainer-card-head";
    const avatarClasses = avatarClassName || "trainer-card-avatar";
    const infoClasses = infoClassName || "trainer-result-info";
    const metaClasses = metaClassName || "trainer-meta-text";
    const actionButtonClasses = actionButtonClassName || "trainer-action-btn";

    return (
        <div className={cardClasses}>
            <div className={headClasses}>
                <div className={avatarClasses}>
                    <IoMdPerson />
                </div>
                <div className={infoClasses}>
                    <strong>{name}</strong>
                    <p>{email}</p>
                    {meta && <p className={metaClasses}>{meta}</p>}
                </div>
            </div>
            <button
                type="button"
                className={actionButtonClasses}
                onClick={onAction}
                disabled={disabled}
            >
                {buttonLabel}
            </button>
        </div>
    );
};

export default SearchResultCard;
