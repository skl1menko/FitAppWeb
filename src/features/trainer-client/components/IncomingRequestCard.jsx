import {FaCheck, IoMdPerson, MdOutlineCancel} from "../../../assets/icons";
import CustomBtn from "../../../components/CustomBtn";
import "./IncomingRequestCard.scss";

const VARIANT_CLASSES = {
    trainer: {
        card: "trainer-result-card trainer-request-card",
        head: "trainer-card-head",
        avatar: "trainer-card-avatar",
        info: "trainer-result-info",
        actions: "trainer-request-actions trainer-request-actions-compact",
        approveButton: "trainer-request-icon-btn trainer-request-approve-btn",
        rejectButton: "trainer-request-icon-btn trainer-request-reject-btn"
    },
    clients: {
        card: "clients-result-card",
        head: "clients-card-head",
        avatar: "clients-card-avatar",
        info: "clients-result-info",
        actions: "clients-request-actions",
        approveButton: "apply-btn",
        rejectButton: "cancel-btn"
    }
};

const IncomingRequestCard = ({
    athleteId,
    trainerId,
    name,
    email,
    activeActionKey,
    onApprove,
    onReject,
    variant = "trainer",
    cardClassName,
    headClassName,
    avatarClassName,
    infoClassName,
    actionsClassName,
    approveButtonClassName,
    rejectButtonClassName
}) => {
    const approveKey = `approve-${athleteId}-${trainerId}`;
    const rejectKey = `reject-${athleteId}-${trainerId}`;
    const isApproving = activeActionKey === approveKey;
    const isRejecting = activeActionKey === rejectKey;
    const variantClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.trainer;
    const cardClasses = cardClassName || variantClasses.card;
    const headClasses = headClassName || variantClasses.head;
    const avatarClasses = avatarClassName || variantClasses.avatar;
    const infoClasses = infoClassName || variantClasses.info;
    const actionsClasses = actionsClassName || variantClasses.actions;
    const rejectButtonClasses = rejectButtonClassName || variantClasses.rejectButton;
    const approveButtonClasses = approveButtonClassName || variantClasses.approveButton;

    return (
        <div className={cardClasses}>
            <div className={headClasses}>
                <div className={avatarClasses}>
                    <IoMdPerson />
                </div>
                <div className={infoClasses}>
                    <strong>{name}</strong>
                    <p>{email}</p>
                </div>
            </div>
            <div className={actionsClasses}>
                <CustomBtn
                    icon={<MdOutlineCancel size={20} />}
                    className={rejectButtonClasses}
                    onClick={() => onReject(athleteId, trainerId)}
                    disabled={isApproving || isRejecting}
                />
                <CustomBtn
                    icon={<FaCheck />}
                    className={approveButtonClasses}
                    onClick={() => onApprove(athleteId, trainerId)}
                    disabled={isApproving || isRejecting}
                />
            </div>
        </div>
    );
};

export default IncomingRequestCard;
