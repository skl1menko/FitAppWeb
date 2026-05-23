import {IoMdPerson} from "../../../assets/icons";
import "./SearchResultCard.scss";

const VARIANT_CLASSES = {
    trainer: {
        card: "trainer-result-card",
        head: "trainer-card-head",
        avatar: "trainer-card-avatar",
        info: "trainer-result-info",
        meta: "trainer-meta-text",
        actionButton: "trainer-action-btn"
    },
    clients: {
        card: "clients-result-card",
        head: "clients-card-head",
        avatar: "clients-card-avatar",
        info: "clients-result-info",
        meta: "clients-meta-text",
        actionButton: "clients-action-btn"
    }
};

const SearchResultCard = ({
    name,
    email,
    meta,
    buttonLabel,
    onAction,
    disabled,
    variant = "trainer",
    cardClassName,
    headClassName,
    avatarClassName,
    infoClassName,
    metaClassName,
    actionButtonClassName
}) => {
    const variantClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.trainer;
    const cardClasses = cardClassName || variantClasses.card;
    const headClasses = headClassName || variantClasses.head;
    const avatarClasses = avatarClassName || variantClasses.avatar;
    const infoClasses = infoClassName || variantClasses.info;
    const metaClasses = metaClassName || variantClasses.meta;
    const actionButtonClasses = actionButtonClassName || variantClasses.actionButton;

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
